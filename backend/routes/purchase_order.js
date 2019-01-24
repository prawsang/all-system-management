const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const PurchaseOrder = require("../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");

router.get("/get-all/:page", async (req, res) => {
	const { limit } = req.query; // records per page
	let offset = 0;
	let count = 0;
	await PurchaseOrder.findAndCountAll()
		.then(c => count = c.count)
		.catch(err => res.status(500).send(err.errors));
	if (count == 0) return;

	const { page } = req.params;
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

	PurchaseOrder.findAll({
		limit,
		offset,
		include: [
			{
				model:Job,
				as: 'job',
				include: {
					model: Customer,
					as: 'customer'
				}
			}
		]
	})
		.then(po => res.send({
			data: po,
			count,
			pagesCount
		}))
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err.errors));
});

checkPOFields = (values) => {
	const { po_number, description, installed, date } = values;
	let errors = [];
	if (!po_number) errors.push({message: "PO Number is required."});
	if (!description) errors.push({message: "Description is required."});
	if (!installed) errors.push({message: "Please specify if this PO has been installed."});
	if (!date) errors.push({message: "PO date is required."});
	if (errors.length > 0) return errors;
	else return null;
}
// Add PO information
router.post("/add", (req, res) => {
	const { po_number, description, installed, date } = req.query;
	const validationErrors = checkPOFields({
		po_number,
		description,
		installed,
		date
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}
	PurchaseOrder.create(
		{
			po_number,
			description,
			installed,
			date
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Edit PO information (date and job_code cannot be edited)
router.put("/:po_number/edit", (req, res) => {
	const { po_number } = req.params;
	const { description, installed, date } = req.query;
	const validationErrors = checkPOFields({
		po_number,
		description,
		installed,
		date
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}
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
		.catch(err => res.status(500).send(err.errors));
});

// Remove Branch from PO
router.delete("/:po_number/remove-branch", (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.query;
	db.query("DELETE FROM branch_po \
    WHERE branch_id = " + branch_id + "AND po_number = '" + po_number + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
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
					.catch(err => res.status(500).send(err.errors));
			} else res.status(400).send([{message: "Branch exists for this PO"}]);
		})
		.catch(err => res.status(500).send(err.errors));
});

// Delete PO (Superadmins Only)
router.delete("/:po_number", (req, res) => {
	const { po_number } = req.params;
	PurchaseOrder.destroy({
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

module.exports = router;
