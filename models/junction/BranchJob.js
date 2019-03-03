const Sequelize = require("sequelize");
const db = require("../../config/database");
const Job = require("../Job");
const Branch = require("../Branch");
const Op = Sequelize.Op;

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

BranchJob.checkBranchInJob = (branch_id, job_code) => {
	return BranchJob.count({
		where: {
			branch_id: {
				[Op.eq]: branch_id
			},
			job_code: {
				[Op.eq]: job_code
			}
		}
	})
		.then(count => (count === 0 ? false : true))
		.catch(err => false);
};

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
