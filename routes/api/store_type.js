const express = require("express");
const router = express.Router();
const StoreType = require("../../models/StoreType");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

router.route("/get-all").get(async (req, res) => {
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: StoreType.getColumns,
		tables: `"store_types"`,
		availableCols: ["store_type_name"]
	});
	if (q.errors) {
		res.status(500).json(q);
	} else {
		res.json(q);
	}
});

const storeTypeValidation = [
	check("name")
		.not()
		.isEmpty()
		.withMessage("Store type name must be provided.")
];

// Add New Store Type
router.post("/add", storeTypeValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { name } = req.body;
	StoreType.create({
		name
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Store Type
router.put("/:id/edit", storeTypeValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	const { id } = req.params;
	const { name } = req.body;
	StoreType.update(
		{
			name
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
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
		.catch(err => res.status(500).json({ errors: err }));
});

module.exports = router;
