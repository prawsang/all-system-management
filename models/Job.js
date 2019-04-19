const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");

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
Job.getColumns = `"jobs"."job_code", 
	"jobs"."name" AS "job_name", 
	"jobs"."customer_code"`;

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
