const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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
    
        let count = 0;
        let res = {}
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
        
        return {
            rows: res.rows,
            count: res.count,
            pagesCount
        };
    }
}