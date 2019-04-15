import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import StoreTypesTable from "../tables/StoreTypes";
import TableWithNew from "@/common/components/TableWithNew";
import StoreType from "../modals/StoreType";

const StoreTypesWrapper = () => (
	<FetchDataFromServer
		url="/store-type/get-all"
		render={data => (
			<TableWithNew
				data={data}
				table={data => <StoreTypesTable data={data} />}
				title="All Store Types"
				newModalContent={data => <StoreType />}
				columns={[
					{
						col: "store_type_name",
						name: "Store Type Name"
					}
				]}
			/>
		)}
	/>
);

export default StoreTypesWrapper;
