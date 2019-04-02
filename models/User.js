const Sequelize = require("sequelize");
const db = require("../config/database");
const bcrypt = require("bcrypt");

const User = db.define("users", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	department: {
		type: Sequelize.ENUM,
		values: ["ADMIN", "STOCK", "ACCOUNTANT", "SERVICE", "SYSTEM"],
		allowNull: false,
		validate: {
			notEmpty: true,
			isIn: [["ADMIN", "STOCK", "ACCOUNTANT", "SERVICE", "SYSTEM"]]
		}
	}
});

User.prototype.validatePassword = function() {
	bcrypt.hash(password, 12).then(hashedPassword => {
		return hashedPassword === this.password;
	});
};

// Do not query password
User.prototype.toJSON = function() {
	const values = Object.assign({}, this.get());

	delete values.password;
	return values;
};

module.exports = User;
