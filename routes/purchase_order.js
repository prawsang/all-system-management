const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const StoreType = require("../models/StoreType");
const PurchaseOrder = require("../models/PurchaseOrder");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");
const tools = require("../utils/tools");

router.get("/get-all", async (req, res) => {
	let { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: [
			{
				model: Job,
				as: "job",
				include: {
					model: Customer,
					as: "customer"
				}
			}
		],
		model: PurchaseOrder
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.get("/:po_number/details", (req, res) => {
	const { po_number } = req.params;
	PurchaseOrder.findOne({
		where: { po_number: { [Op.eq]: po_number } },
		include: [
			{
				model: Job,
				as: "job",
				include: {
					model: Customer,
					as: "customer"
				}
			}
		]
	})
		.then(po => res.send({ po }))
		.catch(err => res.status(500).send(err));
});

// get branches for po
router.get("/:po_number/branches", async (req, res) => {
	const { po_number } = req.params;

	let { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: [
			{
				model: PurchaseOrder,
				where: {
					po_number: {
						[Op.eq]: po_number
					}
				}
			},
			{
				model: StoreType,
				as: "store_type"
			}
		],
		model: Branch
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

checkPOFields = values => {
	const { po_number, description, installed, date, job_code } = values;
	let errors = [];
	if (!po_number) errors.push({ message: "PO Number is required." });
	if (!job_code) errors.push({ message: "Job Code is required." });
	if (!description) errors.push({ message: "Description is required." });
	if (installed === null)
		errors.push({ message: "Please specify if this PO has been installed." });
	if (!date) errors.push({ message: "PO date is required." });
	if (errors.length > 0) return errors;
	else return null;
};
// Add PO information
router.post("/add", (req, res) => {
	const { po_number, description, installed, date, job_code } = req.body;
	const validationErrors = checkPOFields({
		po_number,
		description,
		installed,
		date,
		job_code
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}
	PurchaseOrder.create({
		po_number,
		description,
		installed,
		date,
		job_code
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Edit PO information (date and job_code cannot be edited)
router.put("/:po_number/edit", (req, res) => {
	const { po_number } = req.params;
	const { description, installed, date, job_code } = req.body;
	console.log(req.params);
	const validationErrors = checkPOFields({
		po_number,
		description,
		installed,
		date,
		job_code
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
		.catch(err => res.status(500).send(err));
});

// Remove Branch from PO
router.delete("/:po_number/remove-branch", (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.body;
	db.query(
		"DELETE FROM branch_po \
    WHERE branch_id = " +
			branch_id +
			"AND po_number = '" +
			po_number +
			"'",
		{ type: db.QueryTypes.DELETE }
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Add Branch to PO (if doesn't exist)
router.post("/:po_number/add-branches", async (req, res) => {
	const { po_number } = req.params;
	const { branch_id } = req.body;

	let errors = [];
	console.log(branch_id);
	await Promise.all(
		branch_id.map(async id => {
			await PurchaseOrder.count({
				where: {
					po_number: {
						[Op.eq]: po_number
					}
				},
				include: {
					model: Branch,
					where: {
						id: {
							[Op.eq]: id
						}
					}
				}
			})
				.then(count => {
					console.log(count);
					if (count == 0) {
						db.query(
							"INSERT INTO branch_po (branch_id, po_number)\
								VALUES (" +
								`${id},'${po_number}'` +
								")",
							{ type: db.QueryTypes.INSERT }
						)
							.then(rows => null)
							.catch(err => errors.push(err));
					} else errors.push({ message: "Branch exists for this PO" });
				})
				.catch(err => errors.push(err));
		})
	);
	if (errors.length > 0) {
		res.status(400).send(errors);
		return;
	}
	res.sendStatus(200);
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
		.catch(err => res.status(500).send(err));
});

module.exports = router;
