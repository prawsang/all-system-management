const Sequelize = require("sequelize");
const db = require("../config/database");
const Customer = require("./Customer");
const Location = require("./Location");

const Job = db.define('jobs', {
    job_code: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    job_name: {
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