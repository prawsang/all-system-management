import React from "react";
import history from "@/common/history";

const InstallWoPO = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Serial No.</td>
				<td>Model Name</td>
				<td>Type</td>
				<td>Status</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.serial_no}
							onClick={() => history.push(`/single/item/${e.serial_no}`)}
						>
							<td>{e.serial_no}</td>
							<td>{e.model_name}</td>
							<td>{e.model_type}</td>
							<td>{e.status}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default InstallWoPO;
