import React from "react";
import Pagination from "@/common/components/Pagination";
import { setPage, setLimit, setSearchCol } from "@/actions/report";
import { connect } from "react-redux";
import SearchBar from "@/common/components/SearchBar";
import SearchSelect from "./SearchSelect";

class Table extends React.Component {
	handleLimitChange(limit) {
		this.props.setPage(1);
		this.props.setLimit(limit);
	}
	componentDidMount() {
		if (this.props.columns) {
			this.props.setSearchCol(this.props.columns[0].col);
		}
	}
	render() {
		const { title, className, table, data, noPage, columns } = this.props;
		return (
			<React.Fragment>
				<div className={`panel-content ${className}`}>
					<h5 className="no-mt">{title}</h5>
					{noPage || (
						<div className="is-flex is-jc-space-between is-wrap">
							<div className="col-6 has-mb-05 is-flex is-ai-center">
								<SearchBar />
								{columns && <SearchSelect columns={columns} />}
							</div>
							<div className="col-6 is-flex is-ai-center is-jc-flex-end">
								<div className="select no-mb">
									<select onChange={e => this.handleLimitChange(e.target.value)}>
										<option>25</option>
										<option>50</option>
										<option>100</option>
									</select>
								</div>
								<Pagination totalPages={data ? data.pagesCount : 1} />
							</div>
						</div>
					)}
				</div>
				<div style={{ maxWidth: "100%", overflowY: "scroll" }} className={className}>
					{table(data)}
				</div>
				<div className="panel-content is-flex is-jc-flex-end">
					{noPage || <Pagination totalPages={data ? data.pagesCount : 1} />}
				</div>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	setPage,
	setLimit,
	setSearchCol
};

export default connect(
	null,
	mapDispatchToProps
)(Table);
