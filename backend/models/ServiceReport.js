const Sequelize = require("sequelize");
const db = require("../config/database");
const Location = require("./Location");
const Accessory = require('./Accessory');

const ServiceReport = db.define("service_reports", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	branch_code: {
		type: Sequelize.STRING,
	},
	job_code: {
		type: Sequelize.STRING
	},
	service_type: {
		type: Sequelize.ENUM,
		values: ["INSTALLATION","REPAIR","PM","REPLACE","TRAINING","WARRANTY","CM","OTHER"]
	}
});

ServiceReport.belongsTo(Location, {
    foreignKey: 'branch_code',
    as: 'location',
});
module.exports = ServiceReport;