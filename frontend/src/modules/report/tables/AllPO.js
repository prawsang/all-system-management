import React from "react";
import SearchBar from "@/common/components/SearchBar";
import Pagination from "../components/Pagination";
import { fetchData, setPage, setLimit } from "@/actions/report";
import { connect } from "react-redux";

class AllPO extends React.Component {
	componentDidMount() {
		this.props.fetchData(`/po/get-all?limit=${this.props.currentLimit}&page=${this.props.currentPage}`);
	}
	handleLimitChange(limit) {
		this.props.setPage(1);
		this.props.setLimit(limit);
		this.props.fetchData(`/po/get-all?limit=${limit}&page=1`);
	}
	render() {
		const { data, currentLimit } = this.props;
		return (
			<React.Fragment>
				<h3>PO ทั้งหมด</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="is-flex is-jc-space-between">
							<SearchBar />
							<div>
								<select onChange={(e) => this.handleLimitChange(e.target.value)}>
									<option>25</option>
									<option>50</option>
									<option>100</option>
								</select>
								<Pagination 
									totalPages={data.pagesCount} 
									url={`/po/get-all?limit=${currentLimit}`}
								/>
							</div>
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
							{data.po &&
								(data.po.length > 0 &&
									data.po.map((e, i) => (
										<tr className="is-hoverable is-clickable" key={i + e.po_number}>
											<td>{e.po_number}</td>
											<td>{e.job.customer.name}</td>
											<td>{e.job.job_code}</td>
											<td>{e.description}</td>
											<td>{e.date}</td>
										</tr>
									)))}
						</tbody>
					</table>
					<div className="panel-content is-flex is-jc-flex-end">
						<Pagination 
							totalPages={data.pagesCount} 
							url={`/po/get-all?limit=${currentLimit}`}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	data: state.report.data,
	currentPage: state.report.currentPage,
	currentLimit: state.report.currentLimit
});
const mapDispatchToProps = {
	fetchData,
	setPage,
	setLimit
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AllPO);
