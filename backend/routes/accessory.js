const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Accessory = require("../models/Accessory");
const Model = require("../models/Model");

router.get("/get-all", (req, res) =>
	Accessory.findAll({
        include: {
            model: Model,
            as: 'model'
        }
    })
		.then(accs => res.send(accs))
		.catch(err => console.log(err))
);

module.exports = router;
