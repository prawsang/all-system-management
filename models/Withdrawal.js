const Sequelize = require("sequelize");
const db = require("../config/database");
const PO = require("./PurchaseOrder");
const User = require("./User");
const Job = require("./Job");
const Branch = require("./Branch");
const Item = require("./Item");

const Withdrawal = db.define(
	"withdrawals",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		branch_id: {
			type: Sequelize.INTEGER,
			validate: {
				notNull: true,
				notEmpty: true
			}
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
			type: Sequelize.STRING,
			validate: {
				notNull: true,
				notEmpty: true
			}
		},
		type: {
			type: Sequelize.ENUM,
			values: ["INSTALLATION", "BORROW", "TRANSFER"],
			validate: {
				notNull: true,
				notEmpty: true,
				isIn: [["INSTALLATION", "BORROW", "TRANSFER"]]
			}
		},
		date: {
			type: Sequelize.DATE,
			validate: {
				notNull: true,
				notEmpty: true
			}
		},
		install_date: {
			type: Sequelize.DATE
		},
		status: {
			type: Sequelize.ENUM,
			values: ["PENDING", "PRINTED", "CANCELLED"],
			validate: {
				notNull: true,
				notEmpty: true,
				isIn: [["PENDING", "PRINTED", "CANCELLED"]]
			}
		},
		remarks: {
			type: Sequelize.STRING
		},
		return_by: {
			type: Sequelize.DATE
		},
		has_po: {
			type: Sequelize.BOOLEAN,
			validate: {
				notNull: true
			}
		}
	},
	{
		validate: [
			{
				borrowMustHaveReturnDate() {
					if (this.type == "BORROW" && (!this.return_by || this.return_by == "")) {
						throw new Error("Return date is required for borrowing.");
					}
				},
				installationMustHaveInstallDate() {
					if (
						this.type == "INSTALLATION" &&
						(!this.install_date || this.install_date == "")
					) {
						throw new Error("Installation date is required for installation.");
					}
				},
				installationMustHavePO() {
					if (this.type == "INSTALLATION" && !this.has_po) {
						throw new Error("Installation must have PO.");
					}
				},
				typesOtherThanInstallationCannotHavePOorDO() {
					if (this.type != "INSTALLATION" && this.has_po) {
						throw new Error(
							"Withdrawals of types other than installation cannot have PO."
						);
					}
					if (this.type != "INSTALLATION" && (this.do_number || this.do_number != "")) {
						throw new Error(
							"Withdrawals of types other than installation cannot have DO."
						);
					}
				},
				eitherJobCodeOrPONumber() {
					if (
						((this.job_code || this.job_code != "") &&
							(this.po_number || this.po_number != "")) ||
						((!this.job_code || this.job_code == "") &&
							(!this.po_number || this.po_number == ""))
					) {
						throw new Error("Specify either job code or PO number, but not both.");
					}
				}
			}
		]
	}
);

// Associations
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
Branch.hasMany(Withdrawal, {
	foreignKey: "branch_id",
	as: "withdrawals"
});

Withdrawal.belongsToMany(Item, {
	through: "item_withdrawal",
	foreignKey: "withdrawal_id",
	otherKey: "serial_no",
	as: "items"
});
Item.belongsToMany(Withdrawal, {
	through: "item_withdrawal",
	foreignKey: "serial_no",
	otherKey: "withdrawal_id",
	as: "withdrawals"
});

module.exports = Withdrawal;
