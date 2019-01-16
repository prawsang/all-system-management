const Sequelize = require("sequelize");
const db = require("../config/database");
const Job = require("./Job");
const ServiceReport = require("./ServiceReport");

const Location = db.define('locations', {
	branch_code: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	branch_name: {
		type: Sequelize.STRING
	},
	address: {
		type: Sequelize.STRING
	},
	province: {
		type: Sequelize.STRING
	},
	job_code: {
		type: Sequelize.STRING
	},
	store_type: {
		type: Sequelize.INTEGER
	}
});

Location.belongsTo(Job,{
    foreignKey: 'job_code',
    as: 'job'
});
Job.hasMany(Location, {
    foreignKey: 'job_code',
    as: 'locations'
})

module.exports = Location;