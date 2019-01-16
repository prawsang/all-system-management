const Sequelize = require("sequelize");
const db = require("../config/database");

const Customer = db.define('customers', {
    customer_code: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    customer_name: {
        type: Sequelize.STRING
    },
});

module.exports = Customer;