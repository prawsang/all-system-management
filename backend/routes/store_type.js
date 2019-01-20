const express = require("express");
const router = express.Router();
const StoreType = require("../models/StoreType");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.route("/get-all").get((req, res) =>
	StoreType.findAll()
		.then(types => {
			res.send(types);
		})
		.catch(err => res.status(500).send(err.errors))
);

// Add New Store Type
router.post("/add", (req, res) => {
	const { name } = req.query;
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	StoreType.create({
		name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Edit Store Type
router.put("/:id/edit", (req, res) => {
	const { id } = req.params;
	const { name } = req.query;
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	StoreType.update({
			name,
		},{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Delete store type
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	StoreType.destroy({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

module.exports = router;
