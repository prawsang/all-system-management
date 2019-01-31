const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const Job = require("../models/Job");
const PurchaseOrder = require("../models/PurchaseOrder");
const Withdrawal = require("../models/Withdrawal");
const Customer = require("../models/Customer");
const StoreType = require("../models/StoreType");
const Sequelize = require("sequelize");
const db = require("../config/database");
const Op = Sequelize.Op;
const tools = require("../utils/tools");

router.get("/get-all", async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		include: {
			model: StoreType,
			as: "store_type"
		},
		search,
		search_term,
		model: Branch
	})
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.get("/:id/details", (req, res) => {
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
				model: Customer,
				as: 'customer'
			},
			{
				model: StoreType,
				as: "store_type"
			}
		]
	})
		.then(branch => res.send({ branch }))
		.catch(err => res.status(500).send(err));
});

// List of items in a branch
router.get("/:id/items/", async (req, res) => {
	const { id } = req.params;
	const { limit, page, search, search_term } = req.query;

	const queryString = `FROM stock, models, withdrawals, branches, item_withdrawal\
		WHERE withdrawals.branch_id = ${id}\
		AND branches.id = ${id}\
		AND item_withdrawal.withdrawal_id = withdrawals.id\
		AND item_withdrawal.serial_no = stock.serial_no\
		AND stock.model_id = models.id`;
	
	const query = await tools.countAndQueryWithString({
		select: "SELECT stock.serial_no, models.type, models.name, install_date",
		from_where: queryString,
		search,
		search_table: 'stock',
		search_term,
		limit,
		page
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
})

// List of branches with po but po has installed = false
router.get("/no-install", async (req, res) => {
	let { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQuery({
		limit,
		page,
		include: [{
			model: PurchaseOrder,
			as: "purchase_orders",
			where: {
				installed: {
					[Op.eq]: false
				}
			}
		},{
			model: Customer,
			as: "customer"
		}],
		search,
		search_term,
		model: Branch
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

// List of po_number of a branch
router.get("/:id/po", async (req, res) => {
	const { id } = req.params;
	let { limit, page, search, search_term } = req.query;

	const query = await tools.countAndQueryWithString({
		limit,
		page,
		search,
		search_table: 'purchase_orders',
		search_term,
		select: "SELECT branch_po.po_number, description, date",
		from_where: `FROM branch_po, purchase_orders
			WHERE branch_po.branch_id = ${id}
			AND branch_po.po_number = purchase_orders.po_number`
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

checkBranchFields = values => {
	const { customer_code, name, store_type_id } = values;
	let errors = [];
	if (!customer_code) errors.push({ message: "Customer is required" });
	if (!name) errors.push({ message: "Branch name is required" });
	if (!store_type_id) errors.push({ message: "Store type is required" });
	if (errors.length > 0) return errors;
	else return null;
};

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
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

// Remove Job from branch
router.delete("/:id/remove-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.query;
	if (!job_code) {
		res.status(400).send([{ message: "Job code is required" }]);
	}
	db.query("DELETE FROM branch_job \
    WHERE branch_id = " + id + "AND job_code = '" + job_code + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Add Job to branch if Job doesn't exist for that branch
router.post("/:id/add-job", (req, res) => {
	const { id } = req.params;
	const { job_code } = req.query;
	if (!job_code) {
		res.status(400).send([{ message: "Job code is required" }]);
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
					.catch(err => res.status(500).send(err));
			} else res.status(400).send([{ message: "Job exists for this branch" }]);
		})
		.catch(err => res.status(500).send(err));
});

// Remove PO from branch
router.delete("/:id/remove-po", (req, res) => {
	const { id } = req.params;
	const { po_number } = req.query;
	db.query("DELETE FROM branch_po \
    WHERE branch_id = " + id + "AND po_number = '" + po_number + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
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
					.catch(err => res.status(500).send(err));
			} else res.status(400).send([{ message: "PO exists for this branch" }]);
		})
		.catch(err => res.status(500).send(err));
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
		.catch(err => res.status(500).send(err));
});

module.exports = router;
