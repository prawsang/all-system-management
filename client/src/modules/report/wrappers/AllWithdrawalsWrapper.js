import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../components/Table";
import WithdrawalsTable from "@/modules/single/tables/withdrawals";

const AllWithdrawalsWrapper = () => (
	<FetchDataFromServer
		url="/withdrawal/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <WithdrawalsTable data={data} />}
				title="ใบเบิกทั้งหมด"
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
					},
					{
						col: "type",
						name: "Type"
					}
				]}
			/>
		)}
	/>
);

export default AllWithdrawalsWrapper;
