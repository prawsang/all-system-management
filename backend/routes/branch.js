const express = require('express');
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const PurchaseOrder = require("../models/PurchaseOrder");
const StoreType = require("../models/StoreType");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get('/get-all', (req,res) => 
    Branch.findAll({
        include: {
            model: StoreType,
            as: 'store_type'
        }
    })
        .then(branches => res.send(branches))
        .catch(err => console.log(err))
);
router.get('/single/:id', (req,res) => {
    const { id } = req.params;
    Branch.findOne({
        where: {
            id: {
                [Op.eq]: id
            }
        },
        include: [{
            model: Job,
            as: 'jobs'
        },{
            model: PurchaseOrder,
            as: 'purchase_orders'
        },{
            model: StoreType,
            as: 'store_type'
        }]
    })
        .then(branch => res.send(branch))
        .catch(err => console.log(err))
});

module.exports = router;