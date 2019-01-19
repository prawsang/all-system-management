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
		.catch(err => res.status(500).send(err))
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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

// List of po_number of a branch
router.get("/:id/get-po-number", (req, res) => {
	const { id } = req.params;
	db.query("SELECT po_number\
		FROM branch_po\
		WHERE branch_po.branch_id = " + id, { type: db.QueryTypes.SELECT })
		.then(po => res.send(po))
		.catch(err => res.status(500).send(err));
});

// Add New Branch
router.post("/add", (req, res) => {
	const { branch_code, customer_code, name, store_type_id, address, province } = req.query;
	Branch.create({
		branch_code,
		customer_code,
		name,
		store_type_id,
		address,
		province
	})
		.then(rows => res.send(rows))
		.catch(err => res.status(400).send(err));
});

// Edit Branch
router.put("/:id/edit", (req, res) => {
	const { id } = req.params;
	const { branch_code, name, store_type_id, address, province } = req.query;
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
		.then(rows => res.send(rows))
		.catch(err => res.status(400).send(err));
});

// Remove Job from branch
router.delete("/:id/remove-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.query;
	db.query("DELETE FROM branch_job \
    WHERE branch_id = " + id + "AND job_code = '" + job_code + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.send(rows))
		.catch(err => res.status(400).send(err));
});

// Add Job to branch if Job doesn't exist for that branch
router.post("/:id/add-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.query;
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
					.then(rows => res.send(rows))
					.catch(err => res.status(500).send(err));
			} else res.send("Job exists for this branch");
		})
		.catch(err => res.status(400).send(err));
});

// Remove PO from branch
router.delete("/:id/remove-po", (req, res) => {
	const { id } = req.params;
	const { po_number } = req.query;
	db.query("DELETE FROM branch_po \
    WHERE branch_id = " + id + "AND po_number = '" + po_number + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.send(rows))
		.catch(err => res.status(400).send(err));
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
					.then(rows => res.send(rows))
					.catch(err => res.status(500).send(err));
			} else res.send("PO exists for this branch");
		})
		.catch(err => res.status(400).send(err));
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
		.then(rows => res.send({ rows }))
		.catch(err => res.status(400).send(err));
});

module.exports = router;
