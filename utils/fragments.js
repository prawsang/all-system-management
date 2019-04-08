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
`,
	itemFragment: `
    "stock"."serial_no",
    "stock"."model_id",
    "stock"."remarks",
    "stock"."reserve_job_code",
    "stock"."reserve_branch_id",
    "stock"."status",
    "stock"."broken",
    "stock"."stock_location",
    "stock"."po_number",
    "stock"."pr_number"
`,
	withdrawalFragment: `
    "withdrawals"."id" AS "withdrawal_id",
    "withdrawals"."branch_id",
    "withdrawals"."job_code",
    "withdrawals"."po_number",
    "withdrawals"."do_number",
    "withdrawals"."staff_name",
    "withdrawals"."type" AS "withdrawal_type",
    "withdrawals"."date" AS "withdrawal_date",
    "withdrawals"."install_date",
    "withdrawals"."return_by",
    "withdrawals"."status",
    "withdrawals"."remarks",
    "withdrawals"."billed"
`,
	modelFragment: `
    "models"."id" AS "model_id",
    "models"."name" AS "model_name",
    "models"."type" AS "model_type"
`
};
