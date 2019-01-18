const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Item = require("../models/Item");
const Model = require("../models/Model");
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Withdrawal = require("../models/Withdrawal");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.route("/get-all").get((req, res) =>
	Item.findAll({
		include: {
			model: Model,
			as: "model"
		}
	})
		.then(models => {
			res.send(models);
		})
		.catch(err => console.log(err))
);

router.route("/single/:serial_no").get((req, res) => {
	const { serial_no } = req.params;
	Item.findOne({
		where: { serial_no: { [Op.eq]: serial_no } },
		include: [
			{
				model: Model,
				as: "model"
			},
			{
				model: Withdrawal,
                as: "withdrawal",
                include: [{
                    model: Branch,
                    as: 'branch',
                    include: {
                        model: Customer,
                        as: 'customer'
                    }
                },{
                    model: Job,
                    as: 'job'
                }]
			},{
                model: Job,
                as: 'reserve_job'
            },{
                model: Branch,
                as: 'reserve_branch'
            }]
	})
		.then(models => {
			res.send(models);
		})
		.catch(err => console.log(err));
});

module.exports = router;
