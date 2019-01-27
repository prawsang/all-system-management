const express = require("express");
const router = express.Router();
const StoreType = require("../models/StoreType");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.route("/get-all").get(async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await StoreType.findAndCountAll()
		.then(c => (count = c.count))
		.catch(err => res.status(500).send(err));
	if (count == 0) return;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

	StoreType.findAll({
		offset,
		limit
	})
		.then(types => {
			res.send({
				types,
				count,
				pagesCount
			});
		})
		.catch(err => res.status(500).send(err))
});

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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

module.exports = router;
