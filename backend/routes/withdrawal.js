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

router.get("/get-all", (req, res) => {
	Withdrawal.findAll()
		.then(withdrawals => res.send(withdrawals))
		.catch(err => err);
});

router.get("/:id", (req, res) => {
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
		.then(withdrawal => res.send(withdrawal))
		.catch(err => err);
});

// List of withdrawals of type INSTALLATION without a purchase order
router.get("/without-po", (req, res) => {
	Withdrawal.findAll({
		where: {
			po_number: {
				[Op.eq]: null
			},
			type: {
				[Op.eq]: "INSTALLATION"
			}
		}
	})
		.then(withdrawals => res.send(withdrawals))
		.catch(err => res.status(500).send(err.errors));
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
		.catch(err => res.status(500).send(err.errors));
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
		.catch(err => res.status(500).send(err.errors));
};
checkRequiredFields = values => {
	const { job_code, branch_id, po_number, staff_code, type, return_by, install_date, date } = values;
	let errors = [];
	if (!job_code && !po_number) errors.push({ message: "Job code or PO number is required." });
	if (!branch_id) errors.push({ message: "Branch is required." });
	if (!type) errors.push({ message: "Withdrawal type is required." });
	if (!staff_code) errors.push({ message: "Staff code is required." });
	if (!date) errors.push({ message: "Date is required." });
	if (type == "INSTALLATION" && !install_date) errors.push({ message: "Installation date is required." });
	if (type == "BORROW" && !return_by) errors.push({ message: "Please specify return date." });
	if (errors.length > 0) return errors;
	else return null;
};

// Add Withdrawal
router.post("/add", async (req, res) => {
	const { job_code, branch_id, po_number, do_number, staff_code, type, return_by, install_date, date, remarks } = req.query;
	// Check required fields
	const requirementErrors = checkRequiredFields({
		job_code,
		branch_id,
		po_number,
		staff_code,
		type,
		return_by,
		install_date,
		date
	});
	if (requirementErrors) {
		res.status(400).send(requirementErrors);
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
			date
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
		.catch(err => res.status(500).send(err.errors));
});

// Edit Withdrawal (only if it is pending)
router.put("/:id/edit", async (req, res) => {
	const { id } = req.params;
	const { job_code, branch_id, po_number, do_number, staff_code, type, return_by, date, install_date } = req.query;
	// Check required fields
	const requirementErrors = checkRequiredFields({
		job_code,
		branch_id,
		po_number,
		staff_code,
		type,
		return_by,
		install_date,
		date
	});
	if (requirementErrors) {
		res.status(400).send(requirementErrors);
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
		.catch(err => res.status(500).send(err.errors));
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
			date
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
		.catch(err => res.status(500).send(err.errors));
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
		.catch(err => res.status(500).send(err.errors));
});

// Change Status
changeStatus = (id, status) => {
	Withdrawal.update(
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
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
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
		.catch(err => res.status(500).send(err.errors));

	if (status == "PRINTED") {
		if (currentStatus != "PENDING") {
			res.status(400).send([{ message: "This withdrawal is not pending." }]);
		} else {
			await changeStatus(id, status);
		}
	} else if (status == "CANCELLED") {
		await changeStatus(id, status);
	}
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
		.catch(err => res.status(500).send(err.errors));
	if (pending) return;

	Withdrawal.destroy({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
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
		.catch(err => res.status(500).send(err.errors));
});

module.exports = router;
