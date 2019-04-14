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
				(data.rows.length > 0 &&
					data.rows.map((e, i) => {
						return (
							<tr
								className="is-hoverable is-clickable"
								key={i + e.serial_no}
								onClick={() => history.push(`/single/item/${e.serial_no}`)}
							>
								<td>{e.serial_no}</td>
								<td>{e.model_name}</td>
								<td>{e.model_type}</td>
								<td>
									{e.branch_name} {e.branch_code && `(${e.branch_code})`}
								</td>
								<td>
									{e.job_name} ({e.job_code})
								</td>
								<td>
									{e.customer_name} ({e.customer_code})
								</td>
								<td>{e.return_by}</td>
							</tr>
						);
					}))}
		</tbody>
	</table>
);

export default Borrowed;
