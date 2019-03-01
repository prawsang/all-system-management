const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const PurchaseOrder = require("../models/PurchaseOrder");
const Withdrawal = require("../models/Withdrawal");
const Item = require("../models/Item");
const Model = require("../models/Model");
const ItemWithdrawal = require("../models/junction/ItemWithdrawal");
const BranchJob = require("../models/junction/BranchJob");
const BranchPO = require("../models/junction/BranchPO");
const Customer = require("../models/Customer");
const StoreType = require("../models/StoreType");
const Sequelize = require("sequelize");
const db = require("../config/database");
const Op = Sequelize.Op;
const tools = require("../utils/tools");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		include: {
			model: StoreType,
			as: "store_type"
		},
		search,
		search_term,
		model: Branch
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
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
		.catch(err => res.status(500).send(err));
});

// List of items in a branch
router.get("/:id/items/", async (req, res) => {
	const { id } = req.params;
	const { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		include: [
			{
				model: Withdrawal,
				where: {
					branch_id: {
						[Op.eq]: id
					}
				},
				as: "withdrawal"
			},
			{
				model: Item,
				as: "item",
				include: {
					model: Model,
					as: "model"
				}
			}
		],
		search,
		search_term,
		search_junction: 1,
		model: ItemWithdrawal
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

// List of branches with po but po has installed = false
router.get("/no-install", async (req, res) => {
	let { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		include: [
			{
				model: PurchaseOrder,
				as: "purchase_orders",
				where: {
					installed: {
						[Op.eq]: false
					}
				}
			},
			{
				model: Customer,
				as: "customer"
			}
		],
		search,
		search_term,
		model: Branch
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

// List of po_number of a branch
router.get("/:id/po", async (req, res) => {
	const { id } = req.params;
	let { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		where: {
			branch_id: {
				[Op.eq]: id
			}
		},
		include: [
			{
				model: PurchaseOrder,
				as: "po"
			}
		],
		search_junction: 0,
		model: BranchPO
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
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
		job_code
	} = req.body;
	Branch.create({
		branch_code,
		customer_code,
		name,
		store_type_id,
		address,
		province
	})
		.then(rows => res.send(rows))
		.catch(err => console.log(err));
});

// Edit Branch
router.put("/:id/edit", branchValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { id } = req.params;
	const { branch_code, name, store_type_id, address, province } = req.body;
	Branch.update(
		{
			branch_code,
			name,
			store_type_id,
			address,
			province
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
		.catch(err => res.status(500).send(err));
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
		branch_id: id,
		po_number
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
				.json({ errors: [{ msg: "This branch cannot be deleted", errors: err }] })
		);
});

module.exports = router;
