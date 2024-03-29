const Sequelize = require("sequelize");
const db = require("../config/database");
const PO = require("./PurchaseOrder");
const Job = require("./Job");
const Branch = require("./Branch");
const Item = require("./Item");
const Op = Sequelize.Op;

const Withdrawal = db.define("withdrawals", {
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
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	po_number: {
		type: Sequelize.STRING
	},
	do_number: {
		type: Sequelize.STRING
	},
	staff_name: {
		type: Sequelize.STRING,
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
	billed: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	}
});
Withdrawal.getColumns = `"withdrawals"."id" AS "withdrawal_id",
    "withdrawals"."branch_id",
    "withdrawals"."job_code",
    "withdrawals"."po_number",
    "withdrawals"."do_number",
    "withdrawals"."staff_name",
    "withdrawals"."type" AS "withdrawal_type",
    "withdrawals"."date" AS "withdrawal_date",
    "withdrawals"."install_date",
    "withdrawals"."return_by",
    "withdrawals"."status" AS "withdrawal_status",
    "withdrawals"."remarks" AS "withdrawal_remarks",
    "withdrawals"."billed"`;

// Class Methods
Withdrawal.validate = data => {
	const { type, return_by, install_date, do_number, po_number } = data;
	let errors = [];
	if (type == "BORROW" && (!return_by || return_by == "")) {
		errors.push({ msg: "Return date is required for borrowing." });
	}
	if (type == "INSTALLATION" && (!install_date || install_date == "")) {
		errors.push({ msg: "Installation date is required for installation." });
	}
	if (type !== "INSTALLATION" && (po_number && po_number !== "")) {
		errors.push({ msg: "Withdrawals of types other than installation cannot have PO." });
	}
	if (type !== "INSTALLATION" && (do_number && do_number !== "")) {
		errors.push({ msg: "Withdrawals of types other than installation cannot have DO." });
	}
	return { errors };
};
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
		.catch(err => ({ errors: [err] }));
};

Withdrawal.filter = data => {
	const {
		from,
		to,
		install_from,
		install_to,
		return_from,
		return_to,
		billed,
		type,
		status
	} = data;

	let dateFilter = null;
	let returnDateFilter = null;
	let installDateFilter = null;
	let billedFilter = null;
	let statusFilter = null;
	let typeFilter = null;

	if (from || to) {
		const f = from ? `"withdrawals"."date" >= :from` : null;
		const t = to ? `"withdrawals"."date" <= :to` : null;
		dateFilter = [f, t].filter(e => e).join(" AND ");
	}
	if (install_from || install_to) {
		const f = install_from ? `"withdrawals"."install_date" >= :install_from` : null;
		const t = install_to ? `"withdrawals"."install_date" <= :install_to` : null;
		installDateFilter = [f, t].filter(e => e).join(" AND ");
	}
	if (return_from || return_to) {
		const f = return_from ? `"withdrawals"."return_by" >= :return_from` : null;
		const t = return_to ? `"withdrawals"."return_by" <= :return_to` : null;
		returnDateFilter = [f, t].filter(e => e).join(" AND ");
	}
	if (billed) {
		billedFilter = billed == "true" ? `"withdrawals"."billed"` : `NOT "withdrawals"."billed"`;
	}
	if (type) {
		typeFilter = `"withdrawals"."type" = :type`;
	}
	if (status) {
		statusFilter = `"withdrawals"."status" = :status`;
	}

	return [dateFilter, returnDateFilter, installDateFilter, billedFilter, typeFilter, statusFilter]
		.filter(e => e)
		.join(" AND ");
};

// Associations
Withdrawal.belongsTo(PO, {
	foreignKey: "po_number",
	as: "po"
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
