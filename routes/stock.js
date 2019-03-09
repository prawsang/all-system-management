const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Item = require("../models/Item");
const Model = require("../models/Model");
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Withdrawal = require("../models/Withdrawal");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const tools = require("../utils/tools");
const { check, validationResult } = require("express-validator/check");

router.use("/", require("./stock_status").router);

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: {
			model: Model,
			as: "model"
		},
		model: Item
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.get("/:serial_no/details", (req, res) => {
	const { serial_no } = req.params;
	Item.findOne({
		where: { serial_no: { [Op.eq]: serial_no } },
		include: [
			{
				model: Model,
				as: "model"
			},
			{
				model: Withdrawal,
				as: "withdrawals",
				include: [
					{
						model: Branch,
						as: "branch",
						include: {
							model: Customer,
							as: "customer"
						}
					},
					{
						model: Job,
						as: "job"
					}
				]
			},
			{
				model: Job,
				as: "reserve_job"
			},
			{
				model: Branch,
				as: "reserve_branch"
			}
		]
	})
		.then(item => {
			res.send({
				item
			});
		})
		.catch(err => res.status(500).json({ errors: err }));
});

// Get item by status
router.get("/status/:status", async (req, res) => {
	const { status } = req.params;
	const { limit, page, search, search_term, type } = req.query;

	// Show return_by if borrowed
	const borrowInclude = {
		model: Withdrawal,
		as: "withdrawals",
		include: [
			{
				model: Job,
				as: "job"
			},
			{
				model: Branch,
				as: "branch",
				include: {
					model: Customer,
					as: "customer"
				}
			}
		],
		where: {
			type: {
				[Op.eq]: "BORROW"
			}
		}
	};

	const include = {
		model: Model,
		as: "model",
		where: type
			? {
					type: {
						[Op.eq]: type
					}
			  }
			: null
	};

	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		where: {
			status: {
				[Op.eq]: status.toUpperCase()
			}
		},
		include: status === "borrowed" ? [borrowInclude, include] : [include],
		model: Item
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.get("/broken", async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		where: {
			broken: {
				[Op.eq]: true
			}
		},
		include: {
			model: Model,
			as: "model"
		},
		model: Item
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

// Get all items reserved by branch
router.get("/reserve-branch-id/:branch_id", async (req, res) => {
	const { branch_id } = req.params;
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		where: {
			reserve_branch_id: {
				[Op.eq]: branch_id
			}
		},
		include: {
			model: Model,
			as: "model"
		},
		model: Item
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

// Get all items reserved by job (customer)
router.get("/reserve-job-code/:job_code", async (req, res) => {
	const { job_code } = req.params;
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		where: {
			reserve_job_code: {
				[Op.eq]: job_code
			}
		},
		include: {
			model: Model,
			as: "model"
		},
		model: Item
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

const stockValidation = [
	check("model_id")
		.not()
		.isEmpty()
		.withMessage("Model must be provided."),
	check("stock_location")
		.not()
		.isEmpty()
		.withMessage("Stock location must be provided.")
];

// Add items to stock
router.post("/add", stockValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { model_id, remarks, serial_no, stock_location } = req.body;

	let errors = [];
	await Promise.all(
		serial_no.map(async no => {
			await Item.create({
				serial_no: no,
				model_id,
				remarks,
				status: "IN_STOCK",
				stock_location,
				broken: false
			}).catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) res.status(500).json({ errors });
	else res.sendStatus(200);
});

// Edit Item
router.put("/:serial_no/edit", stockValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { serial_no } = req.params;
	const { model_id, remarks, stock_location } = req.body;
	Item.update(
		{
			model_id,
			remarks,
			stock_location
		},
		{
			where: {
				serial_no: {
					[Op.eq]: serial_no
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete Item from Stock (superadmins only)
router.delete("/:serial_no", (req, res) => {
	const { serial_no } = req.params;
	Item.destroy({
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
