import React from "react";
import SearchBar from '@/common/components/SearchBar';
import Pagination from "../components/Pagination";

class AllPO extends React.Component {
	render() {
		return (
			<React.Fragment>
				<h3>PO ทั้งหมด</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="is-flex is-jc-space-between">
							<SearchBar />
							<Pagination totalPages={3} />
						</div>
					</div>
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
					<div className="panel-content is-flex is-jc-flex-end">
						<Pagination totalPages={3} />
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default AllPO;
