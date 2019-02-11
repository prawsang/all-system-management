const Sequelize = require("sequelize");
const db = require("../config/database");

const Model = db.define("models", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	type: {
		type: Sequelize.ENUM,
		values: ["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER"],
		validate: {
			notNull: true,
			notEmpty: true,
			isIn: [["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER"]]
		}
	}
});

module.exports = Model;
