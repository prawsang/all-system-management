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
		primaryKey: true,
		autoIncrement: true
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
	date: {
		type: Sequelize.DATE
	},
	install_date: {
		type: Sequelize.DATE
	},
	status: {
		type: Sequelize.ENUM,
		values: ["PENDING","PRINTED","CANCELLED"]
	},
	remarks: {
		type: Sequelize.STRING
	},
	return_by: {
		type: Sequelize.DATE
	},
	has_po: {
		type: Sequelize.BOOLEAN
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

Withdrawal.belongsToMany(Item,{
	through: 'item_withdrawal',
	foreignKey: 'withdrawal_id',
	otherKey: 'serial_no',
	as: 'items'
});
Item.belongsToMany(Withdrawal,{
	through: 'item_withdrawal',
	foreignKey: 'serial_no',
	otherKey: 'withdrawal_id',
	as: 'withdrawals'
});

module.exports = Withdrawal;
