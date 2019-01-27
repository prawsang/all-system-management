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
				(data.po.length > 0 &&
					data.po.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.po_number}
							onClick={event => {
								history.push(`/single/po/${e.po_number}`);
								event.stopPropagation();
							}}
						>
							<td>{e.po_number}</td>
							<td>{e.description}</td>
							<td>{e.date}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default POTable;
