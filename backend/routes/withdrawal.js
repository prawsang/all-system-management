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

// Add Withdrawal
router.post("/add", async (req, res) => {
	const { job_code, branch_id, po_number, do_number, staff_code, type, return_by, print_date } = req.query;
	// check if branch is in the specified PO (if any)
	if (po_number) {
		await PurchaseOrder.count({
			where: {
				po_number: {
					[Op.eq]: po_number
				}
			},
			include: {
				model: Branch,
				where: {
					id: {
						[Op.eq]: branch_od
					}
				}
			}
		})
			.then(count => {
				if (count == 0) {
					res.status(400).send([{ message: "This branch is not associated with this PO."}]);
					return;
				}
			})
			.catch(err => res.status(500).send(err.errors));
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
			print_date,
			return_by
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

// Edit Withdrawal (only if it hasn't been printed)
router.put("/:id/edit", async (req, res) => {
	const { id } = req.params;

	// Check if the withdrawal has been printed
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.print_date != null) {
				res.status(400).send([{message: "This withdrawal/service report/DO has been printed and cannot be edited."}])
				return;
			}
		})
		.catch(err => res.status(500).send(err.errors));
	
	const { job_code, branch_id, po_number, do_number, staff_code, type, return_by, print_date } = req.query;
	// check if branch is in the specified PO (if any)
	if (po_number) {
		await PurchaseOrder.count({
			where: {
				po_number: {
					[Op.eq]: po_number
				}
			},
			include: {
				model: Branch,
				where: {
					id: {
						[Op.eq]: branch_od
					}
				}
			}
		})
			.then(count => {
				if (count == 0) {
					res.status(400).send([{ message: "This branch is not associated with this PO."}]);
					return;
				}
			})
			.catch(err => res.status(500).send(err.errors));
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
			print_date,
			return_by
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

// Delete Withdrawal (only if it hasn't been delete)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;

	// Check if the withdrawal has been printed
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.print_date != null) {
				res.status(400).send([{message: "This withdrawal/service report/DO has been printed and cannot be deleted."}])
				return;
			}
		})
		.catch(err => res.status(500).send(err.errors));

	Withdrawal.destroy(
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

// Force delete withdrawal (superadmins only)
router.delete('/:id/force-delete', (req,res) => {
	const { id } = req.params;
	Withdrawal.destroy(
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

module.exports = router;
