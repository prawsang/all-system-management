import React from "react";
import history from "@/common/history";

const POTable = ({ data }) => (
	<table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>PO Number</td>
				<td>Description</td>
				<td>Date</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.rows.length > 0 &&
					data.rows.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.po.po_number}
							onClick={event => {
								history.push(`/single/po/${e.po.po_number}`);
								event.stopPropagation();
							}}
						>
							<td>{e.po.po_number}</td>
							<td>{e.po.description}</td>
							<td>{e.po.date}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default POTable;
