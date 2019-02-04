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

router.route("/type/:type").get(async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const { type } = req.params;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: {
			model: Model,
			as: "model",
			where: {
				type: {
					[Op.eq]: type
				}
			}
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
		.catch(err => res.status(500).send(err));
});

// Get item by status
router.get("/status/:status", async (req, res) => {
	const { status } = req.params;
	const { limit, page, search, search_term } = req.query;

	// Show return_by if borrowed
	const include =
		status == "borrowed"
			? [
					{
						model: Model,
						as: "model"
					},
					{
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
					}
			  ]
			: [
					{
						model: Model,
						as: "model"
					}
			  ];

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
		include,
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

// Add items to stock
router.post("/add", async (req, res) => {
	const { model_id, remarks, serial_no } = req.body;
	if (!model_id) {
		res.status(400).send([{ message: "Model is required." }]);
		return;
	}
	let errors = [];
	await Promise.all(
		serial_no.map(async no => {
			await Item.create({
				serial_no: no,
				model_id,
				remarks,
				status: "IN_STOCK",
				broken: false
			}).catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) res.status(500).send(errors);
	else res.sendStatus(200);
});

// Edit Item
router.put("/:serial_no/edit", (req, res) => {
	const { serial_no } = req.params;
	const { model_id, remarks } = req.body;
	if (!model_id) {
		res.status(400).send([{ message: "Model is required." }]);
		return;
	}
	Item.update(
		{
			model_id,
			remarks
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

module.exports = router;
