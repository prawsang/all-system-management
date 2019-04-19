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
			values: ["IN_STOCK", "INSTALLED", "RESERVED", "BORROWED", "TRANSFERRED"],
			allowNull: false,
			validate: {
				notEmpty: true,
				isIn: [["IN_STOCK", "INSTALLED", "RESERVED", "BORROWED", "TRANSFERRED"]]
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
		},
		po_number: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		pr_number: {
			type: Sequelize.STRING
		}
	},
	{
		freezeTableName: "stock"
	}
);
Item.getColumns = `"stock"."serial_no",
    "stock"."model_id",
    "stock"."remarks",
    "stock"."reserve_job_code",
    "stock"."reserve_branch_id",
    "stock"."status",
    "stock"."broken",
    "stock"."stock_location",
    "stock"."po_number",
	"stock"."pr_number"`;

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
Item.filter = data => {
	const { broken, status, type } = data;
	let brokenFilter = broken
		? broken === "true"
			? `"stock"."broken"`
			: `NOT "stock"."broken"`
		: null;
	let typeFilter = type ? `"models"."type" = :type` : null;
	let statusFilter = status ? `"stock"."status" = :status` : null;
	return [brokenFilter, statusFilter, typeFilter].filter(e => e).join(" AND ");
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
