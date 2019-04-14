import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import ModelsTable from "../tables/Models";
import TableWithNew from "../components/TableWithNew";
import Model from "../modals/Model";

const ModelsWrapper = () => (
	<FetchDataFromServer
		url="/model/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <ModelsTable data={data} />}
				title="All Models"
				newModalContent={data => <Model />}
				columns={[
					{
						col: "model_name",
						name: "Model Name"
					},
					{
						col: "model_type",
						name: "Type"
					}
				]}
			/>
		)}
	/>
);

export default ModelsWrapper;
