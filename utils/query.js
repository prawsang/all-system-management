const db = require("../config/database");

const checkColName = (name, cols) => {
	if (cols.indexOf(name) >= 0) {
		return true;
	}
	return false;
};

const getFromAlias = col => {
	switch (col) {
		case "customer_name":
			return `"customer"."name"`;
		case "job_name":
			return `"job"."name"`;
		case "withdrawal_id":
			return `"withdrawal"."id"`;
		case "branch_id":
			return `"branch"."id"`;
		case "po_date":
			return `"purchase_orders"."date"`;
		case "store_type_name":
			return `"store_type"."name"`;
		default:
			return `"${col}"`;
	}
};

module.exports = {
	query: async function(data) {
		const { limit, page, search_term, cols, tables, availableCols, where, replacements } = data;
		let { search_col } = data;

		if (search_col && !checkColName(search_col, availableCols)) {
			return {
				rows: [],
				count: 0,
				pagesCount: 0
			};
		}
		search_col = getFromAlias(search_col);

		let count = 0;
		let response = [];
		let errors = [];

		let whereString = "";
		if (where || (search_col && search_term)) {
			const search = search_col && search_term ? `${search_col} LIKE :search_term` : null;
			whereString = `WHERE ${[where, search].filter(e => e).join(" AND ")}`;
		}

		await db
			.query(
				`SELECT COUNT(*) 
            FROM ${tables} 
            ${whereString}
            `,
				{
					replacements: {
						search_term: search_term ? `%${search_term}%` : "",
						...replacements
					},
					type: db.QueryTypes.SELECT
				}
			)
			.then(c => {
				count = c[0].count;
			})
			.catch(err => {
				errors.push(err);
			});

		await db
			.query(
				`SELECT ${cols}
            FROM ${tables}
            ${whereString}
            ${limit ? `LIMIT :limit` : ""}
            ${limit && page ? `OFFSET :offset` : ""}`,
				{
					replacements: {
						search_term: search_term ? `%${search_term}%` : "",
						limit,
						offset: limit * (page - 1),
						...replacements
					},
					type: db.QueryTypes.SELECT
				}
			)
			.then(r => {
				response = r;
			})
			.catch(err => {
				errors.push(err);
			});
		if (errors.length > 0) {
			return {
				errors
			};
		}
		return {
			rows: response,
			count,
			pagesCount: limit ? Math.ceil(count / limit) : 1
		};
	}
};
