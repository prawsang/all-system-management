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
	if (errors.length >= 0) {
		res.status(500).send(errors);
	} else {
		res.sendStatus(200);
	}
});

// Amend Status
changeStatus = (serial_no, status, otherInfo) => {
	return Item.update(
		{
			status,
			...otherInfo
		},
		{
			where: {
				serial_no: {
					[Op.eq]: serial_no
				}
			}
		}
	)
		.then(rows => rows)
		.catch(err => err);
};
// Check if status is valid
checkStatus = (serial_no, status) => {
	return Item.findOne({
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	}).then(item => (item.status != status ? false : true))
	.catch(err => false)
}
// Check if withdrawal is of a correct type
checkWithdrawalType = (withdrawal_id, type) => {
	return Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: withdrawal_id
			}
		}
	}).then(withdrawal => (withdrawal.type != type ? false : true))
	.catch(err => false)
}
// Transfer
router.put("/:serial_no/transfer", async (req, res) => {
	const { serial_no } = req.params;
	const { withdrawal_id } = req.query;
	if (!withdrawal_id) {
		res.status(400).send([{message: 'A withdrawal must be provided.'}]);
		return
	}
	const validWithdrawal = await checkWithdrawalType(withdrawal_id, 'TRANSFER');
	if (!validWithdrawal) {
		res.status(400).send([{message: 'The withdrawal must be of type TRANSFER.'}]);
		return
	}

	let valid = await checkStatus(serial_no, 'IN_STOCK');
	if (valid) {
		const results = await changeStatus(serial_no, "TRANSFERRED", { withdrawal_id });
		if (results.errors) res.status(500).send(results.errors);
		else res.sendStatus(200);
	} else {
		res.send([{message: "This item is not in stock."}])
	}
});
// Reserve
router.put("/:serial_no/reserve", async (req, res) => {
	const { serial_no } = req.params;
	const { reserve_branch_id, reserve_job_code } = req.query;
	if (!reserve_job_code) {
		res.status(400).send([{message: 'A job code must be provided.'}]);
		return
	}
	let valid = await checkStatus(serial_no, 'IN_STOCK');
	if (valid) {
		const results = await changeStatus(serial_no, "RESERVED", { reserve_branch_id, reserve_job_code });
		if (results.errors) res.status(500).send(results.errors);
		else res.sendStatus(200);
	} else {
		res.send([{message: "This item is not in stock."}])
	}
});

// Delete Item from Stock (superadmins only)
// router.delete("/:serial_no", (req, res) => {
// 	const { serial_no } = req.params;
// 	Item.destroy({
// 		where: {
// 			serial_no: {
// 				[Op.eq]: serial_no
// 			}
// 		}
// 	})
// 		.then(rows => res.sendStatus(200))
// 		.catch(err => res.status(500).send(err.errors));
// });

module.exports = router;
