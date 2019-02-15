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
const tools = require("../utils/tools");
const { check, validationResult } = require("express-validator/check");

const stockStatus = require("./stock_status");
const { installItems, transferItems, borrowItems, returnItems } = stockStatus;

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

const checkWithdrawal = [
	check("branch_id")
		.not()
		.isEmpty()
		.withMessage("Branch must be provided."),
	check("type")
		.isIn(["INSTALLATION", "BORROW", "TRANSFER"])
		.withMessage("Invalid or empty type."),
	check("staff_code")
		.not()
		.isEmpty()
		.withMessage("Staff must be provided."),
	check("date")
		.not()
		.isEmpty()
		.withMessage("WIthdrawal date must be provided.")
];
const checkSerial = [
	check("serial_no")
		.isArray()
		.withMessage("Invalid Serial No.")
];

// Add Withdrawal
router.post("/add", checkWithdrawal, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

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
		install_date: type === "INSTALLATION" ? install_date : null,
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
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

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

	// Check if Pending
	const isPending = await validation.checkStatus(id, "PENDING");
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
			install_date: type === "INSTALLATION" ? install_date : null,
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
router.put("/:id/change-status", async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (status == "PRINTED") {
		if (!isPending) {
			res.status(400).send([{ message: "This withdrawal is not pending." }]);
			return;
		} else {
			const changeStatus = await Withdrawal.changeStatus(id, status);
			if (changeStatus.errors.length > 0) {
				res.status(500).send(changeStatus.errors);
			} else {
				res.sendStatus(200);
			}
		}
	} else if (status == "CANCELLED") {
		const changeStatus = await Withdrawal.changeStatus(id, status);
		if (changeStatus.errors.length > 0) {
			res.status(500).send(changeStatus.errors);
			return;
		} else {
			// return all items
			let items = [];
			await Withdrawal.findOne({
				where: {
					id: {
						[Op.eq]: id
					}
				},
				include: {
					model: Item,
					as: items
				}
			}).then(withdrawal => {
				items = withdrawal.items;
			});
			const r = await Withdrawal.returnItems(items);
			if (r.errors.length > 0) res.status(400).send(r.errors);
			res.sendStatus(200);
		}
	} else if (status == "PENDING") {
		res.status(400).send([{ message: "Cannot change status to PENDING." }]);
	}
});

// Add items to withdrawal
router.put("/:id/add-items", async (req, res) => {
	const { serial_no } = req.body;
	const { id } = req.params;

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).send([{ message: "This withdrawal must be PENDING." }]);
		return;
	}

	let r = null;
	let errors = [];

	const type = await Withdrawal.getType(id);
	if (type.errors) {
		res.status(500).send(type.errors);
		return;
	}

	if (type === "INSTALLATION") {
		r = await installItems(serial_no);
	} else if (type === "TRANSFER") {
		r = await transferItems(serial_no);
	} else if (type === "BORROW") {
		r = await borrowItems(serial_no);
	} else {
		res.status(400).send("Withdrawal type is invalid.");
		return;
	}
	errors = r.errors;

	await Promise.all(
		r.updatedSerials.map(async no => {
			const itemExists = await Withdrawal.checkItem(id, no);
			if (!itemExists) {
				db.query(
					"INSERT INTO item_withdrawal (serial_no, withdrawal_id)\
						VALUES (" +
						`${no},'${id}'` +
						")",
					{ type: db.QueryTypes.INSERT }
				)
					.then(rows => null)
					.catch(err => errors.push(err.errors));
			} else {
				errors.push({ msg: `Serial No. ${no} is already in this withdrawal.` });
			}
		})
	);
	if (errors.length > 0) res.status(400).send(errors);
	else res.sendStatus(200);
});

// Remove Items from Withdrawal
router.put("/:id/remove-items", checkSerial, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { serial_no } = req.body;
	const { id } = req.params;

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
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

// Delete Withdrawal (only if it is pending)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).send([{ message: "This withdrawal must be PENDING." }]);
		return;
	}

	// await Item.findAll({
	// 	include: {
	// 		model: Withdrawal,
	// 		as: "withdrawals",
	// 		where: {
	// 			id: {
	// 				[Op.eq]: id
	// 			}
	// 		}
	// 	}
	// })
	// 	.then(items => res.send(items))
	// 	.catch(err => console.log(err));

	// Delete items from the withdrawal
	const r = await Withdrawal.removeAllItemsAndDelete(id);
	if (r.errors.length > 0) {
		res.status(500).send(r.errors);
	} else {
		res.sendStatus(200);
	}
});

// Force delete withdrawal (no status check) (superadmins only)
router.delete("/:id/force-delete", async (req, res) => {
	const { id } = req.params;
	const r = await Withdrawal.removeAllItemsAndDelete(id);
	if (r.errors.length > 0) {
		res.status(500).send(r.errors);
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;