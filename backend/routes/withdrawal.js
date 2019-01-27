const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Model = require("../models/Model");
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const PurchaseOrder = require("../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");

router.get("/get-all", async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Withdrawal.findAndCountAll()
		.then(c => (count = c.count))
		.catch(err => res.status(500).send(err));
	if (count == 0) {
		res.send({
			withdrawals: [],
			count: 0,
			pagesCount: 0
		});
		return
	}
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

	Withdrawal.findAll({
		limit,
		offset
	})
		.then(withdrawals =>
			res.send({
				withdrawals,
				count,
				pagesCount
			})
		)
		.catch(err => res.status(500).send(err));
});

router.get("/single/:id", (req, res) => {
	const { id } = req.params;
	Withdrawal.findOne({
		where: { id: { [Op.eq]: id } },
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
			},
			{
				model: Item,
				as: "items",
				include: {
					model: Model,
					as: "model"
				}
			},
			{
				model: User,
				as: "user"
			}
		]
	})
		.then(withdrawal =>
			res.send({
				withdrawal
			})
		)
		.catch(err => res.status(500).send(err));
});

// List of withdrawals of type INSTALLATION without a purchase order
router.get("/without-po", async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Withdrawal.findAndCountAll({
		where: {
			po_number: {
				[Op.eq]: null
			},
			type: {
				[Op.eq]: "INSTALLATION"
			}
		}
	})
		.then(c => count = c.count)
		.catch(err => res.status(500).send(err));
	if (count == 0) {
		res.send({
			withdrawals: [],
			count: 0,
			pagesCount: 0
		});
		return
	}
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);
	res.sendStatus(200);
	Withdrawal.findAll({
		offset,
		limit,
		where: {
			po_number: {
				[Op.eq]: null
			},
			type: {
				[Op.eq]: "INSTALLATION"
			}
		}
	})
		.then(withdrawals =>
			res.send({
				withdrawals,
				count,
				pagesCount
			})
		)
		.catch(err => res.status(500).send(err));
});

checkBranchInPo = (branch_id, po_number) => {
	return PurchaseOrder.count({
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		},
		include: {
			model: Branch,
			where: {
				id: {
					[Op.eq]: branch_id
				}
			}
		}
	})
		.then(count => (count == 0 ? false : true))
		.catch(err => res.status(500).send(err));
};
checkBranchInJob = (branch_id, job_code) => {
	return Job.count({
		where: {
			job_code: {
				[Op.eq]: job_code
			}
		},
		include: {
			model: Branch,
			where: {
				id: {
					[Op.eq]: branch_id
				}
			}
		}
	})
		.then(count => (count == 0 ? false : true))
		.catch(err => res.status(500).send(err));
};
checkWithdrawalFields = values => {
	const { job_code, branch_id, po_number, staff_code, type, return_by, install_date, date, has_po } = values;
	let errors = [];
	if (!job_code && !po_number) errors.push({ message: "Job code or PO number is required." });
	if (!branch_id) errors.push({ message: "Branch is required." });
	if (!type) errors.push({ message: "Withdrawal type is required." });
	if (!staff_code) errors.push({ message: "Staff code is required." });
	if (!date) errors.push({ message: "Date is required." });
	if (type == "INSTALLATION" && !install_date) errors.push({ message: "Installation date is required." });
	if (type == "BORROW" && !return_by) errors.push({ message: "Please specify return date." });
	if (!has_po && po_number) errors.push({ message: "Cannot specify PO Number to withdrawals without a PO." });
	if (errors.length > 0) return errors;
	else return null;
};

