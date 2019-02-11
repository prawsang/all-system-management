const Sequelize = require("sequelize");
const db = require("../config/database");

const Customer = db.define("customers", {
	customer_code: {
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
	}
});

module.exports = Customer;
