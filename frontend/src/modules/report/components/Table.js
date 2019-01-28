import React from "react";
import SearchBar from "@/common/components/SearchBar";
import Pagination from "@/common/components/Pagination";
import { setPage, setLimit } from "@/actions/report";
import { connect } from "react-redux";

class Table extends React.Component {
	handleLimitChange(limit) {
		this.props.setPage(1);
		this.props.setLimit(limit);
	}
	render() {
		const { data, title, table } = this.props;
		return (
			<React.Fragment>
				<h3>{title}</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="is-flex is-jc-space-between">
							<SearchBar />
							<div className="is-flex is-ai-center">
								<div className="select no-mb">
									<select onChange={(e) => this.handleLimitChange(e.target.value)}>
										<option>25</option>
										<option>50</option>
										<option>100</option>
									</select>
								</div>
								<Pagination 
									totalPages={data ? data.pagesCount : 1} 
								/>
							</div>
						</div>
					</div>
					{table(data)}
					<div className="panel-content is-flex is-jc-space-between">
						<span>Total: {data && data.count}</span>
						<Pagination 
							totalPages={data ? data.pagesCount : 1} 
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	setPage,
	setLimit
};

export default connect(
	null,
	mapDispatchToProps
)(Table);