// Add Withdrawal
router.post("/add", async (req, res) => {
	const { job_code, branch_id, po_number, do_number, staff_code, type, return_by, install_date, date, remarks, has_po } = req.query;
	// Check required fields
	const validationErrors = checkWithdrawalFields({
		job_code,
		branch_id,
		po_number,
		staff_code,
		type,
		return_by,
		install_date,
		date,
		has_po
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}

	// check if branch is in the specified PO (if any)
	if (po_number) {
		const branchInPO = await checkBranchInPo(branch_id, po_number);
		if (!branchInPO) {
			res.status(400).send([{ message: "This branch is not associated with this PO" }]);
			return;
		}
	}
	// check if branch is in the specified job (if any)
	if (job_code) {
		const branchInJob = await checkBranchInPo(branch_id, job_code);
		if (!branchInJob) {
			res.status(400).send([{ message: "This branch is not associated with this job code" }]);
			return;
		}
	}

	// po_number and job_code cannot coexist
	// If po_number is specified, job_code will be null
	Withdrawal.create(
		{
			job_code: po_number ? null : job_code,
			branch_id,
			po_number,
			do_number,
			staff_code,
			type,
			install_date,
			return_by,
			status: "PENDING",
			remarks,
			date,
			has_po
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

// Edit Withdrawal (only if it is pending)
router.put("/:id/edit", async (req, res) => {
	const { id } = req.params;
	const { job_code, branch_id, po_number, do_number, staff_code, type, return_by, date, install_date, has_po } = req.query;
	// Check required fields
	const validationErrors = checkWithdrawalFields({
		job_code,
		branch_id,
		po_number,
		staff_code,
		type,
		return_by,
		install_date,
		date,
		has_po
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}

	// Check if the withdrawal is pending
	let pending = true;
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.status != "PENDING") {
				res.status(400).send([{ message: "This withdrawal/service report/DO is printed and cannot be edited." }]);
				pending = false;
			}
		})
		.catch(err => res.status(500).send(err));
	if (!pending) return;

	// check if branch is in the specified PO (if any)
	if (po_number) {
		const branchInPO = await checkBranchInPo(branch_id, po_number);
		if (!branchInPO) {
			res.status(400).send([{ message: "This branch is not associated with this PO." }]);
			return;
		}
	}
	// check if branch is in the specified job (if any)
	if (job_code) {
		const branchInJob = await checkBranchInPo(branch_id, job_code);
		if (!branchInJob) {
			res.status(400).send([{ message: "This branch is not associated with this job code." }]);
			return;
		}
	}

	// po_number and job_code cannot coexist
	// If po_number is specified, job_code will be null
	Withdrawal.update(
		{
			job_code: po_number ? null : job_code,
			branch_id,
			po_number,
			do_number,
			staff_code,
			type,
			return_by,
			install_date,
			date,
			has_po
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

// Edit remarks
router.put("/:id/edit-remarks", (req, res) => {
	const { id } = req.params;
	const { remarks } = req.query;

	Withdrawal.update(
		{
			remarks
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

// Change Status
changeStatus = (id, status) => {
	if (status !== "PENDING" && status !== "PRINTED" && status !== "CANCELLED") {
		res.status(400).send([{ message: "Status must be either PENDING, PRINTED, or CANCELLED" }]);
		return;
	}
	return Withdrawal.update(
		{
			status
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => null)
		.catch(err => res.status(500).send(err));
};

router.put("/:id/change-status", async (req, res) => {
	const { id } = req.params;
	const { status } = req.query;

	//Check current status
	let currentStatus = "";
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => (currentStatus = withdrawal.status))
		.catch(err => res.status(500).send(err));

	if (status == "PRINTED") {
		if (currentStatus != "PENDING") {
			res.status(400).send([{ message: "This withdrawal is not pending." }]);
			return;
		} else {
			const changeStatusErrors = await changeStatus(id, status);
			if (changeStatusErrors) {
				res.status(500).send(changeStatusErrors);
				return;
			} else {
				res.sendStatus(200);
			}
		}
	} else if (status == "CANCELLED") {
		const changeStatusErrors = await changeStatus(id, status);
		if (changeStatusErrors) {
			res.status(500).send(changeStatusErrors);
			return;
		} else {
			res.sendStatus(200);
		}
	} else if (status == "PENDING") {
		res.status(400).send([{ message: "Cannot change status to PENDING." }]);
		return;
	}
});

// Add items to withdrawal
router.put("/:id/add-items", async (req, res) => {
	let { serial_no } = req.query;
	const { id } = req.params;
	if (typeof serial_no == "string") serial_no = [serial_no];
	let errors = [];
	await Promise.all(
		serial_no.map(async no => {
			await Withdrawal.count({
				where: {
					id: {
						[Op.eq]: id
					}
				},
				include: {
					model: Item,
					as: "items",
					where: {
						serial_no: {
							[Op.eq]: no
						}
					}
				}
			})
				.then(count => {
					if (count == 0) {
						db.query("INSERT INTO item_withdrawal (serial_no, withdrawal_id)\
								VALUES (" + `${no},'${id}'` + ")", { type: db.QueryTypes.INSERT })
							.then(rows => null)
							.catch(err => errors.push(err.errors));
					} else errors.push({ message: `Serial No. ${no} is already in this withdrawal.` });
				})
				.catch(err => errors.push(err.errors));
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

// Delete Withdrawal (only if it is pending)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	// Check if the withdrawal has been printed
	let pending = false;
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.status != "PENDING") {
				res.status(400).send([{ message: "This withdrawal/service report/DO is printed and cannot be deleted." }]);
				pending = true;
			}
		})
		.catch(err => res.status(500).send(err));
	if (pending) return;

	Withdrawal.destroy({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Force delete withdrawal (superadmins only)
router.delete("/:id/force-delete", (req, res) => {
	const { id } = req.params;
	Withdrawal.destroy({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

module.exports = router;
