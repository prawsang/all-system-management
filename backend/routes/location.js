const express = require('express');
const router = express.Router();
const Location = require("../models/Location");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const ServiceReport = require("../models/ServiceReport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;



router.get('/get-all', (req,res) => 
    Location.findAll({
        include: [{
            model: Job,
            as: 'job',
            include: {
                model: Customer,
                as: 'customer'
            }
        }]
    })
        .then(locations => res.send(locations))
        .catch(err => console.log(err))
);
router.get('/single/:branch_code', (req,res) => {
    const { branch_code } = req.params;
    Location.findOne({
        where: {
            branch_code: {
                [Op.eq]: branch_code
            }
        },
        include: [{
            model: Job,
            as: 'job',
            include: {
                model: Customer,
                as: 'customer'
            }
        },{
            model: ServiceReport,
            as: 'service_reports'
        }]
    })
        .then(location => res.send(location))
        .catch(err => console.log(err))
});

module.exports = router;