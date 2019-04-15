import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import InstallWoPO from "../tables/InstallWoPO";

const InstallNoPOWrapper = () => (
	<FetchDataFromServer
		url="/withdrawal/without-po"
		render={data => (
			<Table
				data={data}
				table={data => <InstallWoPO data={data} />}
				title="การติดตั้งที่ยังไม่ได้รับ PO"
				columns={[
					{
						col: "id",
						name: "Withdrawal ID"
					},
					{
						col: "do_number",
						name: "DO Number"
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

export default InstallNoPOWrapper;
