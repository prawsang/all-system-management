const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../config/database");

const Branch = require('../models/Branch');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Job = require('../models/Job');
const Model = require('../models/Model');
const PurchaseOrder = require('../models/PurchaseOrder');
const StoreType = require('../models/StoreType');
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');

getModelPluralName = (model) => {
    switch (model) {
        case Branch: return 'branches';
        case Customer: return 'customers';
        case Item: return 'items';
        case Job: return 'jobs';
        case Model: return 'models';
        case PurchaseOrder: return 'po';
        case StoreType: return 'types';
        case User: return 'users';
        case Withdrawal: return 'withdrawals'
    }
}

configPrefs = (data) => {
    const {
        include,
        where,
        search,
        search_term
    } = data;

    let prefs = {
        include: include,
        where: where ? where : {}
    }
    if (search && search_term && search_term.length >= 3) {
        prefs.where[search] = {
            [Op.like]: '%' + search_term + '%'
        }
    }

    return prefs;
}

module.exports = {
    countAndQuery: async function(data) {
        const {
            where,
            include,
            limit,
            page,
            search,
            search_term,
            model
        } = data;

        let res = null
        let errors = [];
        
        let offset = 0;
        if (limit && page) {
            offset = limit * (page - 1);
        }
    
        await model.findAndCountAll(configPrefs({
            where,
            include,
            search,
            search_term,
            limit,
            offset
        }))
            .then(r => res = r)
            .catch(err => errors.push(err));
        if (errors.length !== 0) {
            return { errors }
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
        const {
            select,
            from_where,
            limit,
            page,
            search,
            search_table,
            search_term,
            rows_name
        } = data;

        let res = null
        let count = 0;
        let errors = [];
        
        let offset = 0;
        if (limit && page) {
            offset = limit * (page - 1);
        }

        await db.query(
            `SELECT count(*) AS "count" ${from_where} 
            ${(search && search_term) ? `AND ${search_table}.${search} LIKE '%${search_term}%'` : ''}`,
            { type: db.QueryTypes.SELECT }
        )
            .then(c => count = parseInt(c[0].count))
            .catch(err => errors.push(err));
        if (errors.length !== 0) {
            return { errors }
        }
        await db.query(
            `${select} ${from_where} 
            ${(search && search_term) ? `AND ${search_table}.${search} LIKE '%${search_term}%'` : ''}
            ${(limit && page) ? `LIMIT ${limit} OFFSET ${offset}` : ''}`,
            { type: db.QueryTypes.SELECT }
        )
            .then(r => res = r)
            .catch(err => errors.push(err));
        if (errors.length !== 0) {
            return { errors }
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
}