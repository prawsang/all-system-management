const express = require("express");
const router = express.Router();
const Model = require("../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const tools = require("../utils/tools");
const { check, validationResult } = require("express-validator/check");

router.route("/get-all").get(async (req, res) => {
	let { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		model: Model
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.route("/:id/details").get((req, res) => {
	const { id } = req.params;
	Model.findOne({ where: { id: { [Op.eq]: id } } })
		.then(model => {
			res.send({
				model
			});
		})
		.catch(err => res.status(500).send(err));
});

router.route("/type/:type").get(async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const { type } = req.params;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		where: {
			type: {
				[Op.eq]: type
			}
		},
		model: Model
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

module.exports = router;
