const Sequelize = require("sequelize");
const db = require("../../config/database");
const Job = require("../Job");
const Branch = require("../Branch");

const BranchJob = db.define(
	"branch_job",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		branch_id: {
			type: Sequelize.STRING,
			allowNull: false
		},
		job_code: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	},
	{
		freezeTableName: "branch_job"
	}
);

BranchJob.belongsTo(Branch, {
	foreignKey: "branch_id",
	otherKey: "id",
	as: "branch"
});
BranchJob.belongsTo(Job, {
	foreignKey: "job_code",
	as: "job"
});

module.exports = BranchJob;
