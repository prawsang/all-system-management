const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");
const Branch = require("./Branch");

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
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	customer_code: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	}
});

Job.belongsTo(Customer, {
	foreignKey: "customer_code",
	as: "customer"
});
Customer.hasMany(Job, {
	foreignKey: "customer_code",
	as: "jobs"
});

module.exports = Job;
