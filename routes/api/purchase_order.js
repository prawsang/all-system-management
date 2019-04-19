const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../../models/PurchaseOrder");
const Job = require("../../models/Job");
const Customer = require("../../models/Customer");
const Branch = require("../../models/Branch");
const StoreType = require("../../models/StoreType");
const BranchPO = require("../../models/junction/BranchPO");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	let { limit, page, search_col, search_term, from, to } = req.query;

	let filters = null;
	if (from && to) {
		const f = from ? `"purchase_orders"."date" >= :from` : null;
		const t = to ? `"purchase_orders"."date" <= :to` : null;
		filters = [f, t].filter(e => e).join(" AND ");
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${PurchaseOrder.getColumns},${Job.getColumns},${Customer.getColumns}`,
		tables: `"purchase_orders"
		LEFT OUTER JOIN "jobs" ON "purchase_orders"."job_code" = "jobs"."job_code" 
		LEFT OUTER JOIN "customers" ON "jobs"."customer_code" = "customers"."customer_code"`,
		availableCols: ["po_number", "customer_name", "customer_code", "job_name", "job_code"],
		where: filters,
		replacements: {
			from: from ? from : "",
			to: to ? to : ""
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:po_number/details", (req, res) => {
	const { po_number } = req.params;
	PurchaseOrder.findOne({
		where: { po_number: { [Op.eq]: po_number } },
		include: [
			{
				model: Job,
				as: "job",
				include: {
					model: Customer,
					as: "customer"
				}
			}
		]
	})
		.then(po => res.send({ po }))
		.catch(err => res.status(500).json({ errors: err }));
});

// get branches for po
router.get("/:po_number/branches", async (req, res) => {
	const { po_number } = req.params;
	let { limit, page, search_col, search_term, installed } = req.query;

	let filters = null;
	if (installed) {
		filters = installed === "true" ? `"branch_po"."installed"` : `NOT "branch_po"."installed"`;
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns},${StoreType.getColumns}, "branch_po"."installed"`,
		tables: `"branches"
		LEFT OUTER JOIN "branch_po" ON "branches"."id" = "branch_po"."branch_id" 
		LEFT OUTER JOIN "purchase_orders" ON "purchase_orders"."po_number" = "branch_po"."po_number"
		LEFT OUTER JOIN "store_types" ON "store_types"."id" = "branches"."store_type_id"`,
		availableCols: [
			"branch_code",
			"branch_name",
			"province",
			"store_type_name",
			"gl_branch",
			"short_code"
		],
		where: `"branch_po"."po_number" = :po_number ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			po_number
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const poValidation = [
	check("po_number")
		.not()
		.isEmpty()
		.withMessage("PO Number cannot be empty."),
	check("job_code")
		.not()
		.isEmpty()
		.withMessage("Job code cannot be empty."),
	check("description")
		.not()
		.isEmpty()
		.withMessage("PO description must be provided."),
	check("date")
		.not()
		.isEmpty()
		.withMessage("PO date must be provided.")
];

// Add PO information
router.post("/add", poValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { po_number, description, date, job_code } = req.body;
	PurchaseOrder.create({
		po_number,
		description,
		date,
		job_code
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit PO information (date and job_code cannot be edited)
router.put("/:po_number/edit", (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { po_number } = req.params;
	const { description } = req.body;
	PurchaseOrder.update(
		{
			description
		},
		{
			where: {
				po_number: {
					[Op.eq]: po_number
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Remove Branch from PO
router.delete("/:po_number/remove-branch", (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.query;
	BranchPO.destroy({
		where: {
			po_number: {
				[Op.eq]: po_number
			},
			branch_id: {
				[Op.eq]: branch_id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Add Branch to PO (if doesn't exist)
router.post("/:po_number/add-branches", [check("branches").isArray()], async (req, res) => {
	const { po_number } = req.params;
	const { branches } = req.body;
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	let errors = [];
	await Promise.all(
		branches.map(async e => {
			BranchPO.findOrCreate({
				where: {
					branch_id: e.id,
					po_number
				},
				defaults: {
					installed: e.installed
				}
			}).catch(err =>
				errors.push({ msg: `This branch (${e.id}) cannot be added to the PO.` })
			);
		})
	);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	res.sendStatus(200);
});

// Edit branch installation in a PO
router.put("/:po_number/edit-installed", [check("branches").isArray()], async (req, res) => {
	const { po_number } = req.params;
	const { branches } = req.body;
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	let errors = [];
	await Promise.all(
		branches.map(async e => {
			BranchPO.update(
				{
					installed: e.installed
				},
				{
					where: {
						po_number: {
							[Op.eq]: po_number
						},
						branch_id: {
							[Op.eq]: e.id
						}
					}
				}
			).catch(err => errors.push({ msg: `This branch (${e.id}) cannot be edited.` }));
		})
	);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	res.sendStatus(200);
});

// Delete PO (Superadmins Only)
router.delete("/:po_number", (req, res) => {
	const { po_number } = req.params;
	db.transaction(t =>
		BranchPO.destroy({
			where: {
				po_number: {
					[Op.eq]: po_number
				}
			}
		}).then(
			PurchaseOrder.destroy({
				where: {
					po_number: {
						[Op.eq]: po_number
					}
				}
			})
		)
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
