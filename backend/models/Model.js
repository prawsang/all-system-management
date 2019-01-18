const Sequelize = require("sequelize");
const db = require("../config/database");

const Model = db.define("models", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING
	},
	type: {
		type: Sequelize.ENUM,
		values: ["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER"]
	}
});

module.exports = Model;
