const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Job = require('../models/Job');
const Customer = require('../models/Customer');

router.get('/get-all', (req,res) => {
    Customer.findAll()
        .then(customers => res.send(customers))
        .catch(err => console.log(err));
})
router.get('/single/:customer_code', (req,res) => {
    const { customer_code } = req.params;
    Customer.findOne({
        where: {
            customer_code: {
                [Op.eq]: customer_code
            }
        },
        include: {
            model: Job,
            as: 'jobs'
        }
    })
        .then(customer => res.send(customer))
        .catch(err => console.log(err))
})

module.exports = router;