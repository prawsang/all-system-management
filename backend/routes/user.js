const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get('/get-all', (req,res) => 
    User.findAll()
        .then(users => res.send(users))
        .catch(err => console.log(err))
);
router.get('/single/:staff_id', (req,res) => {
    const { staff_id } = req.params;
    User.findOne({
        where: {
            staff_id: {
                [Op.eq]: staff_id
            }
        }
    })
});

module.exports = router;