const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Model = require("../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.route("/get-all").get((req, res) =>
	Model.findAll()
		.then(models => {
			res.send(models);
		})
		.catch(err => console.log(err))
);

router.route("/:model_no").get((req, res) => {
	const { model_no } = req.params;
	Model.findAll({ where: { model_no: { [Op.eq]: model_no } } })
		.then(models => {
			res.send(models);
		})
		.catch(err => console.log(err));
});

module.exports = router;
