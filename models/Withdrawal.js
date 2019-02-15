const Sequelize = require("sequelize");
const db = require("../config/database");
const PO = require("./PurchaseOrder");
const User = require("./User");
const Job = require("./Job");
const Branch = require("./Branch");
const Item = require("./Item");
const Op = Sequelize.Op;
const returnItems = require("../routes/stock_status").returnItems;

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
			allowNull: false,
			validate: {
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
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		type: {
			type: Sequelize.ENUM,
			values: ["INSTALLATION", "BORROW", "TRANSFER"],
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [["INSTALLATION", "BORROW", "TRANSFER"]]
			}
		},
		date: {
			type: Sequelize.DATE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		install_date: {
			type: Sequelize.DATE
		},
		status: {
			type: Sequelize.ENUM,
			values: ["PENDING", "PRINTED", "CANCELLED"],
			allowNull: false,
			validate: {
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
			allowNull: false
		}
	},
	{
		validate: {
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
					throw new Error("Withdrawals of types other than installation cannot have PO.");
				}
				if (this.type != "INSTALLATION" && (this.do_number || this.do_number != "")) {
					throw new Error("Withdrawals of types other than installation cannot have DO.");
				}
			},
			eitherJobCodeOrPONumber() {
				if (this.job_code && this.po_number) {
					throw new Error("Specify either job code or PO number, but not both.");
				} else if (!this.job_code && !this.po_number) {
					throw new Error("Either job code or PO number must be provided.");
				}
			}
		}
	}
);

// Class Methods
Withdrawal.getType = withdrawal_id => {
	return Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: withdrawal_id
			}
		}
	})
		.then(withdrawal => withdrawal.type)
		.catch(err => ({ errors: err }));
};
Withdrawal.checkStatus = (id, status) => {
	return Withdrawal.findOne({
		where: {
			id: {
				[Op.eq]: id
			}
		}
	})
		.then(withdrawal => {
			if (withdrawal.status !== status) {
				return false;
			} else return true;
		})
		.catch(err => false);
};
Withdrawal.removeAllItemsAndDelete = id => {
	let errors = [];
	db.transaction(t => {
		let serials = [];
		return db
			.query(
				`
				SELECT stock.serial_no
				FROM item_withdrawal, stock, withdrawals
				WHERE item_withdrawal.withdrawal_id = 19
				AND stock.serial_no = item_withdrawal.serial_no
				AND withdrawals.id = item_withdrawal.withdrawal_id
		`,
				{
					type: db.QueryTypes.SELECT,
					transaction: t
				}
			)
			.then(rows => {
				rows.map(row => serials.push(row.serial_no));
				return db
					.query(`DELETE FROM item_withdrawal WHERE withdrawal_id = '${id}'`, {
						type: db.QueryTypes.DELETE,
						transaction: t
					})
					.then(res => returnItems(serials));
			})
			.catch(err => console.log(err));
	})
		.then(res =>
			// destroy the withdrawal if all the items are returned
			Withdrawal.destroy({
				where: {
					id: {
						[Op.eq]: id
					}
				}
			})
				.then(rows => null)
				.catch(err => errors.push(err))
		)
		.catch(err => errors.push(err));
	return { errors };
};
Withdrawal.checkItem = (id, serial_no) => {
	return Withdrawal.count({
		where: {
			id: {
				[Op.eq]: id
			}
		},
		include: {
			model: Item,
			as: "items",
			where: {
				serial_no: {
					[Op.eq]: serial_no
				}
			}
		}
	})
		.then(count => (count > 0 ? true : false))
		.catch(err => false);
};
Withdrawal.changeStatus = (id, status) => {
	return Withdrawal.update(
		{
			status
		},
		{
			where: {
				id: {
					[Op.eq]: id
				}
			}
		}
	)
		.then(rows => ({ errors: [] }))
		.catch(err => ({ errors: err }));
};

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
