const Sequelize = require("sequelize");
const db = require("../config/database");

const StoreType = db.define("store_types", {
	name: {
		type: Sequelize.STRING
	}
});

module.exports = StoreType;
