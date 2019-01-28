import React from "react";
import Pagination from "@/common/components/Pagination";
import { setPage, setLimit } from "@/actions/report";
import { connect } from "react-redux";

class Table extends React.Component {
	handleLimitChange(limit) {
		this.props.setPage(1);
		this.props.setLimit(limit);
	}
	render() {
		const { title, className, table, data } = this.props;
		return (
			<React.Fragment>
				<div className={`panel-content is-flex is-jc-space-between ${className}`}>
					<h5 className="no-mt">{title}</h5>
					<div className="is-flex is-ai-center">
						<div className="select no-mb">
							<select onChange={(e) => this.handleLimitChange(e.target.value)}>
								<option>25</option>
								<option>50</option>
								<option>100</option>
							</select>
						</div>
                    	<Pagination totalPages={data ? data.pagesCount : 1} />
					</div>
				</div>
				{table(data)}
				<div className="panel-content is-flex is-jc-flex-end">
					<Pagination totalPages={data ? data.pagesCount : 1} />
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
