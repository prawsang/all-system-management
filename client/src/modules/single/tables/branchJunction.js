import React from "react";
import history from "@/common/history";

const BranchJunctionTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Branch Code</td>
				<td>Branch Name</td>
				<td>Store Type</td>
				<td>Province</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.branch.branch_code}
							onClick={event => {
								history.push(`/single/branch/${e.branch.id}`);
								event.stopPropagation();
							}}
						>
							<td>{e.branch.branch_code}</td>
							<td>{e.branch.name}</td>
							<td>{e.branch.store_type.name}</td>
							<td>{e.branch.province}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BranchJunctionTable;
