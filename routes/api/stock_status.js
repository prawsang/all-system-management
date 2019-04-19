const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const BranchJob = require("../../models/junction/BranchJob");
const Job = require("../../models/Job");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");

const checkSerial = [
	check("serial_no")
		.isArray()
		.not()
		.isEmpty()
		.withMessage("Invalid or Empty Serial No.")
];

// Install
// IN_STOCK/RESERVED -> INSTALLED
// Removes the reserve_job_code and reserve_branch_id of the items
// Check if the item is reserved by the provided job/branch
installItems = async (serial_no, branch_id, job_code) => {
	let errors = [];
	let updatedSerials = [];

	await Promise.all(
		serial_no.map(async no => {
			const valid = await Item.checkStatus(no, ["IN_STOCK", "RESERVED"]);
			if (!valid) {
				errors.push({ msg: `The item ${no} is not IN_STOCK` });
			} else {
				await Item.findOne({
					where: {
						serial_no: {
							[Op.eq]: no
						}
					}
				}).then(async res => {
					if (res.reserve_branch_id && res.reserve_branch_id != branch_id) {
						errors.push({ msg: `The item ${no} is reserved by another branch.` });
					} else if (res.reserve_job_code && res.reserve_job_code != job_code) {
						errors.push({ msg: `The item ${no} is reserved by another job.` });
					} else {
						await Item.update(
							{
								status: "INSTALLED",
								reserve_branch_id: null,
								reserve_job_code: null
							},
							{
								where: {
									serial_no: {
										[Op.eq]: no
									}
								}
							}
						)
							.then(res => updatedSerials.push(no))
							.catch(err => errors.push(err));
					}
				});
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

// Transfer
// IN_STOCK -> TRANSFERRED
transferItems = async serial_no => {
	const res = await Item.changeStatus({
		serial_no,
		validStatus: "IN_STOCK",
		toStatus: "TRANSFERRED"
	});
	const { updatedSerials, errors } = res;
	return {
		updatedSerials,
		errors
	};
};

// Borrow
// IN_STOCK -> BORROWED
borrowItems = async serial_no => {
	const res = await Item.changeStatus({
		serial_no,
		validStatus: "IN_STOCK",
		toStatus: "BORROWED"
	});
	const { updatedSerials, errors } = res;
	return {
		updatedSerials,
		errors
	};
};

// Reserve
// IN_STOCK -> RESERVED
router.put(
	"/reserve",
	[
		...checkSerial,
		check("reserve_job_code")
			.not()
			.isEmpty()
			.withMessage("Job code cannot be empty")
	],
	async (req, res) => {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return res.status(422).json({ errors: validationErrors.array() });
		}

		const { reserve_branch_id, reserve_job_code, serial_no } = req.body;
		const branchInJob = await BranchJob.checkBranchInJob(reserve_branch_id, reserve_job_code);
		if (!branchInJob) {
			res.status(400).send([{ msg: "Branch is not associated to the job code." }]);
			return;
		}

		const r = await Item.changeStatus({
			serial_no,
			validStatus: "IN_STOCK",
			toStatus: "RESERVED",
			otherInfo: {
				reserve_branch_id,
				reserve_job_code
			}
		});
		const { errors } = r;
		if (errors.length > 0) res.status(400).json({ errors });
		else res.sendStatus(200);
	}
);

// Return
// ANY -> IN_STOCK
returnItems = async serial_no => {
	const res = await Item.changeStatus({
		serial_no,
		toStatus: "IN_STOCK",
		otherInfo: {
			reserve_branch_id: null,
			reserve_job_code: null
		}
	});
	const { updatedSerials, errors } = res;
	return {
		updatedSerials,
		errors
	};
};
router.put("/return", checkSerial, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { serial_no } = req.body;
	const r = await returnItems(serial_no);
	if (r.errors.length > 0) {
		res.status(400).json({ errors: r.errors });
	} else {
		res.sendStatus(200);
	}
});

// Mark Broken/Not Broken
router.put(
	"/broken",
	[
		...checkSerial,
		check("broken")
			.isBoolean()
			.withMessage("Invalid Broken value. Must be either true or false.")
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const { serial_no, broken } = req.body;
		await Promise.all(
			serial_no.map(async no => {
				Item.update(
					{
						broken
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
		if (errors.length > 0) res.status(400).json({ errors });
		else res.sendStatus(200);
	}
);

module.exports = {
	router,
	installItems,
	transferItems,
	borrowItems,
	returnItems
};
