import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../components/Table";
import BranchNoInstall from "../tables/BranchNoInstall";

const BranchNoInstallWrapper = () => (
	<FetchDataFromServer
		url="/branch/no-install"
		render={data => (
			<Table
				data={data}
				table={data => <BranchNoInstall data={data} />}
				title="สาขาที่ยังไม่ได้ติดตั้ง"
				columns={[
					{
						col: "branch_code",
						name: "Branch Code"
					},
					{
						col: "branch_name",
						name: "Branch Name"
					},
					{
						col: "customer_code",
						name: "Customer Code"
					},
					{
						col: "customer_name",
						name: "Customer Name"
					},
					{
						col: "province",
						name: "Province"
					},
					{
						col: "store_type_name",
						name: "Store Type"
					},
					{
						col: "gl_branch",
						name: "GL Branch"
					},
					{
						col: "short_code",
						name: "Short Code"
					}
				]}
			/>
		)}
	/>
);

export default BranchNoInstallWrapper;
