import React from 'react';
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
				(data.branches.length > 0 &&
					data.branches.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.branch_code}
							onClick={event => {
								history.push(`/single/branch/${e.id}`);
								event.stopPropagation();
							}}
						>
							<td>{e.branch_code}</td>
							<td>{e.name}</td>
							<td>{e.store_type.name}</td>
							<td>{e.province}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BranchesTable;