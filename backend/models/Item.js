const Sequelize = require("sequelize");
const db = require("../config/database");
const Model = require("./Model");

const Item = db.define(
	"stock",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		model_id: {
			type: Sequelize.INTEGER
		},
		withdrawal_id: {
			type: Sequelize.INTEGER
		},
		remarks: {
			type: Sequelize.STRING
		},
		install_date: {
			type: Sequelize.DATE
		},
		status: {
			type: Sequelize.ENUM,
			values: ["IN_STOCK", "BROKEN", "INSTALLED", "IN_SERVICE_STOCK"]
		}
	},
	{
		freezeTableName: "stock"
	}
);
Item.belongsTo(Model, {
	foreignKey: "model_id"
});
module.exports = Item;
