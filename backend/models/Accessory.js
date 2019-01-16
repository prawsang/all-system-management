const Sequelize = require("sequelize");
const db = require("../config/database");
const Model = require("./Model");
const ServiceReport = require("./ServiceReport");

const Accessory = db.define(
	"accessories_stock",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		model_no: {
			type: Sequelize.INTEGER
		},
		service_report: {
			type: Sequelize.INTEGER
		},
		status: {
			type: Sequelize.ENUM,
			values: ["IN_STOCK", "BROKEN", "INSTALLED", "IN_SERVICE_STOCK"]
		},
	},
	{
		freezeTableName: "accessories_stock"
	}
);
Accessory.belongsTo(Model, {
	foreignKey: "model_no"
});
module.exports = Accessory;
