import React from "react";

class AllPO extends React.Component {
	render() {
		return (
			<table className="is-fullwidth is-rounded">
				<thead>
					<tr>
						<td>PO Number</td>
						<td>Customer Name</td>
						<td>Job Code</td>
						<td>Description</td>
						<td>Date</td>
					</tr>
				</thead>
				<tbody className="is-hoverable">
					<tr className="is-hoverable is-clickable">
						<td>1</td>
						<td>2</td>
						<td>3</td>
						<td>4</td>
						<td>5</td>
					</tr>
				</tbody>
			</table>
		);
	}
}

export default AllPO;
