import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import WithdrawalsTable from "@/common/tables/withdrawals";

const NoBilling = () => (
	<FetchDataFromServer
		url="/withdrawal/get-all"
		params="billed=false"
		render={data => (
			<Table
				data={data}
				table={data => <WithdrawalsTable data={data} />}
				title="การติดตั้งที่ยังไม่ได้วางบิล"
				filters={{
					date: true,
					installDate: true
				}}
				columns={[
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
						col: "withdrawal_status",
						name: "Status"
					},
					{
						col: "staff_name",
						name: "ผู้เบิก"
					}
				]}
			/>
		)}
	/>
);

export default NoBilling;
