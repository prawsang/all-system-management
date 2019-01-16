const Sequelize = require("sequelize");
const db = require('../config/database');

const User = db.define('users',{
    staff_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    department: {
        type: Sequelize.STRING
    }
});

module.exports = User;
