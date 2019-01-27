const express = require("express");
const router = express.Router();
const Model = require("../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.route("/get-all").get(async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Model.findAndCountAll()
		.then(c => (count = c.count))
		.catch(err => res.status(500).send(err));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);
	
	Model.findAll({
		limit,
		offset
	})
		.then(models => {
			res.send({
				models,
				count,
				pagesCount
			});
		})
		.catch(err => res.status(500).send(err))
});

router.route("/single/:id").get((req, res) => {
	const { id } = req.params;
	Model.findOne({ where: { id: { [Op.eq]: id } } })
		.then(model => {
			res.send({
				model
			});
		})
		.catch(err => res.status(500).send(err));
});

// Add New Model
router.post("/add", (req, res) => {
	const { name, type } = req.query;
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	if (!type) {
		res.status(400).send([{message: "Model type is required."}]);
		return;
	}
	Model.create({
		name,
		type
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Edit Model
router.put("/:id/edit", (req, res) => {
	const { id } = req.params;
	const { name, type } = req.query;
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	if (!type) {
		res.status(400).send([{message: "Model type is required."}]);
		return;
	}
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
