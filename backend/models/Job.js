const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");
const Branch = require("./Branch");

const Job = db.define('jobs', {
    job_code: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    customer_code: {
        type: Sequelize.STRING
    }
});

Job.belongsTo(Customer, {
    foreignKey: 'customer_code',
    as: 'customer'
});
Customer.hasMany(Job, {
    foreignKey: 'customer_code',
    as: 'jobs'
})

module.exports = Job;