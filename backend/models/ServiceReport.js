const Sequelize = require("sequelize");
const db = require("../config/database");
const Location = require("./Location");
const User = require('./User');
const Accessory = require('./Accessory');

const ServiceReport = db.define("service_reports", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	branch_code: {
		type: Sequelize.STRING,
	},
	staff_id: {
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
Location.hasMany(ServiceReport, {
    foreignKey: 'branch_code',
    as: 'service_reports'
})

ServiceReport.belongsTo(User, {
	foreignKey: 'staff_id',
	as: 'user'
});
ServiceReport.hasMany(Accessory, {
	foreignKey: 'service_report',
	as: 'accessories'
})

module.exports = ServiceReport;