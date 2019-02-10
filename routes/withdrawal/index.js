const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const Model = require("../../models/Model");
const Branch = require("../../models/Branch");
const Job = require("../../models/Job");
const Customer = require("../../models/Customer");
const User = require("../../models/User");
const Withdrawal = require("../../models/Withdrawal");
const PurchaseOrder = require("../../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const tools = require("../../utils/tools");

const installItems = require("../stock_status").installItems;
const transferItems = require("../stock_status").transferItems;
const borrowItems = require("../stock_status").borrowItems;
const returnItems = require("../stock_status").returnItems;

const validation = require("./validation");

router.get("/get-all", async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		model: Withdrawal
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.get("/:id/details", (req, res) => {
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
				model: PurchaseOrder,
				as: "po",
				include: {
					model: Job,
					as: "job"
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
				as: "user",
				attributes: { exclude: ["password"] }
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
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
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
			po_number: {
				[Op.eq]: null
			},
			type: {
				[Op.eq]: "INSTALLATION"
			}
		},
		model: Withdrawal
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

// Add Withdrawal
router.post("/add", async (req, res) => {
	const {
		job_code,
		branch_id,
		po_number,
		do_number,
		staff_code,
		type,
		return_by,
		install_date,
		date,
		remarks,
		has_po
	} = req.body;

	// Check required fields
	const validationErrors = validation.checkWithdrawalFields({
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

	// po_number and job_code cannot coexist
	// If po_number is specified, job_code will be null
	Withdrawal.create({
		job_code: po_number ? null : job_code,
		branch_id,
		po_number: has_po ? po_number : null,
		do_number,
		staff_code,
		type,
		return_by: type === "BORROW" ? return_by : null,
		install_date: type === "INSTALLATION" ? return_by : null,
		status: "PENDING",
		remarks,
		date,
		has_po
	})
		.then(row => res.send(row))
		.catch(err => res.status(500).send(err));
});

// Edit Withdrawal (only if it is pending)
router.put("/:id/edit", async (req, res) => {
	const { id } = req.params;
	const {
		job_code,
		branch_id,
		po_number,
		do_number,
		staff_code,
		type,
		return_by,
		date,
		install_date,
		has_po
	} = req.body;
	// Check required fields
	const validationErrors = validation.checkWithdrawalFields({
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
	// Check if Pending
	const isPending = validation.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).send([{ message: "This withdrawal must be PENDING." }]);
		return;
	}

	// po_number and job_code cannot coexist
	// If po_number is specified, job_code will be null
	Withdrawal.update(
		{
			job_code: po_number ? null : job_code,
			branch_id,
			po_number: has_po ? po_number : null,
			do_number,
			staff_code,
			type,
			return_by: type === "BORROW" ? return_by : null,
			install_date: type === "INSTALLATION" ? return_by : null,
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
		.catch(err => res.status(500).send(err));
});

// Edit remarks
router.put("/:id/edit-remarks", (req, res) => {
	const { id } = req.params;
	const { remarks } = req.body;

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
	const { status } = req.body;
	let items = [];
	let errors = [];
	// Check current status
	let currentStatus = "";
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: {
			model: Item,
			as: "items"
		}
	})
		.then(withdrawal => {
			currentStatus = withdrawal.status;
			withdrawal.items.map(e => items.push(e.serial_no));
		})
		.catch(err => errors.push(err));
	if (errors.length != 0) {
		res.status(500).send(errors);
		return;
	}

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
				return;
			}
		}
	} else if (status == "CANCELLED") {
		const changeStatusErrors = await changeStatus(id, status);
		if (changeStatusErrors) {
			res.status(500).send(changeStatusErrors);
			return;
		} else {
			// return all items
			const r = await returnItems(items);
			if (r.errors) res.status(400).send(r.errors);
			res.sendStatus(200);
			return;
		}
	} else if (status == "PENDING") {
		res.status(400).send([{ message: "Cannot change status to PENDING." }]);
		return;
	}
});

// Add items to withdrawal
router.put("/:id/add-items", async (req, res) => {
	const { serial_no } = req.body;
	const { id } = req.params;

	// Check if Pending
	const isPending = validation.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).send([{ message: "This withdrawal must be PENDING." }]);
		return;
	}

	let validSerials = null;
	let r = null;
	let errors = [];

	let type = "";
	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			type = withdrawal.type;
		})
		.catch(err => errors.push(err));
	if (errors.length > 0) {
		res.status(500).send(errors);
		return;
	}

	if (type === "INSTALLATION") {
		r = await installItems(serial_no);
	} else if (type === "TRANSFER") {
		r = await transferItems(serial_no);
	} else if (type === "BORROW") {
		r = await borrowItems(serial_no);
	} else return;
	validSerials = r.updatedSerials;
	errors = r.errors;

	await Promise.all(
		validSerials.map(async no => {
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
						db.query(
							"INSERT INTO item_withdrawal (serial_no, withdrawal_id)\
								VALUES (" +
								`${no},'${id}'` +
								")",
							{ type: db.QueryTypes.INSERT }
						)
							.then(rows => null)
							.catch(err => errors.push(err.errors));
					} else
						errors.push({ message: `Serial No. ${no} is already in this withdrawal.` });
				})
				.catch(err => errors.push(err.errors));
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

// Remove Items from Withdrawal
router.put("/:id/remove-items", async (req, res) => {
	const { serial_no } = req.body;
	const { id } = req.params;

	// Check if Pending
	const isPending = validation.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).send([{ message: "This withdrawal must be PENDING." }]);
		return;
	}

	let errors = [];
	const r = await returnItems(serial_no);
	errors = r.errors;

	await Promise.all(
		r.updatedSerials.map(async no => {
			await db
				.query(
					`DELETE FROM item_withdrawal 
				WHERE serial_no = '${no}'
				AND withdrawal_id = ${id}`,
					{
						type: db.QueryTypes.DELETE
					}
				)
				.then(rows => null)
				.catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

removeAllItemsFromWithdrawal = id => {
	let errors = [];
	db.transaction(t => {
		return Item.update(
			{
				status: "IN_STOCK"
			},
			{
				include: {
					model: Withdrawal,
					where: {
						id: {
							[Op.eq]: id
						}
					}
				},
				transaction: t
			}
		).then(item =>
			db.query(`DELETE FROM item_withdrawal WHERE withdrawal_id = '${id}'`, {
				type: db.QueryTypes.DELETE,
				transaction: t
			})
		);
	})
		.then(res =>
			// destroy the withdrawal if all the items are returned
			Withdrawal.destroy({
				where: {
					id: {
						[Op.eq]: id
					}
				}
			})
				.then(rows => null)
				.catch(err => errors.push(err))
		)
		.catch(err => errors.push(err));
	return { errors };
};

// Delete Withdrawal (only if it is pending)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	// Check if Pending
	const isPending = validation.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).send([{ message: "This withdrawal must be PENDING." }]);
		return;
	}

	// Delete items from the withdrawal
	const r = await removeAllItemsFromWithdrawal(id);
	if (r.errors.length > 0) {
		res.status(500).send(r.errors);
	} else {
		res.sendStatus(200);
	}
});

// Force delete withdrawal (no status check) (superadmins only)
router.delete("/:id/force-delete", async (req, res) => {
	const { id } = req.params;
	const r = await removeAllItemsFromWithdrawal(id);
	if (r.errors.length > 0) {
		res.status(500).send(r.errors);
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
