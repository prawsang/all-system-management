import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../../components/Table";
import ReservedItemsTable from "../../tables/reserved";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import BranchesTable from "../../tables/branchJunction";
import history from "@/common/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { CustomerData } from "../../data";
import Edit from "./Edit";
import AddBranch from "./AddBranch";

class Job extends React.Component {
	state = {
		edit: false,
		activeTable: 0, // 0 = branches, 1 = reserved items
		showAddBranch: false
	};
	render() {
		const { data } = this.props;
		const { edit, activeTable, showAddBranch } = this.state;
		if (data) {
			if (!data.job) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Job: {data && data.job.name}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<div style={{ float: "right" }}>
										<button
											className="button"
											onClick={() =>
												this.setState({
													edit: true
												})
											}
										>
											Edit
										</button>
									</div>
									<h5 className="no-mt has-mb-10">Job</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Job Code:</label>
										<span>{data.job.job_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Job Name:</label>
										<span>{data.job.name}</span>
									</div>
								</div>
								<hr />
								<CustomerData data={data.job.customer} />
								<hr />
							</div>
							<div style={{ float: "right", paddingRight: 30 }}>
								<button
									className={`button ${activeTable === 0 || "is-hidden"}`}
									onClick={() =>
										this.setState({
											showAddBranch: true
										})
									}
								>
									Add Branch
								</button>
							</div>
							<div className="tabs" style={{ paddingLeft: 30 }}>
								<div
									className={`tab-item ${activeTable === 0 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 0 });
										this.props.setPage(1);
									}}
								>
									Branches
								</div>
								<div
									className={`tab-item ${activeTable === 1 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 1 });
										this.props.setPage(1);
									}}
								>
									Reserved
								</div>
							</div>
							<div>
								<FetchDataFromServer
									className={activeTable === 0 ? "" : "is-hidden"}
									disabled={activeTable !== 0}
									url={data && `/job/${data.job.job_code}/branches`}
									render={d => (
										<Table
											data={d}
											table={d => <BranchesTable data={d} />}
											className="no-pt"
											title="Branches"
										/>
									)}
								/>
								<FetchDataFromServer
									className={activeTable === 1 ? "" : "is-hidden"}
									disabled={activeTable !== 1}
									url={data && `/stock/reserve-job-code/${data.job.job_code}`}
									render={d => (
										<Table
											data={d}
											table={d => <ReservedItemsTable data={d} />}
											className="no-pt"
											title="Reserved Items"
										/>
									)}
								/>
							</div>
							<Edit
								job={data.job}
								close={() => this.setState({ edit: false })}
								active={edit}
							/>
							<AddBranch
								job={data.job}
								close={() => this.setState({ showAddBranch: false })}
								active={showAddBranch}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	setPage
};

export default connect(
	null,
	mapDispatchToProps
)(Job);
