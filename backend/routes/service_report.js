const express = require("express");
const router = express.Router();
const db = require("../config/database");
const ServiceReport = require("../models/ServiceReport");
const Location = require("../models/Location");
const Accessory = require("../models/Accessory");
const Model = require("../models/Model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Get all service report details
router.get("/get-all", (req, res) =>
	ServiceReport.findAll({
		include: [
			{
				model: Location,
				as: "location"
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
		}
	})
		.then(serviceReport => res.send(serviceReport))
		.catch(err => console.log(err));
});

// Get accessories for a service report
router.get("/acc/:id", (req, res) => {
	const { id } = req.params;
	Accessory.findAll({
        include: {
            model: Model,
            as: 'model'
        },
		where: { service_report: { [Op.eq]: id } }
	})
		.then(accs => res.send(accs))
		.catch(err => console.log(err));
});

module.exports = router;
