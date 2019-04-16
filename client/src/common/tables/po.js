import React from "react";
import history from "@/common/history";

const POTable = ({ data, showCustomer }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>PO Number</td>
				{showCustomer && <td>Customer</td>}
				{showCustomer && <td>Job</td>}
				<td>Date</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.po_number}
							onClick={event => {
								history.push(`/single/po/${e.po_number}`);
								event.stopPropagation();
							}}
						>
							<td>{e.po_number}</td>
							{showCustomer && (
								<td>
									{e.customer_name} ({e.customer_code})
								</td>
							)}
							{showCustomer && (
								<td>
									{e.job_name} ({e.job_code})
								</td>
							)}
							<td>{e.po_date}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default POTable;
