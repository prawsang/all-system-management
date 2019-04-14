import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../components/Table";
import Broken from "../tables/Broken";

const BrokenWrapper = () => (
	<FetchDataFromServer
		url="/stock/get-all"
		params="broken=true"
		render={data => (
			<Table
				data={data}
				table={data => <Broken data={data} />}
				title="ของเสีย"
				columns={[
					{
						col: "serial_no",
						name: "Serial No"
					},
					{
						col: "model_name",
						name: "Model Name"
					},
					{
						col: "model_type",
						name: "Model Type"
					},
					{
						col: "status",
						name: "Status"
					}
				]}
			/>
		)}
	/>
);

export default BrokenWrapper;
