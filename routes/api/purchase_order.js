const express = require("express");
const router = express.Router();
const PurchaseOrder = require("../../models/PurchaseOrder");
const BranchPO = require("../../models/junction/BranchPO");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");
const {
	poFragment,
	jobFragment,
	customerFragment,
	branchFragment,
	storeTypeFragment
} = require("../../utils/fragments");

router.get("/get-all", async (req, res) => {
	let { limit, page, search_col, search_term, installed, from, to } = req.query;

	let filters = null;
	if (installed || (from && to)) {
		const installedFilter = installed
			? installed === "true"
				? `"installed"`
				: `NOT "installed"`
			: null;
		const dateFilter =
			from && to
				? `"purchase_orders"."date" >= :from AND "purchase_orders"."date" <= :to`
				: null;
		filters = [installedFilter, dateFilter].filter(e => e).join(" AND ");
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${poFragment},${jobFragment},${customerFragment}`,
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
	db.query(
		`
	SELECT
		${poFragment},
		${jobFragment},
		${customerFragment}
	FROM
		"purchase_orders"
		LEFT OUTER JOIN "jobs" ON "purchase_orders"."job_code" = "jobs"."job_code" 
		LEFT OUTER JOIN "customers" ON "jobs"."customer_code" = "customers"."customer_code"
	WHERE "po_number" = :po_number
	`,
		{
			replacements: {
				po_number
			},
			type: db.QueryTypes.SELECT
		}
	)
		.then(r => res.json(r[0]))
		.catch(err => res.status(500).json({ errors: err }));
});

// get branches for po
router.get("/:po_number/branches", async (req, res) => {
	const { po_number } = req.params;
	let { limit, page, search_col, search_term } = req.query;

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${branchFragment},${storeTypeFragment}`,
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
		where: `"branch_po"."po_number" = :po_number`,
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
	check("installed")
		.isBoolean()
		.withMessage("Please specified whether this PO is installed."),
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

	const { po_number, description, installed, date, job_code } = req.body;
	PurchaseOrder.create({
		po_number,
		description,
		installed,
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
	const { description, installed } = req.body;
	PurchaseOrder.update(
		{
			description,
			installed
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
router.post("/:po_number/add-branches", async (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.body;

	let errors = [];
	await Promise.all(
		branch_id.map(async id => {
			BranchPO.findOrCreate({
				where: {
					branch_id: id,
					po_number
				}
			}).catch(err => errors.push({ msg: `This branch (${no}) cannot be added to the PO.` }));
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
