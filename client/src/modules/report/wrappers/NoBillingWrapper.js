import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import WithdrawalsTable from "@/common/tables/withdrawalStatic";

const NoBillingWrapper = () => (
	<FetchDataFromServer
		url="/withdrawal/get-all"
		params="billed=false"
		render={data => (
			<Table
				data={data}
				table={data => <WithdrawalsTable data={data} />}
				title="การติดตั้งที่ยังไม่ได้วางบิล"
				columns={[
					{
						col: "withdrawal_id",
						name: "Withdrawal ID"
					},
					{
						col: "do_number",
						name: "DO Number"
					},
					{
						col: "po_number",
						name: "PO Number"
					},
					{
						col: "customer_name",
						name: "Customer Name"
					},
					{
						col: "customer_code",
						name: "Customer Code"
					},
					{
						col: "branch_name",
						name: "Branch Name"
					},
					{
						col: "branch_code",
						name: "Branch Code"
					}
				]}
			/>
		)}
	/>
);

export default NoBillingWrapper;
