import React from "react";
import history from "@/common/history";

const InstallWoPO = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Withdrawal ID</td>
				<td>DO Number</td>
				<td>Customer</td>
				<td>Branch</td>
				<td>Installation Date</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.withdrawal_id}
							onClick={event => {
								history.push(`/single/withdrawal/${e.withdrawal_id}`);
								event.stopPropagation();
							}}
						>
							<td>{e.withdrawal_id}</td>
							<td>{e.do_number}</td>
							<td>
								{e.customer_name} ({e.customer_code})
							</td>
							<td>
								{e.branch_name} {e.branch_code && `(${e.branch_code})`}
							</td>
							<td>{e.install_date}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default InstallWoPO;
