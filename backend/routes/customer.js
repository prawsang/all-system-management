const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Branch = require("../models/Branch");
const StoreType = require("../models/StoreType");
const tools = require("../utils/tools");

router.get("/get-all", async (req, res) => {
	let { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		search_term,
		search,
		model: Customer
	})
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});
router.get("/:customer_code/details", (req, res) => {
	const { customer_code } = req.params;
	Customer.findOne({
		include: {
			model: Job,
			as: 'jobs'
		},
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		}
	})
		.then(customer => res.send({ customer }))
		.catch(err => res.status(500).send(err));
});

// Get Branches for Customer
router.get("/:customer_code/branches", async (req, res) => {
	const { customer_code } = req.params;
	let { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		where: {
			customer_code: {
				[Op.eq]: customer_code
			}
		},
		include: {
			model: StoreType,
			as: 'store_type'
		},
		search,
		search_term,
		model: Branch
	})
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
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
router.delete("/:customer_code/delete", (req, res) => {
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
