const express = require("express");
const router = express.Router();
const Model = require("../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.route("/get-all").get((req, res) =>
	Model.findAll()
		.then(models => {
			res.send(models);
		})
		.catch(err => res.status(500).send(err.errors))
);

router.route("/:id").get((req, res) => {
	const { id } = req.params;
	Model.findOne({ where: { id: { [Op.eq]: id } } })
		.then(models => {
			res.send(models);
		})
		.catch(err => res.status(500).send(err.errors));
});

// Add New Model
router.post("/add", (req, res) => {
	const { name, type } = req.query;
	Model.create({
		name,
		type
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Edit Model
router.put("/:id/edit", (req, res) => {
	const { id } = req.params;
	const { name, type } = req.query;
	Model.update({
			name,
			type
		},{
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
		.catch(err => res.status(500).send(err.errors));
});

module.exports = router;
