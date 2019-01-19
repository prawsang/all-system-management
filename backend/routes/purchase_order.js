const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Model = require("../models/Model");
const PurchaseOrder = require("../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");

router.get("/get-all", (req, res) => {
	PurchaseOrder.findAll()
		.then(po => res.send(po))
		.catch(err => err);
});

router.get("/single/:po_number", (req, res) => {
	const { po_number } = req.params;
	PurchaseOrder.findOne({
		where: { po_number: { [Op.eq]: po_number } },
		include: [
			{
				model: Job,
				as: "job"
			},
			{
				model: Branch,
				as: "branches"
			}
		]
	})
		.then(po => res.send(po))
		.catch(err => res.status(500).send(err));
});

module.exports = router;
