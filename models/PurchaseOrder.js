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
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	description: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	date: {
		type: Sequelize.DATE,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	installed: {
		type: Sequelize.BOOLEAN,
		validate: {
			notNull: true
		}
	}
});

// Associations
PurchaseOrder.belongsTo(Job, {
	foreignKey: "job_code",
	as: "job"
});
PurchaseOrder.belongsToMany(Branch, {
	through: "branch_po",
	foreignKey: "po_number",
	otherKey: "branch_id"
});
Branch.belongsToMany(PurchaseOrder, {
	through: "branch_po",
	foreignKey: "branch_id",
	otherKey: "po_number"
});

module.exports = PurchaseOrder;
