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

// Install
// Withdrawal of type INSTALLATION is required
// IN_STOCK/RESERVED -> INSTALLED
// Removes the reserve_job_code and reserve_branch_id of the items
router.put("/install", async (req, res) => {
	// Check if there is a valid withdrawal
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

	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];

	await Promise.all(serial_no.map( async no => {
		// Check status if it's either in stock or reserved
		let valid = await Item.findOne({
			where: {
				serial_no: {
					[Op.eq]: serial_no
				}
			}
		}).then(item => ((item.status != 'IN_STOCK' && item.status != 'RESERVED') ? false : true))
		.catch(err => false);

		if (valid) {
			const results = await changeStatus(no, "INSTALLED", { withdrawal_id, reserve_branch_id: null, reserve_job_code: null });
			if (results.errors) errors.push(results.errors);
		} else {
			errors.push({message: "This item is not in stock nor reserved.", value: no})
		}
	}));
	if (errors.length > 0) res.status(400).send(errors)
	else res.sendStatus(200)
});

// Transfer
// Withdrawal of type TRANSFER is required
// IN_STOCK -> TRANSFERRED
router.put("/transfer", async (req, res) => {
	// Check if there is a valid withdrawal
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

	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];

	await Promise.all(serial_no.map( async no => {
		let valid = await checkStatus(no, 'IN_STOCK');
		if (valid) {
			const results = await changeStatus(no, "TRANSFERRED", { withdrawal_id });
			if (results.errors) errors.push(results.errors);
		} else {
			errors.push({message: "This item is not in stock.", value: no})
		}
	}));
	if (errors.length > 0) res.status(400).send(errors)
	else res.sendStatus(200)
});

// Borrow
// Withdrawal of type BORROW is required
// IN_STOCK -> BORROWED
router.put("/transfer", async (req, res) => {
	// Check if there is a valid withdrawal
	const { withdrawal_id } = req.query;
	if (!withdrawal_id) {
		res.status(400).send([{message: 'A withdrawal must be provided.'}]);
		return
	}
	const validWithdrawal = await checkWithdrawalType(withdrawal_id, 'BORROW');
	if (!validWithdrawal) {
		res.status(400).send([{message: 'The withdrawal must be of type BORROW.'}]);
		return
	}

	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];

	await Promise.all(serial_no.map( async no => {
		let valid = await checkStatus(no, 'IN_STOCK');
		if (valid) {
			const results = await changeStatus(no, "BORROWED", { withdrawal_id });
			if (results.errors) errors.push(results.errors);
		} else {
			errors.push({message: "This item is not in stock.", value: no})
		}
	}));
	if (errors.length > 0) res.status(400).send(errors)
	else res.sendStatus(200)
});

// Reserve
// reserve_job_code is required
// IN_STOCK -> RESERVED
router.put("/reserve", async (req, res) => {
	const { reserve_branch_id, reserve_job_code } = req.query;
	if (!reserve_job_code) {
		res.status(400).send([{message: 'A job code must be provided.'}]);
		return
	}
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
		})
			.then(count => {
				if (count == 0) {
					res.status(400).send([{ message: "Branch is not associated to the job code." }]);
					return;
				}
			})
	}

	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];

	await Promise.all(serial_no.map( async no => {
		let valid = await checkStatus(no, 'IN_STOCK');
		if (valid) {
			const results = await changeStatus(no, "RESERVED", { reserve_branch_id, reserve_job_code });
			if (results.errors) errors.push(results.errors);
		} else {
			errors.push({message: "This item is not in stock.", value: no})
		}
	}));
	if (errors.length > 0) res.status(400).send(errors)
	else res.sendStatus(200)
});
// Return
// BORROWED -> RETURNED
// Removes the withdrawal_id of the items
router.put("/return", async (req, res) => {
	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];

	await Promise.all(serial_no.map( async no => {
		let valid = await checkStatus(no, 'BORROWED');
		if (valid) {
			const results = await changeStatus(no, "IN_STOCK", { withdrawal_id: null });
			if (results.errors) errors.push(results.errors);
		} else {
			errors.push({message: "This item is not borrowed.", value: no})
		}
	}));
	if (errors.length > 0) res.status(400).send(errors)
	else res.sendStatus(200)
});

// Mark Broken
// Any Status -> BROKEN
router.put("/broken", async (req, res) => {
	let { serial_no } = req.query;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];

	await Promise.all(serial_no.map( async no => {
		const results = await changeStatus(no, "BROKEN");
		if (results.errors) errors.push(results.errors);
	}));
	if (errors.length > 0) res.status(400).send(errors)
	else res.sendStatus(200)
});

module.exports = router;