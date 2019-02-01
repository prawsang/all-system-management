const Sequelize = require("sequelize");
const db = require("../config/database");
const Branch = require("./Branch");
const Job = require("./Job");

const PurchaseOrder = db.define("purchase_orders", {
	po_number: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	job_code: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	date: {
		type: Sequelize.DATE
	},
	installed: {
		type: Sequelize.BOOLEAN
	}
});

PurchaseOrder.belongsTo(Job, {
	foreignKey: "job_code",
	as: "job"
});
PurchaseOrder.belongsToMany(Branch,{
	through: 'branch_po',
	foreignKey: 'po_number',
	otherKey: 'branch_id'
});
Branch.belongsToMany(PurchaseOrder,{
	through: 'branch_po',
	foreignKey: 'branch_id',
	otherKey: 'po_number'
});

module.exports = PurchaseOrder;
