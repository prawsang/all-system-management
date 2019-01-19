const Sequelize = require("sequelize");
const db = require("../config/database");

const Model = db.define("models", {
	name: {
		type: Sequelize.STRING
	},
	type: {
		type: Sequelize.ENUM,
		values: ["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER"]
	}
});

module.exports = Model;
