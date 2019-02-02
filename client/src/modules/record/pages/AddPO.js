import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import CustomerSearch from "../components/search/CustomerSearch";
import BranchSearch from "../components/search/BranchSearch";
import { connect } from "react-redux";
import { setSelectedBranches } from "@/actions/record";
import history from "@/common/history";

class AddPO extends React.Component {
	state = {
		poNumber: "",
		selectedJobCode: "",
		installed: false,
		date: ""
	};

	async handleSubmit() {
		const { selectedBranches } = this.props;
		const { poNumber, selectedJobCode, installed, description, date } = this.state;
		await Axios.request({
			url: "/po/add",
			method: "POST",
			data: {
				po_number: poNumber,
				description,
				date,
				installed,
				job_code: selectedJobCode
			}
		})
			.then(async res => {
				let branchIds = [];
				if (selectedBranches.length > 0) {
					selectedBranches.map(e => branchIds.push(e.id));
					await Axios.request({
						method: "POST",
						url: `/po/${poNumber}/add-branches`,
						data: {
							branch_id: branchIds
						}
					})
						.then(r => {
							console.log(r);
							history.push(`/single/po/${poNumber}`);
						})
						.catch(err => console.log(err, "branches"));
				} else {
					history.push(`/single/po/${poNumber}`);
				}
			})
			.catch(err => console.log(err, "add"));
	}

	render() {
		const { poNumber, selectedJobCode, installed, description, date } = this.state;
		const { jobs, selectedCustomer, selectedBranches, setSelectedBranches } = this.props;

		return (
			<div className="content">
				<h3>บันทึกใบสั่งซื้อ (PO)</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="form">
							<div className="is-flex is-fullwidth">
								<div className="field">
									<input
										className="input is-fullwidth"
										placeholder="PO Number"
										value={poNumber}
										onChange={e => this.setState({ poNumber: e.target.value })}
									/>
								</div>
								<div className="field is-flex is-ai-center has-ml-10">
									<label className="is-bold has-mr-05">ติดตั้งแล้ว:</label>
									<input
										className="checkbox"
										onChange={() => this.setState({ installed: !installed })}
										type="checkbox"
										checked={installed}
										name="installed"
									/>
								</div>
							</div>
							<div className="is-flex">
								<div className="field col-6">
									<textarea
										className="input textarea is-fullwidth"
										placeholder="Description"
										value={description}
										onChange={e =>
											this.setState({ description: e.target.value })
										}
									/>
								</div>
								<div className="field col-6 has-ml-05">
									<input
										className="input is-fullwidth"
										placeholder="Date"
										type="date"
										value={date}
										onChange={e => this.setState({ date: e.target.value })}
									/>
								</div>
							</div>
							<CustomerSearch />
							<div className={`field ${!selectedCustomer && "is-disabled"}`}>
								<div className="select">
									<select
										value={selectedJobCode}
										onChange={e =>
											this.setState({ selectedJobCode: e.target.value })
										}
										disabled={!selectedCustomer}
									>
										<option value="">เลือก Job</option>
										{jobs.length > 0 ? (
											jobs.map((e, i) => (
												<option key={e.job_code + i} value={e.job_code}>
													{e.name} ({e.job_code})
												</option>
											))
										) : (
											<option value="" disabled>
												ลูกค้าท่านนี้ยังไม่มี Job
											</option>
										)}
									</select>
								</div>
							</div>
							<BranchSearch disabled={selectedJobCode === "" || !selectedJobCode} />
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
									<p className="is-gray-3 has-mb-10">ยังไม่ได้เลือกสาขา</p>
								)}
							</div>
							<div className="field">
								<button
									className="button"
									type="submit"
									onClick={() => this.handleSubmit()}
								>
									บันทึกใบสั่งซื้อ
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	jobs: state.record.jobs,
	selectedBranches: state.record.selectedBranches
});
const mapDispatchToProps = {
	setSelectedBranches
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddPO);
