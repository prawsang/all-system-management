const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");
const Job = require("./Job");
const StoreType = require("./StoreType");

const Branch = db.define("branches", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	branch_code: {
		type: Sequelize.STRING
	},
	name: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	address: {
		type: Sequelize.STRING
	},
	province: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	store_type_id: {
		type: Sequelize.INTEGER,
		validate: {
			notNull: true,
			notEmpty: true
		}
	}
});

Branch.belongsTo(Customer, {
	foreignKey: "customer_code",
	as: "customer"
});
Branch.belongsTo(StoreType, {
	foreignKey: "store_type_id",
	as: "store_type"
});
Job.belongsToMany(Branch, {
	through: "branch_job",
	foreignKey: "job_code",
	otherKey: "branch_id"
});
Branch.belongsToMany(Job, {
	through: "branch_job",
	foreignKey: "branch_id",
	otherKey: "job_code"
});
Customer.hasMany(Branch, {
	foreignKey: "customer_code",
	as: "branches"
});

module.exports = Branch;
