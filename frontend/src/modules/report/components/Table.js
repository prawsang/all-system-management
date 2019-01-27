import React from "react";
import SearchBar from "@/common/components/SearchBar";
import Pagination from "../components/Pagination";
import { setPage, setLimit } from "@/actions/report";
import { connect } from "react-redux";
import history from '@/common/history';

class Table extends React.Component {
	handleLimitChange(limit) {
		this.props.setPage(1);
		this.props.setLimit(limit);
	}
	render() {
		const { data, currentLimit, title, table } = this.props;
		return (
			<React.Fragment>
				<h3>{title}</h3>
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
									totalPages={data ? data.pagesCount : 1} 
									url={`/po/get-all?limit=${currentLimit}`}
								/>
							</div>
						</div>
					</div>
					{table(data)}
					<div className="panel-content is-flex is-jc-flex-end">
						<Pagination 
							totalPages={data ? data.pagesCount : 1} 
							url={`/po/get-all?limit=${currentLimit}`}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	currentPage: state.report.currentPage,
	currentLimit: state.report.currentLimit
});
const mapDispatchToProps = {
	setPage,
	setLimit
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Table);
