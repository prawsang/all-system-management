const express = require("express");
const router = express.Router();
const Branch = require("../../models/Branch");
const Job = require("../../models/Job");
const PurchaseOrder = require("../../models/PurchaseOrder");
const Item = require("../../models/Item");
const Model = require("../../models/Model");
const BranchJob = require("../../models/junction/BranchJob");
const BranchPO = require("../../models/junction/BranchPO");
const Customer = require("../../models/Customer");
const StoreType = require("../../models/StoreType");
const Sequelize = require("sequelize");
const db = require("../../config/database");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.get("/get-all", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns},${StoreType.getColumns}`,
		tables: `"branches" 
		JOIN "store_types" ON "branches"."store_type_id" = "store_types"."id"`,
		availableCols: [
			"branch_code",
			"branch_name",
			"province",
			"store_type_name",
			"gl_branch",
			"short_code"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.get("/:id/details", (req, res) => {
	const { id } = req.params;
	Branch.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: [
			{
				model: Job,
				as: "jobs"
			},
			{
				model: Customer,
				as: "customer"
			},
			{
				model: StoreType,
				as: "store_type"
			}
		]
	})
		.then(branch => res.send({ branch }))
		.catch(err => res.status(500).json({ errors: err }));
});

// List of items in a branch
router.get("/:id/items/", async (req, res) => {
	const { id } = req.params;
	const { limit, page, search_col, search_term, broken } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"item_withdrawal"
			JOIN "stock" ON "stock"."serial_no" = "item_withdrawal"."serial_no"
			JOIN "withdrawals" ON "withdrawals"."id" = "item_withdrawal"."withdrawal_id"
			JOIN "branches" ON "branches"."id" = "withdrawals"."branch_id"
			JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: `
			NOT "stock"."status" = 'IN_STOCK' 
			AND NOT "stock"."status" = 'RESERVED'
			AND "branches"."id" = :id
			${broken ? (broken === "true" ? `AND "stock"."broken"` : `AND NOT "stock"."broken"`) : ""}`,
		replacements: {
			id
		}
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors);
	} else {
		res.json(q);
	}
});

// List of branches with po but po has installed = false
router.get("/no-install", async (req, res) => {
	let { limit, page, search_col, search_term } = req.query;

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `
			${Branch.getColumns},
			${StoreType.getColumns},
			${Customer.getColumns},
			array_agg("branch_po"."po_number") AS "po_numbers"`,
		tables: `"branches"
		JOIN "branch_po" ON "branch_po"."branch_id" = "branches"."id"
		JOIN "customers" ON "branches"."customer_code" = "customers"."customer_code"
		JOIN "store_types" ON "branches"."store_type_id" = "store_types"."id"
		`,
		where: `NOT "branch_po"."installed"`,
		groupBy: `GROUP BY "branches"."id","store_types"."id","customers"."customer_code"`,
		availableCols: [
			"branch_code",
			"branch_name",
			"province",
			"store_type_name",
			"gl_branch",
			"short_code",
			"customer_name",
			"customer_code"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// List of po_number of a branch
router.get("/:id/po", async (req, res) => {
	const { id } = req.params;
	let { limit, page, search_col, search_term } = req.query;

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: PurchaseOrder.getColumns,
		tables: `"purchase_orders"
		JOIN "branch_po" ON "purchase_orders"."po_number" = "branch_po"."po_number"
		`,
		where: `"branch_po"."branch_id" = :id`,
		replacements: {
			id
		},
		availableCols: ["po_number"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const branchValidation = [
	check("customer_code")
		.not()
		.isEmpty()
		.withMessage("Customer must be provided."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Branch name must be provided."),
	check("store_type_id")
		.not()
		.isEmpty()
		.withMessage("Store type for this branch must be provided.")
		.toInt()
];

// Add New Branch
router.post("/add", branchValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const {
		branch_code,
		customer_code,
		name,
		store_type_id,
		address,
		province,
		gl_branch,
		short_code
	} = req.body;
	Branch.create({
		branch_code,
		customer_code,
		name,
		store_type_id,
		address,
		province,
		gl_branch,
		short_code
	})
		.then(rows => res.send(rows))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Branch
router.put("/:id/edit", branchValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { id } = req.params;
	const { branch_code, name, store_type_id, address, province, gl_branch, short_code } = req.body;
	Branch.update(
		{
			branch_code,
			name,
			store_type_id,
			address,
			province,
			gl_branch,
			short_code
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Remove Job from branch
router.delete("/:id/remove-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.body;
	if (!job_code) {
		res.status(400).send([{ msg: "Job code is required." }]);
		return;
	}
	BranchJob.destroy({
		where: {
			branch_id: {
				[Op.eq]: id
			},
			job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err =>
			res.status(500).json({
				errors: [{ msg: `This job (${job_code}) cannot be removed from the branch.` }]
			})
		);
});

router.post("/:id/add-job", async (req, res) => {
	const { id } = req.params;
	const { job_code } = req.body;
	if (!job_code) {
		res.status(400).json({ errors: [{ msg: "Job code is required." }] });
		return;
	}
	errors = [];

	await Promise.all(
		job_code.map(e =>
			BranchJob.findOrCreate({
				where: {
					job_code: e,
					branch_id: id
				}
			}).catch(err =>
				errors.push({
					errors: [{ msg: `This job (${job_code}) cannot be added to the branch.` }]
				})
			)
		)
	);

	if (errors.length > 0) {
		res.status(500).json({ errors });
	} else {
		res.sendStatus(200);
	}
});

// Remove PO from branch
router.delete("/:id/remove-po", (req, res) => {
	const { id } = req.params;
	const { po_number } = req.query;
	if (!po_number) {
		res.status(400).json({ errors: [{ msg: "Job code is required." }] });
		return;
	}
	BranchPO.destroy({
		where: {
			branch_id: {
				[Op.eq]: id
			},
			po_number: {
				[Op.eq]: po_number
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err =>
			res.status(500).json({
				errors: [{ msg: `This PO (${po_number}) cannot be removed from the branch.` }]
			})
		);
});
// Add PO to branch if PO doesn't exist for that branch
router.post("/:id/add-po", (req, res) => {
	const { id } = req.params;
	const { po_number } = req.body;
	if (!job_code) {
		res.status(400).json({ errors: [{ msg: "Job code is required." }] });
		return;
	}
	BranchPO.findOrCreate({
		where: {
			branch_id: id,
			po_number
		}
	})
		.then(r => res.sendStatus(200))
		.catch(err =>
			res
				.status(400)
				.json({ errors: [{ msg: "PO cannot be added to this branch", errors: err }] })
		);
});

// Delete branch
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	db.transaction(t =>
		BranchJob.destroy(
			{
				where: {
					branch_id: {
						[Op.eq]: id
					}
				}
			},
			{
				transaction: t
			}
		).then(r =>
			BranchPO.destroy(
				{
					where: {
						branch_id: {
							[Op.eq]: id
						}
					}
				},
				{
					transaction: t
				}
			).then(rr =>
				Branch.destroy(
					{
						where: {
							id: {
								[Op.eq]: id
							}
						}
					},
					{
						transaction: t
					}
				)
			)
		)
	)
		.then(r => res.sendStatus(200))
		.catch(err =>
			res
				.status(500)
				.json({ errors: [{ msg: "This branch cannot be deleted.", errors: err }] })
		);
});

module.exports = router;
