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
router.get('/single/:staff_code', (req,res) => {
    const { staff_code } = req.params;
    User.findOne({
        where: {
            staff_code: {
                [Op.eq]: staff_code
            }
        }
    })
        .then(user => res.send(user))
        .catch(err => console.log(err))
});

module.exports = router;