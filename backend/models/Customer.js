const Sequelize = require("sequelize");
const db = require("../config/database");

const Customer = db.define('customers', {
    customer_code: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
});

module.exports = Customer;