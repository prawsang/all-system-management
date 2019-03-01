const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");

const Branch = require("../models/Branch");
const Customer = require("../models/Customer");
const Item = require("../models/Item");
const Job = require("../models/Job");
const Model = require("../models/Model");
const PurchaseOrder = require("../models/PurchaseOrder");
const StoreType = require("../models/StoreType");
const User = require("../models/User");
const Withdrawal = require("../models/Withdrawal");

getModelPluralName = model => {
	switch (model) {
		case Branch:
			return "branches";
		case Customer:
			return "customers";
		case Item:
			return "items";
		case Job:
			return "jobs";
		case Model:
			return "models";
		case PurchaseOrder:
			return "po";
		case StoreType:
			return "types";
		case User:
			return "users";
		case Withdrawal:
			return "withdrawals";
		default:
			return "rows";
	}
};

configPrefs = data => {
	const { where, search, search_term, search_junction } = data;
	let { include } = data;

	let prefs = {
		include: include,
		where: where ? where : {}
	};
	if (search && search_term) {
		if (search_junction !== undefined) {
			include[search_junction].where = {};
			include[search_junction].where[search] = {
				[Op.iLike]: "%" + search_term + "%"
			};
		} else {
			prefs.where[search] = {
				[Op.iLike]: "%" + search_term + "%"
			};
		}
	}
	return prefs;
};

module.exports = {
	countAndQuery: async function(data) {
		// search_junction is the index of the included model in the include array
		const { where, include, limit, page, search, model, search_junction } = data;
		let search_term;
		if (data.search_term) {
			search_term = data.search_term.toLowerCase();
		}

		let res = null;
		let errors = [];

		let offset = 0;
		if (limit && page) {
			offset = limit * (page - 1);
		}

		await model
			.findAndCountAll(
				configPrefs({
					where,
					include,
					search_junction,
					search,
					search_term,
					limit,
					offset
				})
			)
			.then(r => (res = r))
			.catch(err => errors.push(err));
		if (errors.length !== 0) {
			return { errors };
		}

		let pagesCount = 1;
		if (limit) pagesCount = Math.ceil(res.count / limit);

		let out = {
			count: res.count,
			pagesCount
		};
		out[getModelPluralName(model)] = res.rows;
		return out;
	},
	countAndQueryWithString: async function(data) {
		const { select, from_where, limit, page, search, search_table, rows_name } = data;
		let search_term;
		if (data.search_term) {
			search_term = data.search_term.toLowerCase();
		}

		let res = null;
		let count = 0;
		let errors = [];

		let offset = 0;
		if (limit && page) {
			offset = limit * (page - 1);
		}

		await db
			.query(
				`SELECT count(*) AS "count" ${from_where} 
            ${
				search && search_term
					? `AND ${search_table}.${search} LIKE LOWER('%${search_term}%')`
					: ""
			}`,
				{ type: db.QueryTypes.SELECT }
			)
			.then(c => (count = parseInt(c[0].count)))
			.catch(err => errors.push(err));
		if (errors.length !== 0) {
			return { errors };
		}
		await db
			.query(
				`${select} ${from_where} 
            ${search && search_term ? `AND ${search_table}.${search} LIKE '%${search_term}%'` : ""}
            ${limit && page ? `LIMIT ${limit} OFFSET ${offset}` : ""}`,
				{ type: db.QueryTypes.SELECT }
			)
			.then(r => (res = r))
			.catch(err => errors.push(err));
		if (errors.length !== 0) {
			return { errors };
		}

		let pagesCount = 1;
		if (limit) pagesCount = Math.ceil(res.count / limit);

		let out = {
			count,
			pagesCount
		};
		out[rows_name] = res;
		return out;
	}
};
