const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const PurchaseOrder = require("../models/PurchaseOrder");
const StoreType = require("../models/StoreType");
const Sequelize = require("sequelize");
const db = require("../config/database");
const Op = Sequelize.Op;

router.get("/get-all", (req, res) =>
	Branch.findAll({
		include: {
			model: StoreType,
			as: "store_type"
		}
	})
		.then(branches => res.send(branches))
		.catch(err => res.status(500).send(err))
);
router.get("/single/:id", (req, res) => {
	const { id } = req.params;
	Branch.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: [
			{
				model: Job,
				as: "jobs"
			},
			{
				model: PurchaseOrder,
				as: "purchase_orders"
			},
			{
				model: StoreType,
				as: "store_type"
			}
		]
	})
		.then(branch => res.send(branch))
		.catch(err => res.status(500).send(err));
});

router.get("/no-install", (req, res) => {
	Branch.findAll({
		include: {
			model: PurchaseOrder,
			as: "purchase_orders",
			where: {
				installed: {
					[Op.eq]: false
				}
			}
		}
	})
		.then(branches => res.send(branches))
		.catch(err => res.status(500).send(err));
});

// List of po_number of a branch
router.get("/get-po-number/:branch_id", (req, res) => {
	const { branch_id } = req.params;
	db.query("SELECT po_number\
		FROM branch_po\
		WHERE branch_po.branch_id = " + branch_id, { type: db.QueryTypes.SELECT })
		.then(po => res.send(po))
		.catch(err => res.status(500).send(err));
});

// Edit Branch
router.put("/edit/:id", (req, res) => {
	const { id } = req.params;
	const { customer_code, branch_code, name, store_type_id, address, province } = req.query;
	Branch.update(
		{
			customer_code,
			branch_code,
			name,
			store_type_id,
			address,
			province
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => res.send(rows))
		.catch(err => res.status(400).send(err));
});

module.exports = router;
