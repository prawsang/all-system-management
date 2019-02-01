import React from "react";
import history from "@/common/history";

const InstallWoPO = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Withdrawal ID</td>
				<td>DO Number</td>
				<td>Customer Name</td>
				<td>Job Name</td>
				<td>Branch Name</td>
				<td>Installation Date</td>
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
							<td>{e.do_number}</td>
							<td>{e.branch.customer.name} ({e.branch.customer.customer_code})</td>
							<td>{e.job.name} ({e.job.job_code})</td>
							<td>{e.branch.name} {e.branch.branch_code && `(${e.branch.branch_code})`}</td>
							<td>{e.date}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default InstallWoPO;
