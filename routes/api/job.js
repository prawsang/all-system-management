const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Job = require("../../models/Job");
const Customer = require("../../models/Customer");
const Branch = require("../../models/Branch");
const StoreType = require("../../models/StoreType");
const BranchJob = require("../../models/junction/BranchJob");
const tools = require("../../utils/tools");
const { check, validationResult } = require("express-validator/check");
const { query } = require("../../utils/query");

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
		.catch(err => res.status(500).json({ errors: err }));
});

// Get branches for job
router.get("/:job_code/branches", async (req, res) => {
	const { job_code } = req.params;
	const { limit, page, search_col, search_term } = req.query;
	const q = await query({
		limit,
		page,
		search_col,
		search_term,
		cols: `${Branch.getColumns}`,
		tables: `"branch_job"
		JOIN "branches" ON "branches"."id" = "branch_job"."branch_id"
		`,
		where: `"branch_job"."job_code" = :job_code`,
		replacements: {
			job_code
		},
		availableCols: [
			"branch_code",
			"branch_name",
			"province",
			"store_type_name",
			"gl_branch",
			"short_code"
		]
	});
	if (q.errors) {
		res.status(500).json(q);
		console.log(q.errors);
	} else {
		res.json(q);
	}
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
	Job.create({
		job_code,
		name,
		customer_code
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Edit Job
router.put("/:job_code/edit", jobValidation, (req, res) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		return res.status(422).json({ errors: validationErrors.array() });
	}

	const { job_code } = req.params;
	const { name } = req.body;
	Job.update(
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
		.catch(err => res.status(500).json({ errors: err }));
});

// Remove Branch from job
router.delete("/:job_code/remove-branch", (req, res) => {
	const { job_code } = req.params;
	const { branch_id } = req.query;
	if (!branch_id) {
		res.status(400).send({ errors: [{ msg: "Branch is required." }] });
		return;
	}
	BranchJob.destroy({
		where: {
			branch_id: {
				[Op.eq]: branch_id
			},
			job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(rows => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: err }));
});

// Add branch to job if branch doesn't exist for that job
router.post("/:job_code/add-branch", async (req, res) => {
	const { job_code } = req.params;
	const { branch_id } = req.body;
	if (!branch_id) {
		res.status(400).send([{ msg: "Branch is required." }]);
		return;
	}
	let errors = [];
	await Promise.all(
		branch_id.map(e =>
			BranchJob.findOrCreate({
				where: {
					job_code,
					branch_id: e
				}
			})
				.then(r => res.sendStatus(200))
				.catch(err =>
					errors.push({ msg: `This branch (${e}) cannot be added to this job.` })
				)
		)
	);
	if (errors.length > 0) {
		res.status(500).json({ errors });
	} else {
		res.sendStatus(200);
	}
});

// Delete job
router.delete("/:job_code", (req, res) => {
	const { job_code } = req.params;
	db.transaction(t =>
		BranchJob.destroy(
			{
				where: {
					job_code: {
						[Op.eq]: job_code
					}
				}
			},
			{
				transaction: t
			}
		)
	)
		.then(r => res.sendStatus(200))
		.catch(err => res.status(500).json({ errors: [{ msg: "This job cannot be deleted" }] }));
});

module.exports = router;
