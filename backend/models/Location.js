const Sequelize = require("sequelize");
const db = require("../config/database");

const Location = db.define('locations', {
	branch_code: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	branch_name: {
		type: Sequelize.STRING
	},
});

module.exports = Location;