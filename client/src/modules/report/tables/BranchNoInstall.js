import React from "react";
import history from "@/common/history";

const BranchNoInstall = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Branch Code</td>
				<td>Branch Name</td>
				<td>Customer Name</td>
				<td>PO Numbers</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + " " + e.branch_id}
							onClick={() => history.push(`/single/branch/${e.branch_id}`)}
						>
							<td>{e.branch_code}</td>
							<td>{e.branch_name}</td>
							<td>
								{e.customer_name} ({e.customer_code})
							</td>
							<td>
								{e.po_numbers.map((f, i) => (
									<span
										key={i}
										className="accent is-clickable has-mr-05"
										onClick={event => {
											history.push(`/single/po/${f}`);
											event.stopPropagation();
										}}
									>
										{f}
									</span>
								))}
							</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BranchNoInstall;
