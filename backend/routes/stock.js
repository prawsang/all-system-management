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

router.use("/", require("./stock_status"));

router.route("/get-all").get(async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Item.findAndCountAll()
		.then(c => (count = c.count))
		.catch(err => res.status(500).send({errors: [err]}));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);
	
	Item.findAll({
		offset,
		count,
		include: {
			model: Model,
			as: "model"
		}
	})
		.then(items => {
			res.send({
				data: {
					items,
					count,
					pagesCount
				}
			});
		})
		.catch(err => res.status(500).send({errors: [err]}))
});

router.get("/single/:serial_no",(req, res) => {
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
				data: {item}
			});
		})
		.catch(err => console.log(err));
});

// Get item by status
router.get("/status/:status", async (req, res) => {
	const { status } = req.params;

	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Item.findAndCountAll({
		where: {
			status: {
				[Op.eq]: status.toUpperCase()
			}
		}
	})
		.then(c => (count = c.count))
		.catch(err => res.status(500).send({errors: [err]}));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

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

	Item.findAll({
		limit,
		offset,
		include,
		where: {
			status: {
				[Op.eq]: status.toUpperCase()
			}
		}
	})
		.then(items => {
			res.send({
				data: {
					items,
					count,
					pagesCount
				}
			});
		})
		.catch(err => res.status(500).send({errors: [err]}));
});

// Get all items reserved by branch
router.get("/reserve-branch-id/:branch_id", async (req, res) => {
	let { limit, page } = req.query;
	const { branch_id } = req.params;

	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Item.findAndCountAll({
		where: {
			reserve_branch_id: {
				[Op.eq]: branch_id
			}
		}
	})
		.then(c => (count = c.count))
		.catch(err => res.status(500).send({errors: [err]}));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

	Item.findAll({
		offset,
		limit,
		where: {
			reserve_branch_id: {
				[Op.eq]: branch_id
			}
		}
	})
		.then(items => res.send({
			data: {
				items,
				count,
				pagesCount
			}
		}))
		.catch(err => res.status(500).send({errors: [err]}));
});

// Get all items reserved by job (customer)
router.get("/reserve-job-code/:job_code", async (req, res) => {
	let { limit, page } = req.query;
	const { job_code } = req.params;
	
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Item.findAndCountAll({
		where: {
			reserve_job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(c => (count = c.count))
		.catch(err => res.status(500).send({errors: [err]}));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

	Item.findAll({
		limit,
		offset,
		where: {
			reserve_job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(items => res.send({
			data: {
				items,
				count,
				pagesCount
			}
		}))
		.catch(err => res.status(500).send({errors: [err]}));
});

// Add items to stock
router.post("/add", async (req, res) => {
	const { model_id, remarks } = req.query;
	if (!model_id) {
		res.status(400).send([{message: "Model is required."}]);
		return;
	}
	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];
	await Promise.all(
		serial_no.map(async no => {
			await Item.create({
				serial_no: no,
				model_id,
				remarks,
				status: "IN_STOCK"
			}).catch(err => errors.push(err.errors[0]));
		})
	);
	if (errors.length > 0) res.status(500).send(errors);
	else res.sendStatus(200);
});

// Edit Item
router.put("/:serial_no/edit", (req, res) => {
	const { serial_no } = req.params;
	const { model_id, remarks } = req.query;
	if (!model_id) {
		res.status(400).send([{message: "Model is required."}]);
		return;
	}
	Item.update({
		model_id,
		remarks
	},{
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send({errors: [err]}));
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
		.catch(err => res.status(500).send({errors: [err]}));
});

module.exports = router;
