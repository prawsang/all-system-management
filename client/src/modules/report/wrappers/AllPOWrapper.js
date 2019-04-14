import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../components/Table";
import AllPO from "../tables/AllPO";

const AllPOWrapper = () => (
	<FetchDataFromServer
		url="/po/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <AllPO data={data} />}
				title="PO ทั้งหมด"
				columns={[
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
						col: "job_name",
						name: "Job Name"
					},
					{
						col: "job_code",
						name: "Job Code"
					}
				]}
			/>
		)}
	/>
);

export default AllPOWrapper;
