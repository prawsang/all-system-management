const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator/check");
const tools = require("../utils/tools");

router.get("/get-all", async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		model: User
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});
router.get("/:staff_code/details", (req, res) => {
	const { staff_code } = req.params;
	User.findOne({
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		}
	})
		.then(user => res.send({ user }))
		.catch(err => res.status(500).json({ errors: err }));
});

const userValidation = [
	check("department")
		.not()
		.isEmpty()
		.isIn(["ADMIN", "STOCK", "ACCOUNTANT", "SERVICE", "SYSTEM"])
		.withMessage("Invalid or empty department"),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Name cannot be empty."),
	check("password")
		.not()
		.isEmpty()
		.withMessage("Password cannot be empty.")
];

// Add New User
router.post("/add", userValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { name, department } = req.body;
	let { password } = req.body;
	bcrypt
		.hash(password, 12)
		.then(hashedPassword => {
			User.create({
				name,
				department,
				password: hashedPassword
			})
				.then(rows => res.sendStatus(200))
				.catch(err => console.log(err.errors));
		})
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit User
router.put("/:staff_code/edit", (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { staff_code } = req.params;
	const { name, department } = req.body;
	let { password } = req.body;

	bcrypt
		.hash(password, 12)
		.then(hashedPassword => {
			User.update(
				{
					name,
					department,
					password: hashedPassword
				},
				{
					where: {
						staff_code: {
							[Op.eq]: staff_code
						}
					}
				}
			)
				.then(rows => res.sendStatus(200))
				.catch(err => res.status(500).json({ errors: err }));
		})
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete user
router.delete("/:staff_code", (req, res) => {
	const { staff_code } = req.params;
	User.destroy({
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
