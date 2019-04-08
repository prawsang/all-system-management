const express = require("express");
const router = express.Router();
const Branch = require("../../models/Branch");
const Job = require("../../models/Job");
const Customer = require("../../models/Customer");
const StoreType = require("../../models/StoreType");
const PurchaseOrder = require("../../models/PurchaseOrder");
const BranchPO = require("../../models/junction/BranchPO");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const tools = require("../../utils/tools");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	let { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: [
			{
				model: Job,
				as: "job",
				include: {
					model: Customer,
					as: "customer"
				}
			}
		],
		model: PurchaseOrder
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
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

	let { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: [
			{
				model: Branch,
				as: "branch",
				include: {
					model: StoreType,
					as: "store_type"
				}
			}
		],
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		},
		search_junction: 0,
		model: BranchPO
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
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
