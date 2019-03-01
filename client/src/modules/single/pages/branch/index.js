import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../../components/Table";
import ItemsTable from "../../tables/itemsJunction";
import ReservedItemsTable from "../../tables/reserved";
import { setPage } from "@/actions/report";
import { connect } from "react-redux";
import POTable from "../../tables/po";
import history from "@/common/history";
import { CustomerData } from "../../data";
import Edit from "./Edit";
import AddJob from "./AddJob";

class Branch extends React.Component {
	state = {
		edit: false,
		activeTable: 0, // 0 = items, 1 = po, 2 = reserved items
		showAddJob: false
	};
	render() {
		const { data } = this.props;
		const { edit, activeTable, showAddJob } = this.state;
		if (data) {
			if (!data.branch) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>Branch: {data && data.branch.name}</h3>
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
									<h5 className="no-mt has-mb-10">Branch</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Branch Code:</label>
										<span>{data.branch.branch_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Address:</label>
										<span>{data.branch.address}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Province:</label>
										<span>{data.branch.province}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Store Type:</label>
										<span>{data.branch.store_type.name}</span>
									</div>
								</div>
								<hr />
								<CustomerData data={data.branch.customer} />
								<hr />
								<div>
									<div style={{ float: "right" }}>
										<button
											className="button"
											onClick={() =>
												this.setState({
													showAddJob: true
												})
											}
										>
											Add
										</button>
									</div>
									<h5 className="has-mb-10 has-mt-10">Jobs</h5>
									<ul className="has-mb-10">
										{data.branch.jobs.length > 0 ? (
											data.branch.jobs.map((e, i) => (
												<li key={i + e.job_code}>
													<span
														className="accent is-clickable"
														onClick={() =>
															history.push(
																`/single/job/${e.job_code}`
															)
														}
													>
														{e.name} ({e.job_code})
													</span>
												</li>
											))
										) : (
											<p style={{ marginLeft: "-1.25em" }}>
												สาขานี้ยังไม่มี Job
											</p>
										)}
									</ul>
								</div>
								<hr />
							</div>
							<div className="tabs" style={{ paddingLeft: 30 }}>
								<div
									className={`tab-item ${activeTable === 0 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 0 });
										this.props.setPage(1);
									}}
								>
									Items
								</div>
								<div
									className={`tab-item ${activeTable === 1 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 1 });
										this.props.setPage(1);
									}}
								>
									POs
								</div>
								<div
									className={`tab-item ${activeTable === 2 ? "is-active" : ""}`}
									onClick={() => {
										this.setState({ activeTable: 2 });
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
									url={data && `/branch/${data.branch.id}/items`}
									render={d => (
										<Table
											data={d}
											table={d => (
												<ItemsTable data={d} showInstallDate={true} />
											)}
											className="no-pt"
											title="Items"
										/>
									)}
								/>
								<FetchDataFromServer
									className={activeTable === 1 ? "" : "is-hidden"}
									disabled={activeTable !== 1}
									url={data && `/branch/${data.branch.id}/po`}
									render={d => (
										<Table
											data={d}
											table={d => <POTable data={d} />}
											className="no-pt"
											title="POs"
										/>
									)}
								/>
								<FetchDataFromServer
									className={activeTable === 2 ? "" : "is-hidden"}
									disabled={activeTable !== 2}
									url={data && `/stock/reserve-branch-id/${data.branch.id}`}
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
								branch={data.branch}
								close={() => this.setState({ edit: false })}
								active={edit}
							/>
							<AddJob
								branch={data.branch}
								close={() => this.setState({ showAddJob: false })}
								active={showAddJob}
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
)(Branch);
