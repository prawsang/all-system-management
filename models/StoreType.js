const Sequelize = require("sequelize");
const db = require("../config/database");

const StoreType = db.define("store_types", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	}
});
StoreType.getColumns = `"store_types"."id" AS "store_type_id",
    "store_types"."name" AS "store_type_name"`;

module.exports = StoreType;
