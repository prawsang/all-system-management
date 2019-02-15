const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Branch = require("../models/Branch");
const StoreType = require("../models/StoreType");
const tools = require("../utils/tools");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	const { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		search_term,
		search,
		model: Customer
	});
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
			as: "jobs"
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
	const { limit, page, search, search_term } = req.query;

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
			as: "store_type"
		},
		search,
		search_term,
		model: Branch
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

const customerValidation = [
	check("customer_code")
		.not()
		.isEmpty()
		.withMessage("Customer code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Customer name cannot be empty.")
];

// Add New Customer
router.post("/add", customerValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}
	const { customer_code, name } = req.body;
	Customer.create({
		customer_code,
		name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Edit Customer
router.put("/:customer_code/edit", customerValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { customer_code } = req.params;
	const { name } = req.body;
	Customer.update(
		{
			name
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
