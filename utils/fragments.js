module.exports = {
	poFragment: `
	"purchase_orders"."po_number",
	"purchase_orders"."job_code",
	"purchase_orders"."description",
	"purchase_orders"."date" AS "po_date",
	"purchase_orders"."installed"
`,
	jobFragment: `
	"jobs"."job_code", 
	"jobs"."name" AS "job_name", 
	"jobs"."customer_code"
`,
	customerFragment: `
	"customers"."customer_code",
	"customers"."name" AS "customer_name"
`,
	branchFragment: `
    "branches"."id" AS "branch_id",
    "branches"."branch_code",
    "branches"."name" AS "branch_name",
    "branches"."address",
    "branches"."province",
    "branches"."store_type_id",
    "branches"."gl_branch",
    "branches"."short_code"
`,
	storeTypeFragment: `
    "store_types"."id" AS "store_type_id",
    "store_types"."name" AS "store_type_name"
`
};
