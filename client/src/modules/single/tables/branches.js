import React from "react";
import history from "@/common/history";

const BranchesTable = ({ data }) => (
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
							key={i + e.branch_code}
							onClick={event => {
								history.push(`/single/branch/${e.branch_id}`);
								event.stopPropagation();
							}}
						>
							<td>{e.branch_code}</td>
							<td>{e.branch_name}</td>
							<td>{e.store_type_name}</td>
							<td>{e.province}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BranchesTable;
