import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import POTable from "@/common/tables/po";

const AllPO = () => (
	<FetchDataFromServer
		url="/po/get-all"
		render={data => (
			<Table
				data={data}
				table={data => <POTable data={data} showCustomer={true} />}
				title="PO ทั้งหมด"
				filters={{
					date: true
				}}
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

export default AllPO;
