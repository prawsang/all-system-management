const Sequelize = require("sequelize");
const db = require("../../config/database");
const Item = require("../item");
const Withdrawal = require("../Withdrawal");

const ItemWithdrawal = db.define(
	"item_withdrawal",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		serial_no: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		withdrawal_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		}
	},
	{
		freezeTableName: "item_withdrawal"
	}
);

ItemWithdrawal.belongsTo(Item, {
	foreignKey: "serial_no",
	as: "item"
});
ItemWithdrawal.belongsTo(Withdrawal, {
	foreignKey: "id",
	as: "withdrawal"
});

module.exports = ItemWithdrawal;
