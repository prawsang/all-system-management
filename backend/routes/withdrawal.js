const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Model = require("../models/Model");
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/get-all", (req, res) => {
	Withdrawal.findAll()
		.then(withdrawals => res.send(withdrawals))
		.catch(err => err);
});

router.get("/single/:id", (req, res) => {
	const { id } = req.params;
	Withdrawal.findOne({
		where: { id: { [Op.eq]: id } },
		include: [
			{
				model: Job,
				as: "job"
			},
			{
				model: Branch,
				as: "branch",
				include: {
					model: Customer,
					as: "customer"
				}
			},
			{
				model: Item,
				as: "items",
				include: {
					model: Model,
					as: "model"
				}
			},
			{
				model: User,
				as: "user"
			}
		]
	})
		.then(withdrawal => res.send(withdrawal))
		.catch(err => err);
});

module.exports = router;
