const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Branch = require("../models/Branch");
const StoreType = require("../models/StoreType");

router.get("/get-all", async (req, res) => {
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Job.findAndCountAll()
		.then(c => (count = c.count))
		.catch(err => res.status(500).send(err));
	if (count == 0) {
		res.send({
			jobs: [],
			count: 0,
			pagesCount: 0
		});
		return
	}
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);
	
	Job.findAll({
		offset,
		limit,
		include: {
			model: Customer,
			as: "customer"
		}
	})
		.then(jobs => res.send({
			jobs,
			count,
			pagesCount
		}))
		.catch(err => res.status(500).send(err));
});

router.get("/single/:job_code", (req, res) => {
	const { job_code } = req.params;
	Job.findOne({
		include: {
			model: Customer,
			as: 'customer'
		},
		where: {
			job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(job => res.send({ job }))
		.catch(err => res.status(500).send(err));
});

// Get branches for job
router.get("/branches/:job_code", async (req,res) => {
	const { job_code } = req.params;
	let { limit, page } = req.query;
	if (!limit) limit = 25;
	if (!page) page = 1;

	let offset = 0;
	let count = 0;
	await Branch.findAndCountAll({
		include: {
			model: Job,
			as: 'jobs',
			where: {
				job_code: {
					[Op.eq]: job_code
				}
			}
		}
	})
		.then(c => (count = c.count))
		.catch(err => res.status(500).send(err));
	if (count == 0) {
		res.send({
			jobs: [],
			count: 0,
			pagesCount: 0
		});
		return
	}
	const pagesCount = Math.ceil(count / limit);
	offset = limit * (page - 1);

	Branch.findAll({
		offset,
		limit,
		include: [{
			model: Job,
			as: 'jobs',
			where: {
				job_code: {
					[Op.eq]: job_code
				}
			}
		},{
			model: StoreType,
			as: 'store_type'
		}]
	})
		.then(branches => res.send({
			branches,
			count,
			pagesCount
		}))
		.catch(err => res.status(500).send(err));
})

// Add Job
router.post("/add", (req, res) => {
	const { name, job_code, customer_code } = req.query;
	if (!job_code) {
		res.status(400).send([{message: "Job Code is required."}]);
		return;
	}
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	if (!customer_code) {
		res.status(400).send([{message: "Customer Code is required."}]);
		return;
	}
	Branch.create(
		{
			job_code,
			name,
			customer_code
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Edit Job
router.put("/:job_code/edit", (req, res) => {
	const { job_code } = req.params;
	const { name } = req.query;
	if (!name) {
		res.status(400).send([{message: "Name is required."}]);
		return;
	}
	Branch.update(
		{
			name
		},
		{
			where: {
				job_code: {
					[Op.eq]: job_code
				}
			}
		}
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Remove Branch from job
router.delete("/:job_code/remove-branch", (req, res) => {
	const { job_code } = req.params;
	const { branch_id } = req.query;
	db.query("DELETE FROM branch_job \
    WHERE branch_id = " + branch_id + "AND job_code = '" + job_code + "'", { type: db.QueryTypes.DELETE })
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Add branch to job if branch doesn't exist for that job
router.post("/:job_code/add-branch", (req, res) => {
	const { job_code } = req.params;
	const { branch_id } = req.query;
	Job.count({
		where: {
			job_code: {
				[Op.eq]: job_code
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
				db.query("INSERT INTO branch_job (branch_id, job_code)\
                        VALUES (" + `${branch_id},'${job_code}'` + ")", { type: db.QueryTypes.INSERT })
					.then(rows => res.sendStatus(200))
					.catch(err => res.status(500).send(err));
			} else res.status(400).send([{message: "Branch exists for this job"}]);
		})
		.catch(err => res.status(500).send(err));
});

// Delete job
router.delete("/:job_code", (req, res) => {
	const { job_code } = req.params;
	Branch.destroy({
		where: {
			job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

module.exports = router;
