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

router.route("/get-all").get((req, res) =>
	Item.findAll({
		include: {
			model: Model,
			as: "model"
		}
	})
		.then(models => {
			res.send(models);
		})
		.catch(err => res.status(500).send(err.errors))
);

router.route("/:serial_no").get((req, res) => {
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
				as: "withdrawal",
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
		.then(models => {
			res.send(models);
		})
		.catch(err => res.status(500).send(err.errors));
});

// Get item by status
router.get("/status/:status", (req, res) => {
	const { status } = req.params;

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
						as: "withdrawal"
					}
			  ]
			: [
					{
						model: Model,
						as: "model"
					}
			  ];

	Item.findAll({
		include,
		where: {
			status: {
				[Op.eq]: status.toUpperCase()
			}
		}
	})
		.then(models => {
			res.send(models);
		})
		.catch(err => res.status(500).send(err.errors));
});

// Get all items reserved by branch
router.get("/reserve-branch-id/:branch_id", (req, res) => {
	const { branch_id } = req.params;
	Item.findAll({
		where: {
			reserve_branch_id: {
				[Op.eq]: branch_id
			}
		}
	})
		.then(items => res.send(items))
		.catch(err => res.status(500).send(err.errors));
});

// Get all items reserved by job (customer)
router.get("/reserve-job-code/:job_code", (req, res) => {
	const { job_code } = req.params;
	Item.findAll({
		where: {
			reserve_job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(items => res.send(items))
		.catch(err => res.status(500).send(err.errors));
});

// Add items to stock
router.post("/add", async (req, res) => {
	const { model_id, remarks } = req.query;
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
		.catch(err => res.status(500).send(err.errors));
});

module.exports = router;
