const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define("users", {
	staff_code: {
		type: Sequelize.STRING,
		primaryKey: true,
		validate: {
			notEmpty: true,
			notContains: "/"
		}
	},
	name: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	password: {
		type: Sequelize.STRING,
		validate: {
			notNull: true,
			notEmpty: true
		}
	},
	department: {
		type: Sequelize.ENUM,
		values: ["ADMIN"],
		validate: {
			notNull: true,
			notEmpty: true,
			isIn: [["ADMIN"]]
		}
	}
});

// Do not query password
User.prototype.toJSON = function() {
	const values = Object.assign({}, this.get());

	delete values.password;
	return values;
};

module.exports = User;
