const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Model = require("../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/models", (req, res) =>
	Model.findAll()
		.then(models => {
			res.send(models);
		})
		.catch(err => console.log(err))
);

module.exports = router;
