import React from "react";
import history from '@/common/history';

class AllPO extends React.Component {
	render() {
		const { data } = this.props;
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
					{data &&
						(data.po.length > 0 &&
							data.po.map((e, i) => (
								<tr 
									className="is-hoverable is-clickable" 
									key={i + e.po_number}
									onClick={(event) => {
										history.push(`/single/po/${e.po_number}`);
										event.stopPropagation();
									}}
								>
									<td>{e.po_number}</td>
									<td>{e.job.customer.name}</td>
									<td>{e.job.job_code}</td>
									<td>{e.description}</td>
									<td>{e.date}</td>
								</tr>
							)))}
				</tbody>
			</table>
		);
	}
}

export default AllPO
