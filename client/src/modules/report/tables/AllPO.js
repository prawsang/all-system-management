import React from "react";
import history from "@/common/history";

const AllPO = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>PO Number</td>
				<td>Customer</td>
				<td>Job</td>
				<td>Description</td>
				<td>Date</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.po.length > 0 &&
					data.po.map(
						(e, i) =>
							e.job && (
								<tr
									className="is-hoverable is-clickable"
									key={i + e.po_number}
									onClick={event => {
										history.push(`/single/po/${e.po_number}`);
										event.stopPropagation();
									}}
								>
									<td>{e.po_number}</td>
									<td>
										{e.job.customer.name} ({e.job.customer_code})
									</td>
									<td>
										{e.job.name} ({e.job.job_code})
									</td>
									<td>{e.description}</td>
									<td>{e.date}</td>
								</tr>
							)
					))}
		</tbody>
	</table>
);

export default AllPO;
