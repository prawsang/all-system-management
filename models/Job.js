const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");
const Branch = require("./Branch");
const Op = Sequelize.Op;

const Job = db.define("jobs", {
	job_code: {
		type: Sequelize.STRING,
		primaryKey: true,
		validate: {
			notEmpty: true,
			notContains: "/"
		}
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	customer_code: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
});

// Class Methods
Job.checkBranchInJob = (branch_id, job_code) => {
	return Job.count({
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
		.then(count => (count == 0 ? false : true))
		.catch(err => false);
};

// Associations
Job.belongsTo(Customer, {
	foreignKey: "customer_code",
	as: "customer"
});
Customer.hasMany(Job, {
	foreignKey: "customer_code",
	as: "jobs"
});

module.exports = Job;
