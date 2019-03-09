const Sequelize = require("sequelize");
const db = require("../config/database");
const Model = require("./Model");
const Job = require("./Job");
const Branch = require("./Branch");
const Op = Sequelize.Op;

const Item = db.define(
	"stock",
	{
		serial_no: {
			type: Sequelize.STRING,
			primaryKey: true,
			validate: {
				notEmpty: true,
				notContains: "/"
			}
		},
		model_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		remarks: {
			type: Sequelize.STRING
		},
		reserve_job_code: {
			type: Sequelize.STRING
		},
		reserve_branch_id: {
			type: Sequelize.INTEGER
		},
		status: {
			type: Sequelize.ENUM,
			values: ["IN_STOCK", "INSTALLED", "RESERVED", "BORROWED", "IN_SERVICE_STOCK"],
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [["IN_STOCK", "INSTALLED", "RESERVED", "BORROWED", "IN_SERVICE_STOCK"]]
			}
		},
		broken: {
			type: Sequelize.BOOLEAN,
			allowNull: false
		},
		stock_location: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	},
	{
		freezeTableName: "stock"
	}
);

// Class Methods
Item.changeStatus = async params => {
	const { serial_no, validStatus, toStatus, otherInfo } = params;
	let updatedSerials = [];
	let errors = [];
	if (serial_no.length == 0)
		return { updatedSerials, errors: [{ msg: "Serial No. cannot be empty." }] };

	await Promise.all(
		serial_no.map(async no => {
			let valid = true;
			if (validStatus) {
				valid = await Item.checkStatus(no, validStatus);
			}
			if (valid) {
				await Item.update(
					{
						status: toStatus,
						...otherInfo
					},
					{
						where: {
							serial_no: {
								[Op.eq]: no
							}
						}
					}
				)
					.then(res => updatedSerials.push(no))
					.catch(err => errors.push(err));
			} else {
				errors.push({ msg: `The ${no} item is not ${validStatus[0]}` });
			}
		})
	);
	return {
		updatedSerials,
		errors
	};
};

Item.checkStatus = (serial_no, status) => {
	if (typeof status == "string") status = [status];
	return Item.findOne({
		where: {
			serial_no: {
				[Op.eq]: serial_no
			}
		}
	})
		.then(item => {
			if (item) {
				if (status.indexOf(item.status) >= 0) return true;
			}
		})
		.catch(err => false);
};

// Associations
Item.belongsTo(Model, {
	foreignKey: "model_id"
});
Item.belongsTo(Job, {
	foreignKey: "reserve_job_code",
	as: "reserve_job"
});
Item.belongsTo(Branch, {
	foreignKey: "reserve_branch_id",
	as: "reserve_branch"
});

module.exports = Item;
