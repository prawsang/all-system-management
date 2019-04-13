const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const Item = require("../../models/Item");
const Model = require("../../models/Model");
const Branch = require("../../models/Branch");
const Job = require("../../models/Job");
const Customer = require("../../models/Customer");
const Withdrawal = require("../../models/Withdrawal");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const tools = require("../../utils/tools");
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.use("/", require("./stock_status").router);

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, broken, status } = req.query;

	let filters = null;
	if (broken || status) {
		let brokenFilter = broken
			? broken === "true"
				? `"stock"."broken"`
				: `NOT "stock"."broken"`
			: null;
		let statusFilter = status ? `"stock"."status" = :status` : null;
		filters = [brokenFilter, statusFilter].filter(e => e).join(" AND ");
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"stock"
		JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: filters,
		replacements: {
			status: status ? status.toUpperCase() : null
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

router.get("/:serial_no/details", (req, res) => {
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
				as: "withdrawals",
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
		.then(item => {
			res.send({
				item
			});
		})
		.catch(err => res.status(500).json({ errors: err }));
});

// Get borrowed items
router.get("/borrowed", async (req, res) => {
	const { limit, page, search_col, search_term, return_to, return_from } = req.query;

	let filters = null;
	if ((return_to || return_from) && status.toUpperCase() == "BORROWED") {
		filters = `"withdrawals"."return_by" >= :return_from AND "withdrawals"."return_by" <= :return_to`;
	} else if (return_to) {
		// for overdue items
		filters = `"withdrawals"."return_by" <= :return_to`;
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Model.getColumns}, ${Item.getColumns}, "withdrawals"."return_by"`,
		tables: `"stock"
		JOIN "models" ON "models"."id" = "stock"."model_id"
		LEFT OUTER JOIN "item_withdrawal" ON "item_withdrawal"."serial_no" = "stock"."serial_no"
		LEFT OUTER JOIN "withdrawals" ON "withdrawals"."id" = "item_withdrawal"."withdrawal_id"
		`,
		where: `"stock"."status" = 'BORROWED' ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			return_from,
			return_to
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
		console.log(q.errors);
	} else {
		res.json(q);
	}
});

// Get reserved items
router.get("/reserved", async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns}, ${Customer.getColumns}, ${Model.getColumns}, ${
			Job.getColumns
		}, ${Item.getColumns}`,
		tables: `"stock"
		LEFT OUTER JOIN "branches" ON "stock"."reserve_branch_id" = "branches"."id"
		LEFT OUTER JOIN "jobs" ON "stock"."reserve_job_code" = "jobs"."job_code"
		LEFT OUTER JOIN "customers" ON "branches"."customer_code" = "customers"."customer_code"
		JOIN "models" ON "models"."id" = "stock"."model_id"
		`,
		where: `"stock"."status" = "RESERVED"`,
		availableCols: [
			"serial_no",
			"model_id",
			"status",
			"stock_location",
			"po_number",
			"pr_number",
			"branch_id",
			"branch_name",
			"job_code",
			"job_name",
			"customer_code",
			"customer_name"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Get all items reserved by branch
router.get("/reserve-branch-id/:branch_id", async (req, res) => {
	const { branch_id } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"stock"
		JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: `"stock"."reserved_branch_id" = :branch_id`,
		replacements: {
			branch_id
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

// Get all items reserved by job
router.get("/reserve-job-code/:job_code", async (req, res) => {
	const { job_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"stock"
		JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: `"stock"."reserved_job_code" = :job_code`,
		replacements: {
			job_code
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

const stockValidation = [
	check("model_id")
		.not()
		.isEmpty()
		.withMessage("Model must be provided."),
	check("stock_location")
		.not()
		.isEmpty()
		.withMessage("Stock location must be provided."),
	check("po_number")
		.not()
		.isEmpty()
		.withMessage("PO number must be provided.")
];

// Add items to stock
router.post("/add", stockValidation, async (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { model_id, remarks, serial_no, stock_location, po_number, pr_number } = req.body;

	let errors = [];
	await Promise.all(
		serial_no.map(async no => {
			await Item.create({
				serial_no: no,
				model_id,
				remarks,
				status: "IN_STOCK",
				stock_location,
				broken: false,
				po_number,
				pr_number
			}).catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) res.status(500).json({ errors });
	else res.sendStatus(200);
});

// Edit Item
router.put("/:serial_no/edit", stockValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { serial_no } = req.params;
	const { model_id, remarks, stock_location, po_number, pr_number } = req.body;
	Item.update(
		{
			model_id,
			remarks,
			stock_location,
			po_number,
			pr_number
		},
		{
			where: {
				serial_no: {
					[Op.eq]: serial_no
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete Item from Stock (superadmins only)
router.delete("/:serial_no", (req, res) => {
	const { serial_no } = req.params;
	Item.destroy({
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
