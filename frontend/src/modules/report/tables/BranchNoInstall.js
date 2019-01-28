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
				(data.branches.length > 0 &&
					data.branches.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.id}
							onClick={() => 
								history.push(`/single/branch/${e.id}`)
							}
						>
							<td>{e.branch_code}</td>
							<td>{e.name}</td>
							<td>{e.customer.name} ({e.customer.customer_code})</td>
							<td>{e.purchase_orders.map((f,i) => (
								<span 
									key={i} 
									className="accent is-clickable has-mr-05"
									onClick={(event) => {
										history.push(`/single/po/${f.po_number}`);
										event.stopPropagation();
									}}
								>
									{f.po_number}
								</span>)
							)}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default BranchNoInstall;
