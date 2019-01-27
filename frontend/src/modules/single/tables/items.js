import React from 'react';
import history from "@/common/history";

const ItemsTable = ({ data }) => (
    <table className="is-fullwidth is-rounded">
		<thead>
			<tr>
				<td>Serial Number</td>
				<td>Model Name</td>
				<td>Type</td>
				<td>Installation Date</td>
			</tr>
		</thead>
		<tbody className="is-hoverable">
			{data &&
				(data.items.length > 0 &&
					data.items.map((e, i) => (
						<tr
							className="is-hoverable is-clickable"
							key={i + e.serial_no}
							onClick={event => {
								history.push(`/single/item/${e.serial_no}`);
								event.stopPropagation();
							}}
						>
							<td>{e.serial_no}</td>
							<td>{e.name}</td>
							<td>{e.type}</td>
							<td>{e.install_date}</td>
						</tr>
					)))}
		</tbody>
	</table>
);

export default ItemsTable;