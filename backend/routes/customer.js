const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");

router.get("/get-all", (req, res) => {
	Customer.findAll()
		.then(customers => res.send(customers))
		.catch(err => res.status(500).send(err.errors));
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
		.catch(err => res.status(500).send(err.errors));
});

// Add New Customer
router.post("/add", (req, res) => {
	const { customer_code, name } = req.query;
	if (!customer_code) {
		res.status(400).send([{message: "Customer Code is required."}]);
		return;
	}
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	Customer.create({
		customer_code,
		name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Edit Customer
router.put("/:customer_code/edit", (req, res) => {
	const { customer_code } = req.params;
	const { name } = req.query;
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	Customer.update(
		{
			name,
		},
		{
			where: {
				customer_code: {
					[Op.eq]: customer_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});


// Delete customer
router.delete("/:customer_code", (req, res) => {
	const { customer_code } = req.params;
	Customer.destroy({
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

module.exports = router;
