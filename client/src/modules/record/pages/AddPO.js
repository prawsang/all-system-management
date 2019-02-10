import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import CustomerSearch from "../components/search/CustomerSearch";
import BranchSearch from "../components/search/BranchSearch";
import JobSelect from "../components/JobSelect";
import { connect } from "react-redux";
import { setSelectedBranches, resetRecordData } from "@/actions/record";
import history from "@/common/history";

class AddPO extends React.Component {
	state = {
		poNumber: "",
		installed: false,
		date: ""
	};

	async handleSubmit() {
		const { selectedBranches, selectedJobCode } = this.props;
		const { poNumber, installed, description, date } = this.state;
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
	componentDidMount() {
		this.props.resetRecordData();
	}
	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const { poNumber, installed, description, date } = this.state;
		const {
			selectedCustomer,
			selectedBranches,
			setSelectedBranches,
			selectedJobCode
		} = this.props;
		return (
			<div className="content">
				<h3>บันทึกใบสั่งซื้อ (PO)</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="is-flex is-fullwidth is-ai-flex-end">
							<div className="field">
								<label className="label">PO Number</label>
								<input
									className="input is-fullwidth"
									placeholder="PO Number"
									value={poNumber}
									onChange={e => this.setState({ poNumber: e.target.value })}
								/>
							</div>
							<div className="field is-flex is-ai-flex-end has-ml-10">
								<div className="is-flex is-ai-center">
									<label className="label">ติดตั้งแล้ว:</label>
									<input
										className="checkbox"
										onChange={() => this.setState({ installed: !installed })}
										type="checkbox"
										checked={installed}
										name="installed"
									/>
								</div>
							</div>
						</div>
						<label className="label">Description</label>
						<div className="field">
							<textarea
								className="input textarea is-fullwidth"
								placeholder="Description"
								value={description}
								onChange={e => this.setState({ description: e.target.value })}
							/>
						</div>
						<div className="field">
							<label className="label">PO Date</label>
							<input
								className="input is-fullwidth"
								placeholder="Date"
								type="date"
								value={date}
								onChange={e => this.setState({ date: e.target.value })}
							/>
						</div>
						<hr />
						<CustomerSearch />
						<JobSelect disabled={!selectedCustomer} />
						<BranchSearch disabled={selectedJobCode === "" || !selectedJobCode} />
						<div style={{ margin: "2em 0" }}>
							<h6>สาขาที่เลือกไว้</h6>
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
								<p className="is-gray-3">ยังไม่ได้เลือกสาขา</p>
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
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranches: state.record.selectedBranches,
	selectedJobCode: state.record.selectedJobCode
});
const mapDispatchToProps = {
	setSelectedBranches,
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddPO);
