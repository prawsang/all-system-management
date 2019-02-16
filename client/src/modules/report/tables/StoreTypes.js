import React from "react";
import history from "@/common/history";

const StoreTypesTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Store Type</td>
			</tr>
		</thead>
		<tbody>
			{data &&
				(data.types.length > 0 &&
					data.types.map((e, i) => (
						<tr key={i + e.id}>
							<td>{e.name}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default StoreTypesTable;
