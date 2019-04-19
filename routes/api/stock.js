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
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.use("/", require("./stock_status").router);

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, broken, status, type } = req.query;

	const filters = Item.filter({
		broken,
		status,
		type
	});

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
			status: status ? status.toUpperCase() : null,
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
	const { limit, page, search_col, search_term, return_to, return_from, type } = req.query;

	const typeFilter = Item.filter({ type });

	let filters = null;
	if (return_from || return_to) {
		const f = return_from ? `"withdrawals"."return_by" >= :return_from` : null;
		const t = return_to ? `"withdrawals"."return_by" <= :return_to` : null;
		filters = [f, t].filter(e => e).join(" AND ");
	}

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Model.getColumns}, 
			${Item.getColumns},
			"tm"."return_by"`,
		tables: `"stock"
		JOIN "models" ON "models"."id" = "stock"."model_id"
		JOIN "item_withdrawal" ON "item_withdrawal"."serial_no" = "stock"."serial_no"
		JOIN "withdrawals" ON "item_withdrawal"."withdrawal_id" = "withdrawals"."id"
		JOIN (
			SELECT "serial_no", max(withdrawals.return_by) AS "return_by"
			FROM "withdrawals"
			JOIN "item_withdrawal" ON "item_withdrawal"."withdrawal_id" = "withdrawals"."id"
			GROUP BY "serial_no"
		) "tm" ON "withdrawals"."return_by" = "tm"."return_by" AND "stock"."serial_no" = "tm"."serial_no"
		`,
		where: `"stock"."status" = 'BORROWED' 
			AND "withdrawals"."type" = 'BORROW' 
			${filters ? `AND ${filters}` : ""} 
			${typeFilter ? `AND ${typeFilter}` : ""}`,
		replacements: {
			return_from,
			return_to,
			type
		},
		availableCols: ["serial_no", "model_name", "stock_location", "po_number", "pr_number"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

// Get reserved items
router.get("/reserved", async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;

	const typeFilter = Item.filter({ type });

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
		where: `"stock"."status" = 'RESERVED' ${typeFilter ? `AND ${typeFilter}` : ""}`,
		replacements: {
			type
		},
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
	const { limit, page, search_col, search_term, type } = req.query;

	const filters = Item.filter({
		type
	});

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"stock"
		JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: `"stock"."reserve_branch_id" = :branch_id ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			branch_id,
			type
		},
		availableCols: [
			"serial_no",
			"model_name",
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
	const { limit, page, search_col, search_term, type } = req.query;

	const filters = Item.filter({
		type
	});

	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Item.getColumns}, ${Model.getColumns}`,
		tables: `"stock"
		JOIN "models" ON "stock"."model_id" = "models"."id"
		`,
		where: `"stock"."reserve_job_code" = :job_code ${filters ? `AND ${filters}` : ""}`,
		replacements: {
			job_code,
			broken,
			type
		},
		availableCols: [
			"serial_no",
			"model_name",
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
