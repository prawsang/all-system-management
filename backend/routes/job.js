const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Job = require('../models/Job');
const Customer = require('../models/Customer');
const Location = require('../models/Location');

router.get('/get-all', (req,res) => {
    Job.findAll({
        include: {
            model: Customer,
            as: 'customer'
        }
    })
        .then(jobs => res.send(jobs))
        .catch(err => console.log(err));
});

router.get('/single/:job_code', (req,res) => {
    const { job_code } = req.params;
    Job.findOne({
        include: [{
            model: Customer,
            as: 'customer'
        },{
            model: Location,
            as: 'locations'
        }],
        where: {
            job_code: {
                [Op.eq]: job_code
            }
        }
    })
        .then(job => res.send(job))
        .catch(err => console.log(err));
});

module.exports = router;