import React from "react";
import SearchBar from "@/common/components/SearchBar";
import Pagination from "@/common/components/Pagination";
import { setPage, setLimit } from "@/actions/report";
import { connect } from "react-redux";
import Modal from "@/common/components/Modal";

class Table extends React.Component {
	handleLimitChange(limit) {
		this.props.setPage(1);
		this.props.setLimit(limit);
	}
	state = {
		showNewModal: false
	};
	render() {
		const { data, title, table, newModalContent } = this.props;
		const { showNewModal } = this.state;
		return (
			<React.Fragment>
				<div className="is-flex is-jc-space-between is-ai-center">
					<h3>{title}</h3>
					<button
						className="button"
						onClick={() => this.setState({ showNewModal: true })}
					>
						Add New
					</button>
				</div>
				<div className="panel">
					<div className="panel-content">
						<div className="is-flex is-jc-space-between is-wrap">
							<div className="col-6 has-mb-05">
								<SearchBar />
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
					</div>
					<div style={{ maxWidth: "100%", overflowX: "scroll" }}>{table(data)}</div>
					<div className="panel-content is-flex is-jc-space-between">
						<span>Total: {data && data.count}</span>
						<Pagination totalPages={data ? data.pagesCount : 1} />
					</div>
				</div>
				<Modal
					active={showNewModal}
					close={() => this.setState({ showNewModal: false })}
					title="Add New"
				>
					{newModalContent()}
				</Modal>
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
