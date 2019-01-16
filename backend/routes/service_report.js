const express = require("express");
const router = express.Router();
const db = require("../config/database");
const ServiceReport = require("../models/ServiceReport");
const Location = require("../models/Location");
const Accessory = require("../models/Accessory");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Model = require("../models/Model");
const User = require("../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Get all service report details
router.get("/get-all", (req, res) =>
	ServiceReport.findAll({
		include: [
			{
				model: Location,
				as: "location",
				include: {
					model: Job,
					as: "job",
					include: {
						model: Customer,
						as: "customer"
					}
				}
			}
		]
	})
		.then(serviceReports => res.send(serviceReports))
		.catch(err => console.log(err))
);

// Get single service report details
router.get("/single/:id", (req, res) => {
	const { id } = req.params;
	ServiceReport.findOne({
		where: {
			id: { [Op.eq]: id }
        },
        include: [
			{
				model: Location,
				as: "location",
				include: {
					model: Job,
					as: "job",
					include: {
						model: Customer,
						as: "customer"
					}
				}
			}, {
                model: User,
                as: 'user'
            }, {
				model: Accessory,
				as: 'accessories',
				include: {
					model: Model,
					as: 'model'
				}
			}
		]
	})
		.then(serviceReport => res.send(serviceReport))
		.catch(err => console.log(err));
});

module.exports = router;
