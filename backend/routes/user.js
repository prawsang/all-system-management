const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');

router.get("/get-all", (req, res) =>
	User.findAll()
		.then(users => res.send(users))
		.catch(err => res.status(500).send(err))
);
router.get("/:staff_code", (req, res) => {
	const { staff_code } = req.params;
	User.findOne({
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		}
	})
		.then(user => res.send(user))
		.catch(err => res.status(500).send(err));
});

checkUserFields = (values) => {
    const { name, staff_code, department, password } = values;
    let errors = [];
    if (!name) errors.push({message: "Name is required."});
    if (!staff_code) errors.push({message: "Staff Code is required."});
    if (!department) errors.push({message: "Department is required."});
    if (!password) errors.push({message: "Password is required."});
    if (errors.length > 0) return errors;
    else return null;
}

// Add New User
router.post("/add", (req, res) => {
    const { name, staff_code, department } = req.query;
    let { password } = req.query;
    const validationErrors = checkUserFields({
        name,
        staff_code,
        department,
        password
    });
    if (validationErrors) {
        res.status(400).send(validationErrors);
        return;
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            User.create({
                staff_code,
                name,
                department,
                password: hashedPassword
            })
                .then(rows => res.sendStatus(200))
                .catch(err => console.log(err.errors));
        })
        .catch(err => res.status(500).send(err));
});

// Edit User
router.put("/:staff_code/edit", (req, res) => {
	const { staff_code } = req.params;
    const { name, department } = req.query;
    let { password } = req.query;
    const validationErrors = checkUserFields({
        name,
        staff_code,
        department,
        password
    });
    if (validationErrors) {
        res.status(400).send(validationErrors);
        return;
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            console.log(password)
            User.update({
                name,
                department,
                password: hashedPassword
            },{
                where: {
                    staff_code: {
                        [Op.eq]: staff_code
                    }
                }
            })
                .then(rows => res.sendStatus(200))
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
});

// Delete user
router.delete("/:staff_code", (req, res) => {
	const { staff_code } = req.params;
	User.destroy({
		where: {
			staff_code: {
				[Op.eq]: staff_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

module.exports = router;
