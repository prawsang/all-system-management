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
		.catch(err => res.status(500).send(err))
);

router.route("/single/:id").get((req, res) => {
	const { id } = req.params;
	Model.findOne({ where: { id: { [Op.eq]: id } } })
		.then(models => {
			res.send(models);
		})
		.catch(err => res.status(500).send(err));
});

module.exports = router;
