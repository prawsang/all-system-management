module.exports = {
	poFragment: `
	"purchase_orders"."po_number",
	"purchase_orders"."job_code",
	"purchase_orders"."description",
	"purchase_orders"."date" AS "po_date",
	"purchase_orders"."installed"
`,
	jobFragment: `
	"job"."job_code", 
	"job"."name" AS "job_name", 
	"job"."customer_code"
`,
	customerFragment: `
	"customer"."customer_code",
	"customer"."name" AS "customer_name"
`
};
