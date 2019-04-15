import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/Table";
import Borrowed from "../tables/Borrowed";

const BorrowedWrapper = () => (
	<FetchDataFromServer
		url="/stock/borrowed"
		render={data => (
			<Table
				data={data}
				table={data => <Borrowed data={data} />}
				title="ของยืม"
				columns={[
					{
						col: "serial_no",
						name: "Serial No."
					},
					{
						col: "model_name",
						name: "Model Name"
					}
				]}
			/>
		)}
	/>
);

export default BorrowedWrapper;
