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

// Change Status
changeStockStatus = (serial_no, status, otherInfo) => {
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
checkStockStatus = (serial_no, status) => {
	return Item.findOne({
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	})
		.then(item => (item.status != status ? false : true))
		.catch(err => false);
};
// Check if withdrawal is of a correct type
checkWithdrawalType = (withdrawal_id, type) => {
	return Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: withdrawal_id
			}
		}
	})
		.then(withdrawal => (withdrawal.type != type ? false : true))
		.catch(err => false);
};

// WITHDRAW
// Install
// Withdrawal of type INSTALLATION is required
// IN_STOCK/RESERVED -> INSTALLED
// Removes the reserve_job_code and reserve_branch_id of the items
installItems = async serial_no => {
	let errors = [];
	let updatedSerials = [];

	await Promise.all(
		serial_no.map(async no => {
			// Check status if it's either in stock or reserved
			let valid = await Item.findOne({
				where: {
					serial_no: {
						[Op.eq]: no
					}
				}
			})
				.then(item =>
					item.status != "IN_STOCK" && item.status != "RESERVED" ? false : true
				)
				.catch(err => false);

			if (valid) {
				const results = await changeStockStatus(no, "INSTALLED", {
					reserve_branch_id: null,
					reserve_job_code: null
				});
				if (results.errors) errors.push(results.errors);
				else updatedSerials.push(no);
			} else {
				errors.push({ message: "This item is not in stock nor reserved.", value: no });
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Transfer
// Withdrawal of type TRANSFER is required
// IN_STOCK -> TRANSFERRED
transferItems = async serial_no => {
	let errors = [];
	let updatedSerials = [];

	await Promise.all(
		serial_no.map(async no => {
			let valid = await checkStockStatus(no, "IN_STOCK");
			if (valid) {
				const results = await changeStockStatus(no, "TRANSFERRED");
				if (results.errors) errors.push(results.errors);
				else updatedSerials.push(no);
			} else {
				errors.push({ message: "This item is not in stock.", value: no });
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Borrow
// Withdrawal of type BORROW is required
// IN_STOCK -> BORROWED
borrowItems = async serial_no => {
	let errors = [];
	let updatedSerials = [];

	await Promise.all(
		serial_no.map(async no => {
			let valid = await checkStockStatus(no, "IN_STOCK");
			if (valid) {
				const results = await changeStockStatus(no, "BORROWED");
				if (results.errors) errors.push(results.errors);
				else updatedSerials.push(no);
			} else {
				errors.push({ message: "This item is not in stock.", value: no });
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Reserve
// reserve_job_code is required
// IN_STOCK -> RESERVED
router.put("/reserve", async (req, res) => {
	const { reserve_branch_id, reserve_job_code, serial_no } = req.body;
	if (!reserve_job_code) {
		res.status(400).send([{ message: "A job code must be provided." }]);
		return;
	}
	let branchInJob = true;
	if (reserve_branch_id) {
		// Check if the branch is associated to the job
		await Branch.count({
			where: {
				id: {
					[Op.eq]: reserve_branch_id
				}
			},
			include: {
				model: Job,
				where: {
					job_code: {
						[Op.eq]: reserve_job_code
					}
				}
			}
		}).then(count => {
			if (count == 0) {
				res.status(400).send([{ message: "Branch is not associated to the job code." }]);
				branchInJob = false;
			}
		});
	}
	if (!branchInJob) return;

	let errors = [];

	await Promise.all(
		serial_no.map(async no => {
			let valid = await checkStockStatus(no, "IN_STOCK");
			if (valid) {
				const results = await changeStockStatus(no, "RESERVED", {
					reserve_branch_id,
					reserve_job_code
				});
				if (results.errors) errors.push(results.errors);
			} else {
				errors.push({ message: "This item is not in stock.", value: no });
			}
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

// NO WITHDRAW
// Return
// BORROWED -> RETURNED
// Removes the withdrawal_id of the items
router.put("/return", async (req, res) => {
	const { serial_no } = req.body;
	let errors = [];
	await Promise.all(
		serial_no.map(async no => {
			let valid = await checkStockStatus(no, "BORROWED");
			if (valid) {
				const results = await changeStockStatus(no, "IN_STOCK", { withdrawal_id: null });
				if (results.errors) errors.push(results.errors);
			} else {
				errors.push({ message: "This item is not borrowed.", value: no });
			}
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

// Mark Broken
router.put("/broken", async (req, res) => {
	const { serial_no } = req.body;
	let errors = [];

	await Promise.all(
		serial_no.map(async no => {
			Item.update(
				{
					broken: true
				},
				{
					where: {
						serial_no: {
							[Op.eq]: no
						}
					}
				}
			).catch(err => errors.push(err.errors));
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

module.exports = {
	router,
	installItems,
	transferItems,
	borrowItems
};
