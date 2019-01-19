const Sequelize = require("sequelize");
const db = require("../config/database");

const StoreType = db.define("store_types", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING
	}
});

module.exports = StoreType;
