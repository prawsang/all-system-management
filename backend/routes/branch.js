const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const PurchaseOrder = require("../models/PurchaseOrder");
const Withdrawals = require("../models/Withdrawal");
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
		.catch(err => res.status(500).send(err.errors))
);
router.get("/:id", (req, res) => {
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
				model: Withdrawals,
				as: "withdrawals"
			},
			{
				model: StoreType,
				as: "store_type"
			}
		]
	})
		.then(branch => res.send(branch))
		.catch(err => res.status(500).send(err.errors));
});

// List of branches with po but po has installed = false
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
		.catch(err => res.status(500).send(err.errors));
});

// List of po_number of a branch
router.get("/:id/get-po-number", (req, res) => {
	const { id } = req.params;
	db.query("SELECT po_number\
		FROM branch_po\
		WHERE branch_po.branch_id = " + id, { type: db.QueryTypes.SELECT })
		.then(po => res.send(po))
		.catch(err => res.status(500).send(err.errors));
});

checkBranchFields = (values) => {
	const { customer_code, name, store_type_id } = values;
	let errors = [];
	if (!customer_code) errors.push({message: "Customer is required"});
	if (!name) errors.push({message: "Branch name is required"});
	if (!store_type_id) errors.push({message: "Store type is required"});
	if (errors.length > 0) return errors;
	else return null;
}

// Add New Branch
router.post("/add", (req, res) => {
	const { branch_code, customer_code, name, store_type_id, address, province } = req.query;
	const validationErrors = checkBranchFields({
		customer_code,
		name,
		store_type_id
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}
	Branch.create({
		branch_code,
		customer_code,
		name,
		store_type_id,
		address,
		province
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Edit Branch
router.put("/:id/edit", (req, res) => {
	const { id } = req.params;
	const { branch_code, name, store_type_id, address, province, customer_code } = req.query;
	const validationErrors = checkBranchFields({
		customer_code,
		name,
		store_type_id
	});
	if (validationErrors) {
		res.status(400).send(validationErrors);
		return;
	}
	Branch.update(
		{
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
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Remove Job from branch
router.delete("/:id/remove-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.query;
	if (!job_code) {
		res.status(400).send([{message: "Job code is required"}]);
	}
	db.query("DELETE FROM branch_job \
    WHERE branch_id = " + id + "AND job_code = '" + job_code + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});

// Add Job to branch if Job doesn't exist for that branch
router.post("/:id/add-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.query;
	if (!job_code) {
		res.status(400).send([{message: "Job code is required"}]);
	}
	Branch.count({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: {
			model: Job,
			where: {
				job_code: {
					[Op.eq]: job_code
				}
			}
		}
	})
		.then(count => {
			if (count == 0) {
				db.query("INSERT INTO branch_job (branch_id, job_code)\
                        VALUES (" + `${id},'${job_code}'` + ")", { type: db.QueryTypes.INSERT })
					.then(rows => res.sendStatus(200))
					.catch(err => res.status(500).send(err.errors));
			} else res.status(400).send([{message: "Job exists for this branch"}]);
		})
		.catch(err => res.status(500).send(err.errors));
});

// Remove PO from branch
router.delete("/:id/remove-po", (req, res) => {
	const { id } = req.params;
	const { po_number } = req.query;
	db.query("DELETE FROM branch_po \
    WHERE branch_id = " + id + "AND po_number = '" + po_number + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err.errors));
});
// Add PO to branch if PO doesn't exist for that branch
router.post("/:id/add-po", (req, res) => {
	const { id } = req.params;
	const { po_number } = req.query;
	Branch.count({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: {
			model: PurchaseOrder,
			where: {
				po_number: {
					[Op.eq]: po_number
				}
			}
		}
	})
		.then(count => {
			if (count == 0) {
				db.query("INSERT INTO branch_po (branch_id, po_number)\
                        VALUES (" + `${id},'${po_number}'` + ")", { type: db.QueryTypes.INSERT })
					.then(rows => res.sendStatus(200))
					.catch(err => res.status(500).send(err.errors));
			} else res.status(400).send([{message: "PO exists for this branch"}]);
		})
		.catch(err => res.status(500).send(err.errors));
});

// Delete branch
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	Branch.destroy({
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
