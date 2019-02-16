import React from "react";
import history from "@/common/history";

const ModelsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Model Name</td>
				<td>Type</td>
			</tr>
		</thead>
		<tbody>
			{data &&
				(data.models.length > 0 &&
					data.models.map((e, i) => (
						<tr key={i + e.id}>
							<td>{e.name}</td>
							<td>{e.type}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default ModelsTable;
