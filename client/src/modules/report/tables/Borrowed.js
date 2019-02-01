import React from "react";
import history from "@/common/history";

const Borrowed = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Serial No.</td>
				<td>Model Name</td>
				<td>Type</td>
				<td>Branch</td>
				<td>Job</td>
				<td>Customer</td>
				<td>Return By</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.items.length > 0 &&
					data.items.map((e, i) => {
						const { serial_no, model, withdrawals } = e;
						const { branch, job, return_by } = withdrawals[0];
						return (
							<tr
								className="is-hoverable is-clickable"
								key={i + e.serial_no}
								onClick={() => 
									history.push(`/single/item/${e.serial_no}`)
								}
							>
								<td>{serial_no}</td>
								<td>{model.name}</td>
								<td>{model.type}</td>
								<td>
									{branch.name} {branch.branch_code && `(${branch.branch_code})`}
								</td>
								<td>
									{job.name} ({job.job_code})
								</td>
								<td>
									{branch.customer.name} ({branch.customer.customer_code})
								</td>
								<td>{return_by}</td>
							</tr>
						);
					}))}
		</tbody>
	</table>
);

export default Borrowed;
