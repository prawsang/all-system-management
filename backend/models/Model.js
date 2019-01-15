const Sequelize = require("sequelize");
const db = require("../config/database");

const Model = db.define("models", {
	model_no: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	model_name: {
		type: Sequelize.STRING
	},
	type: {
		type: Sequelize.ENUM,
		values: ["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER"]
	}
});

module.exports = Model;
