const express = require("express");
const router = express.Router();
const Item = require("../../models/Item");
const Model = require("../../models/Model");
const Branch = require("../../models/Branch");
const Job = require("../../models/Job");
const Customer = require("../../models/Customer");
const Withdrawal = require("../../models/Withdrawal");
const ItemWithdrawal = require("../../models/junction/ItemWithdrawal");
const PurchaseOrder = require("../../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../config/database");
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");
const stockStatus = require("./stock_status");
const { installItems, transferItems, borrowItems, returnItems } = stockStatus;

router.get("/get-all", async (req, res) => {
	const {
		limit,
		page,
		search_col,
		search_term,
		from,
		to,
		install_from,
		install_to,
		return_from,
		return_to,
		billed,
		type,
		status
	} = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Withdrawal.getColumns}, ${Branch.getColumns}, ${Customer.getColumns}, ${
			Job.getColumns
		}`,
		tables: `"withdrawals"
		JOIN "branches" ON "withdrawals"."branch_id" = "branches"."id"
		JOIN "jobs" ON "withdrawals"."job_code" = "jobs"."job_code"
		JOIN "customers" ON "branches"."customer_code" = "customers"."customer_code"
		`,
		where: Withdrawal.filter({
			from,
			to,
			install_from,
			install_to,
			return_from,
			return_to,
			billed,
			type,
			status
		}),
		replacements: {
			from,
			to,
			return_from,
			return_to,
			install_from,
			install_to,
			type,
			status
		},
		availableCols: [
			"job_code",
			"job_name",
			"customer_code",
			"customer_name",
			"branch_code",
			"branch_name",
			"po_number",
			"do_number",
			"staff_name"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
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
			}
		]
	})
		.then(withdrawal =>
			res.send({
				withdrawal
			})
		)
		.catch(err => res.status(500).json({ errors: err }));
});

router.get("/:id/items", async (req, res) => {
	const { limit, page, search_col, search_term, type, broken, status } = req.query;
	const { id } = req.params;
	const filters = Item.filter({
		status,
		broken,
		type
	});

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"item_withdrawal"
		JOIN "stock" ON "item_withdrawal"."serial_no" = "stock"."serial_no"
		JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: `"item_withdrawal"."withdrawal_id" = :id ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			id,
			status,
			broken,
			type
		},
		availableCols: [
			"serial_no",
			"model_id",
			"status",
			"stock_location",
			"po_number",
			"pr_number"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// List of withdrawals of type INSTALLATION without a purchase order
router.get("/without-po", async (req, res) => {
	const {
		limit,
		page,
		search_col,
		search_term,
		from,
		to,
		install_from,
		install_to,
		billed,
		status
	} = req.query;

	const filters = Withdrawal.filter({
		from,
		to,
		install_from,
		install_to,
		billed,
		status
	});

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Withdrawal.getColumns}, ${Branch.getColumns}, ${Customer.getColumns}, ${
			Job.getColumns
		}`,
		tables: `"withdrawals"
		JOIN "branches" ON "withdrawals"."branch_id" = "branches"."id"
		JOIN "jobs" ON "withdrawals"."job_code" = "jobs"."job_code"
		JOIN "customers" ON "branches"."customer_code" = "customers"."customer_code"
		`,
		where: `${
			filters ? `${filters} AND` : ""
		} "withdrawals"."type" = 'INSTALLATION' AND "withdrawals"."po_number" IS NULL`,
		replacements: {
			from,
			to,
			install_from,
			install_to
		},
		availableCols: [
			"job_code",
			"job_name",
			"customer_code",
			"customer_name",
			"branch_code",
			"branch_name",
			"do_number",
			"staff_name",
			"withdrawal_status"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const checkWithdrawal = [
	check("branch_id")
		.not()
		.isEmpty()
		.withMessage("Branch must be provided."),
	check("type")
		.isIn(["INSTALLATION", "BORROW", "TRANSFER"])
		.withMessage("Invalid or empty type."),
	check("staff_name")
		.not()
		.isEmpty()
		.withMessage("Staff name must be provided."),
	check("date")
		.not()
		.isEmpty()
		.withMessage("Withdrawal date must be provided."),
	check("job_code")
		.not()
		.isEmpty()
		.withMessage("Job code must be provided.")
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
		do_number,
		staff_name,
		type,
		return_by,
		install_date,
		date,
		remarks,
		po_number
	} = req.body;
	const moreValidation = await Withdrawal.validate({
		do_number,
		type,
		return_by,
		install_date,
		po_number
	});
	if (moreValidation.errors.length > 0) {
		res.status(400).send(moreValidation.errors);
		return;
	}
	if (po_number) {
		const checkJobCode = await PurchaseOrder.checkJob(job_code, po_number);
		if (!checkJobCode) {
			res.status(400).json({
				errors: [
					{
						msg: "The provided PO is for a different job."
					}
				]
			});
			return;
		}
		const checkBranch = await PurchaseOrder.checkBranchInPo(branch_id, po_number);
		if (!checkBranch) {
			res.status(400).json({
				errors: [
					{
						msg: "The provided branch is not in the PO."
					}
				]
			});
			return;
		}
	}

	// po_number and job_code cannot coexist
	// If po_number is specified, job_code will be null
	Withdrawal.create({
		job_code,
		branch_id,
		po_number: type === "INSTALLATION" ? po_number : null,
		do_number,
		staff_name,
		type,
		return_by: type === "BORROW" ? return_by : null,
		install_date: type === "INSTALLATION" ? install_date : null,
		status: "PENDING",
		remarks,
		date,
		billed: false
	})
		.then(row => res.send(row))
		.catch(err => {
			res.status(500).json({ errors: err });
			console.log(err);
		});
});

// Edit Withdrawal (only if it is pending)
router.put("/:id/edit", checkWithdrawal, async (req, res) => {
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
		staff_name,
		type,
		return_by,
		date,
		install_date
	} = req.body;
	const moreValidation = await Withdrawal.validate({
		po_number,
		do_number,
		type,
		return_by,
		install_date
	});
	if (moreValidation.errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}

	if (po_number) {
		const checkJobCode = await PurchaseOrder.checkJob(job_code, po_number);
		if (!checkJobCode) {
			res.status(400).json({
				errors: [
					{
						msg: "The provided PO is for a different job."
					}
				]
			});
			return;
		}
		const checkBranch = await PurchaseOrder.checkBranchInPo(branch_id, po_number);
		if (!checkBranch) {
			res.status(400).json({
				errors: [
					{
						msg: "The provided branch is not in the PO."
					}
				]
			});
			return;
		}
	}

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).json({ errors: [{ msg: "This withdrawal must be PENDING." }] });
		return;
	}

	// po_number and job_code cannot coexist
	// If po_number is specified, job_code will be null
	Withdrawal.update(
		{
			job_code,
			branch_id,
			po_number: type === "INSTALLATION" ? po_number : null,
			do_number,
			staff_name,
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
		.catch(err => res.status(500).json({ errors: err }));
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
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit billing
router.put("/:id/edit-billing", (req, res) => {
	const { id } = req.params;
	const { billed } = req.body;

	Withdrawal.update(
		{
			billed
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
		.catch(err => res.status(500).json({ errors: err }));
});

// Change Status
router.put("/:id/change-status", async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (status == "PRINTED") {
		if (!isPending) {
			res.statusStatus(200);
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
			res.status(500).json({ errors: changeStatus.errors });
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
			if (r.errors.length > 0) res.status(400).json({ errors: r.errors });
			res.sendStatus(200);
		}
	} else if (status == "PENDING") {
		res.status(400).json({ errors: [{ msg: "Cannot change status to PENDING." }] });
	}
});

// Add items to withdrawal
router.put("/:id/add-items", async (req, res) => {
	const { serial_no } = req.body;
	const { id } = req.params;

	// Get Job Code and Branch ID
	let job_code = "";
	let branch_id = "";

	await Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	}).then(res => {
		job_code = res.job_code;
		branch_id = res.branch_id;
	});

	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).json([{ msg: "This withdrawal must be PENDING." }]);
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
		r = await installItems(serial_no, branch_id, job_code);
	} else if (type === "TRANSFER") {
		r = await transferItems(serial_no);
	} else if (type === "BORROW") {
		r = await borrowItems(serial_no);
	} else {
		res.status(400).json({ errors: [{ msg: "Withdrawal type is invalid" }] });
		return;
	}
	errors = r.errors;

	await Promise.all(
		r.updatedSerials.map(async no => {
			ItemWithdrawal.findOrCreate({
				where: {
					serial_no: no,
					withdrawal_id: id
				}
			})
				.then(r => res.sendStatus(200))
				.catch(err =>
					errors.push({
						msg: `Item ${no} cannot be added to the withdrawal.`
					})
				);
		})
	);
	if (errors.length > 0) res.status(400).json({ errors });
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
		res.status(400).json({ errors: [{ msg: "This withdrawal must be PENDING." }] });
		return;
	}

	let errors = [];
	const r = await returnItems(serial_no);
	errors = r.errors;

	await Promise.all(
		r.updatedSerials.map(async no => {
			await ItemWithdrawal.destroy({
				where: {
					serial_no: {
						[Op.eq]: no
					},
					withdrawal_id: {
						[Op.eq]: id
					}
				}
			})
				.then(rows => null)
				.catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) res.status(400).json({ errors });
	else res.sendStatus(200);
});

removeAllItemsAndDelete = id => {
	db.transaction(t => {
		return ItemWithdrawal.findAll(
			{
				where: {
					withdrawal_id: {
						[Op.eq]: id
					}
				}
			},
			{
				transaction: t
			}
		).then(async rows => {
			return Promise.all(
				rows.map(e =>
					Item.update(
						{
							status: "IN_STOCK"
						},
						{
							where: {
								serial_no: {
									[Op.eq]: e.serial_no
								}
							},
							transaction: t
						}
					)
				)
			).then(r =>
				ItemWithdrawal.destroy(
					{
						where: {
							withdrawal_id: {
								[Op.eq]: id
							}
						}
					},
					{
						transaction: t
					}
				).then(rr =>
					Withdrawal.destroy(
						{
							where: {
								id: {
									[Op.eq]: id
								}
							}
						},
						{
							transaction: t
						}
					)
				)
			);
		});
	})
		.then(r => ({
			errors: []
		}))
		.catch(err => ({
			errors: [{ msg: "This withdrawal cannot be deleted." }]
		}));
};

// Delete Withdrawal (only if it is pending)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	// Check if Pending
	const isPending = await Withdrawal.checkStatus(id, "PENDING");
	if (!isPending) {
		res.status(400).json({ errors: [{ msg: "This withdrawal must be PENDING." }] });
		return;
	}

	// Delete items from the withdrawal
	const r = await removeAllItemsAndDelete(id);
	if (r.errors.length > 0) {
		res.status(500).json(r.errors);
	} else {
		res.sendStatus(200);
	}
});

// Force delete withdrawal (no status check) (superadmins only)
router.delete("/:id/force-delete", async (req, res) => {
	const { id } = req.params;
	const r = await removeAllItemsAndDelete(id);
	if (r.errors.length > 0) {
		res.status(500).json(r.errors);
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
