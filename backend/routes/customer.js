const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");

router.get("/get-all", (req, res) => {
	Customer.findAll()
		.then(customers => res.send(customers))
		.catch(err => res.status(500).send(err));
});
router.get("/:customer_code", (req, res) => {
	const { customer_code } = req.params;
	Customer.findOne({
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		}
	})
		.then(customer => res.send(customer))
		.catch(err => res.status(500).send(err));
});

module.exports = router;
