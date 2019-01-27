const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");

router.get("/get-all", async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Customer.findAndCountAll()
		.then(c => (count = c.count))
		.catch(err => res.status(500).send(err));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);
	
	Customer.findAll({
		limit,
		offset
	})
		.then(customers => res.send({
			customers,
			count,
			pagesCount
		}))
		.catch(err => res.status(500).send(err));
});
router.get("/single/:customer_code", (req, res) => {
	const { customer_code } = req.params;
	Customer.findOne({
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		}
	})
		.then(customer => res.send({ customer }))
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

module.exports = router;
