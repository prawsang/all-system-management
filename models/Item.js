const Sequelize = require("sequelize");
const db = require("../config/database");
const Model = require("./Model");
const Job = require("./Job");
const Branch = require("./Branch");

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
			validate: {
				notNull: true,
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
			validate: {
				notNull: true,
				notEmpty: true,
				isIn: [["IN_STOCK", "INSTALLED", "RESERVED", "BORROWED", "IN_SERVICE_STOCK"]]
			}
		},
		broken: {
			type: Sequelize.BOOLEAN,
			validator: {
				notNull: true
			}
		}
	},
	{
		freezeTableName: "stock",
		validate: {
			reserveInfoRequiredForReservedItems() {
				if (
					this.status == "RESERVED" &&
					(!this.reserve_job_code || this.reserve_job_code != "")
				) {
					throw new Error("Job code must be provided for reserved items.");
				}
			}
		}
	}
);

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
