const Sequelize = require("sequelize");
const db = require("../config/database");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

User.prototype.validatePassword = function(password) {
	const hash = crypto
		.createHmac("sha256", "0FA125A668")
		.update(password)
		.digest("hex");
	return this.password === hash;
};
User.prototype.generateJWT = function() {
	const today = new Date();
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 60);

	return jwt.sign(
		{
			username: this.username,
			_id: this.id,
			exp: parseInt(expirationDate.getTime() / 1000, 10)
		},
		"secret"
	);
};

User.prototype.toAuthJSON = function() {
	return {
		_id: this.id,
		username: this.username,
		token: this.generateJWT()
	};
};

// Do not query password
User.prototype.toJSON = function() {
	const values = Object.assign({}, this.get());

	delete values.password;
	return values;
};

module.exports = User;
