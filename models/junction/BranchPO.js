const Sequelize = require("sequelize");
const db = require("../../config/database");
const PO = require("../PurchaseOrder");
const Branch = require("../Branch");

const BranchPO = db.define(
	"branch_po",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		branch_id: {
			type: Sequelize.STRING,
			allowNull: false
		},
		po_number: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	},
	{
		freezeTableName: "branch_po"
	}
);

BranchPO.belongsTo(Branch, {
	foreignKey: "id",
	as: "branch"
});
BranchPO.belongsTo(PO, {
	foreignKey: "po_number",
	as: "po"
});

module.exports = BranchPO;
