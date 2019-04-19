const express = require("express");
const router = express.Router();
const Model = require("../../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("../../utils/query");
const { check, validationResult } = require("express-validator/check");

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term, type } = req.query;
	let filters = null;
	if (type) {
		filters = `"models"."type" = :type`;
	}
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: Model.getColumns,
		tables: `"models"`,
		where: filters ? filters : null,
		availableCols: ["model_id", "model_name"],
		replacements: {
			type
		}
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

router.route("/:id/details").get((req, res) => {
	const { id } = req.params;
	Model.findOne({ where: { id: { [Op.eq]: id } } })
		.then(model => {
			res.send({
				model
			});
		})
		.catch(err => res.status(500).json({ errors: err }));
});

router.route("/type/:type").get(async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const { type } = req.params;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: Model.getColumns,
		tables: `"models"`,
		where: `"models"."type" = :type`,
		replacements: {
			type: type.toUpperCase()
		},
		availableCols: ["model_id", "model_name"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const modelValidation = [
	check("name")
		.not()
		.isEmpty()
		.withMessage("Model name cannot be empty."),
	check("type")
		.isIn(["POS", "SCANNER", "KEYBOARD", "CASH_DRAWER", "MONITOR", "PRINTER", "OTHER"])
		.withMessage("Invalid type")
];

// Add New Model
router.post("/add", modelValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { name, type } = req.body;
	Model.create({
		name,
		type
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Model
router.put("/:id/edit", (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { id } = req.params;
	const { name, type } = req.body;
	Model.update(
		{
			name,
			type
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

// Delete Model
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	Model.destroy({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
