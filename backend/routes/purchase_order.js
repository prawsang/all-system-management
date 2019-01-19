const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Model = require("../models/Model");
const PurchaseOrder = require("../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");

router.get("/get-all", (req, res) => {
	PurchaseOrder.findAll()
		.then(po => res.send(po))
		.catch(err => err);
});

router.get("/:po_number", (req, res) => {
	const { po_number } = req.params;
	PurchaseOrder.findOne({
		where: { po_number: { [Op.eq]: po_number } },
		include: [
			{
				model: Job,
				as: "job"
			},
			{
				model: Branch,
				as: "branches"
			}
		]
	})
		.then(po => res.send(po))
		.catch(err => res.status(500).send(err));
});

// Edit PO information (date and job_code cannot be edited)
router.put("/:po_number/edit", (req, res) => {
	const { po_number } = req.params;
	const { description, installed } = req.query;
	PurchaseOrder.update(
		{
			description,
			installed
		},
		{
			where: {
				po_number: {
					[Op.eq]: po_number
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Remove Branch from PO
router.delete("/:po_number/remove-branch", (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.query;
	db.query("DELETE FROM branch_po \
    WHERE branch_id = " + branch_id + "AND po_number = '" + po_number + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Add Branch to PO (if doesn't exist)
router.post("/:po_number/add-branch", (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.query;
	PurchaseOrder.count({
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		},
		include: {
			model: Branch,
			where: {
				id: {
					[Op.eq]: branch_id
				}
			}
		}
	})
		.then(count => {
			if (count == 0) {
				db.query("INSERT INTO branch_po (branch_id, po_number)\
                        VALUES (" + `${branch_id},'${po_number}'` + ")", { type: db.QueryTypes.INSERT })
					.then(rows => res.sendStatus(200))
					.catch(err => res.status(500).send(err));
			} else res.status(400).send({details: "Branch exists for this PO"});
		})
		.catch(err => res.status(500).send(err));
});

// Delete PO (Superadmins Only)
// router.delete("/:po_number", (req, res) => {
// 	const { po_number } = req.params;
// 	PurchaseOrder.destroy({
// 		where: {
// 			po_number: {
// 				[Op.eq]: po_number
// 			}
// 		}
// 	})
// 		.then(rows => res.sendStatus(200))
// 		.catch(err => res.status(500).send(err));
// });

module.exports = router;
