import React from "react";
import history from "@/common/history";

const CustomersTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Customer Code</td>
				<td>Customer Name</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.customers.length > 0 &&
					data.customers.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.customer_code}
							onClick={event => {
								history.push(`/single/customer/${e.customer_code}`);
								event.stopPropagation();
							}}
						>
							<td>{e.customer_code}</td>
							<td>{e.name}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default CustomersTable;
