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
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	type: {
		type: Sequelize.ENUM,
		values: ["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER", "OTHER"],
		allowNull: false,
		validate: {
			notEmpty: true,
			isIn: [["POS", "PRINTER", "MONITOR", "KEYBOARD", "CASH_DRAWER", "SCANNER", "OTHER"]]
		}
	}
});

Model.getColumns = `"models"."id" AS "model_id",
    "models"."name" AS "model_name",
    "models"."type" AS "model_type"`;

module.exports = Model;
