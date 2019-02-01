const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define("users", {
	staff_code: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	},
	department: {
		type: Sequelize.STRING
	}
});

// Do not query password
User.prototype.toJSON = function() {
	const values = Object.assign({}, this.get());

	delete values.password;
	return values;
};

module.exports = User;
