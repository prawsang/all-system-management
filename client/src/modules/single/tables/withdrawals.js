import React from "react";
import history from "@/common/history";

const WithdrawalsTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Withdrawal ID</td>
				<td>Branch</td>
				<td>Customer</td>
				<td>Type</td>
				<td>Date</td>
				<td>Install Date</td>
				<td>Return Date</td>
				<td>Status</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.withdrawals.length > 0 &&
					data.withdrawals.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.id}
							onClick={event => {
								history.push(`/single/withdrawal/${e.id}`);
								event.stopPropagation();
							}}
						>
							<td>{e.id}</td>
							<td>
								{e.branch.name}{" "}
								{e.branch.branch_code && `(${e.branch.branch_code})`}
							</td>
							<td>
								{e.branch.customer.name} ({e.branch.customer.customer_code})
							</td>
							<td>{e.type}</td>
							<td>{e.date}</td>
							<td>{e.install_date}</td>
							<td>{e.return_date}</td>
							<td>{e.status}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default WithdrawalsTable;
