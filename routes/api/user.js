const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");
const auth = require("../auth");
const passport = require("passport");
const crypto = require("crypto");
const { query } = require("../../utils/query");

router.post("/login", auth.optional, (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(422).json({
			errors: [
				{
					msg: "Both username and password are required."
				}
			]
		});
		return;
	}
	return passport.authenticate("local", { session: false }, (err, passportUser, info) => {
		if (err) {
			return next(err);
		}

		if (passportUser) {
			const user = passportUser;
			user.token = passportUser.generateJWT();

			return res.json({ user: user.toAuthJSON() });
		}

		return res.status(400).send(info);
	})(req, res, next);
});

router.get("/get-all", auth.required, async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: User.getColumns,
		tables: `"users"`,
		availableCols: ["username", "department"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});
router.get("/:id/details", auth.required, (req, res) => {
	const { id } = req.params;
	User.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(user => res.send({ user }))
		.catch(err => res.status(500).json({ errors: err }));
});

const userValidation = [
	check("department")
		.isIn(["ADMIN", "STOCK", "ACCOUNTANT", "SERVICE", "SYSTEM"])
		.withMessage("Invalid or empty department"),
	check("username")
		.not()
		.isEmpty()
		.withMessage("Name cannot be empty."),
	check("password")
		.not()
		.isEmpty()
		.withMessage("Password cannot be empty.")
];

// Add New User
router.post("/add", auth.required, userValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { username, password, department } = req.body;

	const hash = crypto
		.createHmac("sha256", "0FA125A668")
		.update(password)
		.digest("hex");
	User.create({
		username,
		department,
		password: hash
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit User
router.put("/:id/edit", auth.required, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { id } = req.params;
	const { username, password, department } = req.body;

	const hash = crypto
		.createHmac("sha256", "0FA125A668")
		.update(password)
		.digest("hex");

	User.update(
		{
			username,
			department,
			password: hash
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Delete user
router.delete("/:id", auth.required, (req, res) => {
	const { id } = req.params;
	User.destroy({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
