const Sequelize = require("sequelize");
const db = require("../config/database");
const Branch = require("./Branch");
const Job = require("./Job");
const Op = Sequelize.Op;

const PurchaseOrder = db.define("purchase_orders", {
	po_number: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	job_code: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	date: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	installed: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	}
});

// Class Methods
PurchaseOrder.checkBranchInPo = (branch_id, po_number) => {
	return PurchaseOrder.count({
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		},
		include: {
			model: Branch,
			where: {
				id: {
					[Op.eq]: branch_id
				}
			}
		}
	})
		.then(count => (count == 0 ? false : true))
		.catch(err => false);
};
PurchaseOrder.getColumns = `
	"purchase_orders"."po_number",
	"purchase_orders"."job_code",
	"purchase_orders"."description",
	"purchase_orders"."date" AS "po_date",
	"purchase_orders"."installed"
	`;

PurchaseOrder.checkJob = (job_code, po_number) => {
	return PurchaseOrder.findOne({
		where: {
			po_number: {
				[Op.eq]: po_number
			}
		}
	})
		.then(r => (r.job_code == job_code ? true : false))
		.catch(err => false);
};

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
