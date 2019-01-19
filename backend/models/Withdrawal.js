const Sequelize = require("sequelize");
const db = require("../config/database");
const PO = require("./PurchaseOrder");
const User = require("./User");
const Job = require("./Job");
const Branch = require("./Branch");
const Item = require("./Item");

const Withdrawal = db.define("withdrawals", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	branch_id: {
		type: Sequelize.INTEGER
	},
	job_code: {
		type: Sequelize.STRING
	},
	po_number: {
		type: Sequelize.STRING
	},
	do_number: {
		type: Sequelize.STRING
	},
	staff_code: {
		type: Sequelize.STRING
	},
	type: {
		type: Sequelize.ENUM,
		values: ["INSTALLATION","BORROW","TRANSFER"]
	},
	print_date: {
		type: Sequelize.DATE
	},
	return_by: {
		type: Sequelize.DATE
	}
});

Withdrawal.belongsTo(PO, {
	foreignKey: "po_number",
	as: "po"
});
Withdrawal.belongsTo(User, {
	foreignKey: "staff_code",
	as: "user"
});
Withdrawal.belongsTo(Job, {
	foreignKey: "job_code",
	as: "job"
});
Withdrawal.belongsTo(Branch, {
	foreignKey: "branch_id",
	as: "branch"
});
Withdrawal.hasMany(Item, {
	foreignKey: "withdrawal_id",
	as: "items"
});
Item.belongsTo(Withdrawal, {
	foreignKey: "withdrawal_id",
	as: "withdrawal"
});

module.exports = Withdrawal;
