import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "../components/Table";
import BranchesTable from "../tables/branches";
import Modal from "@/common/components/Modal";
import Field from "../components/Field";
import Axios from "axios";
import history from "@/common/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

import BranchSearch from "@/modules/record/components/search/BranchSearch";
import { setSelectedBranches, setSelectedCustomer } from "@/actions/record";
import { connect } from "react-redux";

class PO extends React.PureComponent {
	state = {
		edit: false,
		installed: false,
		description: ""
	};
	handleFormSubmit() {
		const { description, installed } = this.state;
		const { data } = this.props;
		Axios.request({
			method: "PUT",
			url: `/po/${data.po.po_number}/edit`,
			data: {
				date: data.po.date,
				description,
				installed,
				job_code: data.po.job_code
			}
		})
			.then(res => console.log(res))
			.catch(err => console.log(err));
		window.location.reload();
	}
	async handleAddBranches() {
		const { selectedBranches, data } = this.props;
		let branchIds = [];
		if (selectedBranches.length > 0) {
			selectedBranches.map(e => branchIds.push(e.id));
			await Axios.request({
				method: "POST",
				url: `/po/${data.po.po_number}/add-branches`,
				data: {
					branch_id: branchIds
				}
			})
				.then(r => console.log(r))
				.catch(err => console.log(err, "branches"));
		}
		window.location.reload();
	}
	render() {
		const { data, selectedBranches, setSelectedBranches, setSelectedCustomer } = this.props;
		const { edit, installed, description, showAddBranches } = this.state;
		if (data) {
			if (!data.po) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>PO Number: {data && data.po.po_number}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<h5 className="no-mt has-mb-10">
										Purchase Order
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() =>
												this.setState({
													edit: true,
													installed: data.po.installed,
													description: data.po.description
												})
											}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date:</label>
										<span>{data.po.date}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Installed:</label>
										<span>
											{data.po.installed ? "Installed" : "Not Installed"}
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Description:</label>
										<span>{data.po.description}</span>
									</div>
								</div>
								<hr />
								<div>
									<h5 className="no-mt has-mb-10">
										Job
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() =>
												history.push(`/single/job/${data.po.job_code}`)
											}
										>
											<FontAwesomeIcon icon={faExternalLinkAlt} />
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Job Code:</label>
										<span>{data.po.job_code}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Job Name:</label>
										<span>{data.po.job.name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Customer Name:</label>
										<span>{data.po.job.customer.name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Customer Code:</label>
										<span>{data.po.job.customer.customer_code}</span>
									</div>
								</div>
								<hr />
								<button
									className="button has-mb-10"
									type="button"
									onClick={() => {
										this.setState({ showAddBranches: true });
										setSelectedCustomer(data.po.job.customer);
									}}
								>
									Add Branches
								</button>
							</div>
							<FetchDataFromServer
								url={data && `/po/${data.po.po_number}/branches`}
								render={d => (
									<Table
										data={d}
										table={d => <BranchesTable data={d} />}
										className="no-pt"
										title="Branches"
									/>
								)}
							/>
							<Modal
								active={showAddBranches}
								close={() => this.setState({ showAddBranches: false })}
								title="เพิ่มสาขา"
							>
								<div>
									<BranchSearch />
									<h6>สาขาที่เลือกไว้</h6>
									<div>
										{selectedBranches.length > 0 ? (
											<ul className="no-mt">
												{selectedBranches.map((e, i) => (
													<li key={i + e.name}>
														{e.name}
														<span
															className="danger has-ml-05 is-clickable"
															onClick={() =>
																setSelectedBranches(
																	selectedBranches
																		.slice(0, i)
																		.concat(
																			selectedBranches.slice(
																				i + 1,
																				selectedBranches.length
																			)
																		)
																)
															}
														>
															<FontAwesomeIcon icon={faTrash} />
														</span>
													</li>
												))}
											</ul>
										) : (
											<p className="is-gray-3 has-mb-10">
												ยังไม่ได้เลือกสาขา
											</p>
										)}
									</div>
									<div className="buttons">
										<button
											className="button"
											type="submit"
											onClick={() => this.handleAddBranches()}
										>
											Confirm
										</button>
										<button
											className="button is-light"
											type="button"
											onClick={() =>
												this.setState({ showAddBranches: false })
											}
										>
											Cancel
										</button>
									</div>
								</div>
							</Modal>
							<Modal
								active={edit}
								close={() => this.setState({ edit: false })}
								title="Edit PO"
							>
								<div>
									<Field
										name="po_number"
										editable={false}
										value={data.po.po_number}
										label="PO Number"
									/>
									<Field
										name="date"
										editable={false}
										value={data.po.date}
										label="Date"
									/>
									<Field
										editable={true}
										name="installed"
										type="checkbox"
										label="Installed"
										value={installed}
										onChange={() => this.setState({ installed: !installed })}
									/>
									<Field
										editable={true}
										name="description"
										type="text"
										label="Description"
										value={description}
										onChange={e =>
											this.setState({ description: e.target.value })
										}
									/>
									<div className="buttons">
										<button
											className="button"
											onClick={() => this.handleFormSubmit()}
										>
											Confirm
										</button>
										<button
											className="button is-light"
											type="button"
											onClick={() => this.setState({ edit: false })}
										>
											Cancel
										</button>
									</div>
								</div>
							</Modal>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	selectedBranches: state.record.selectedBranches
});
const mapDispatchToProps = {
	setSelectedBranches,
	setSelectedCustomer
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PO);
