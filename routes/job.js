const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../models/Job");
const Customer = require("../models/Customer");
const Branch = require("../models/Branch");
const StoreType = require("../models/StoreType");
const tools = require("../utils/tools");
const { check, validationResult } = require("express-validator/check");

router.get("/get-all", async (req, res) => {
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: {
			model: Customer,
			as: "customer"
		},
		model: Job
	});
	if (query.errors) {
		res.status(500).send(query.errors);
		return;
	}
	res.send(query);
});

router.get("/:job_code/details", (req, res) => {
	const { job_code } = req.params;
	Job.findOne({
		include: {
			model: Customer,
			as: "customer"
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
router.get("/:job_code/branches", async (req, res) => {
	const { job_code } = req.params;
	const { limit, page, search, search_term } = req.query;
	const query = await tools.countAndQuery({
		limit,
		page,
		search,
		search_term,
		include: [
			{
				model: Job,
				as: "jobs",
				where: {
					job_code: {
						[Op.eq]: job_code
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

const jobValidation = [
	check("job_code")
		.not()
		.isEmpty()
		.withMessage("Job code cannot be empty."),
	check("name")
		.not()
		.isEmpty()
		.withMessage("Job name cannot be empty."),
	check("customer_code")
		.not()
		.isEmpty()
		.withMessage("Customer must be provided.")
];

// Add Job
router.post("/add", jobValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { name, job_code, customer_code } = req.body;
	Branch.create({
		job_code,
		name,
		customer_code
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Edit Job
router.put("/:job_code/edit", jobValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { job_code } = req.params;
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
	db.query(
		"DELETE FROM branch_job \
    WHERE branch_id = " +
			branch_id +
			"AND job_code = '" +
			job_code +
			"'",
		{ type: db.QueryTypes.DELETE }
	)
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).send(err));
});

// Add branch to job if branch doesn't exist for that job
router.post("/:job_code/add-branch", (req, res) => {
	const { job_code } = req.params;
	const { branch_id } = req.body;
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
				db.query(
					"INSERT INTO branch_job (branch_id, job_code)\
                        VALUES (" +
						`${branch_id},'${job_code}'` +
						")",
					{ type: db.QueryTypes.INSERT }
				)
					.then(rows => res.sendStatus(200))
					.catch(err => res.status(500).send(err));
			} else res.status(400).send([{ message: "Branch exists for this job" }]);
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
