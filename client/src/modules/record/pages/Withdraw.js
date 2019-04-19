import React from "react";
import CustomerSearch from "../components/search/CustomerSearch";
import JobSelect from "../components/JobSelect";
import BranchSearch from "../components/search/BranchSearch";
import { connect } from "react-redux";
import Axios from "axios";
import { resetRecordData } from "@/actions/record";
import history from "@/common/history";

const INSTALLATION = "INSTALLATION";
const BORROW = "BORROW";
const TRANSFER = "TRANSFER";

class Withdraw extends React.Component {
	state = {
		type: INSTALLATION,
		date: "",
		returnDate: "",
		installDate: "",
		poNumber: "",
		doNumber: "",
		remarks: "",
		staffName: ""
	};

	async handleSubmit() {
		const {
			type,
			date,
			returnDate,
			installDate,
			poNumber,
			doNumber,
			remarks,
			staffName
		} = this.state;
		const { selectedBranches, selectedJobCode } = this.props;

		await Axios.request({
			method: "POST",
			url: "/withdrawal/add",
			data: {
				type,
				date,
				return_by: type === BORROW ? returnDate : null,
				install_date: type === INSTALLATION ? installDate : null,
				po_number: type === INSTALLATION ? poNumber : null,
				do_number: type === INSTALLATION ? doNumber : null,
				job_code: selectedJobCode,
				branch_id: selectedBranches[0].id,
				remarks,
				billed: false,
				staff_name: staffName
			}
		}).then(res => history.push(`/single/withdrawal/${res.data.id}`));
	}

	componentDidMount() {
		this.props.resetRecordData();
	}
	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const {
			type,
			date,
			returnDate,
			installDate,
			poNumber,
			doNumber,
			remarks,
			staffName
		} = this.state;
		const { selectedCustomer, selectedJobCode } = this.props;

		return (
			<div className="content">
				<h3>เบิกสินค้า</h3>
				<div className="panel">
					<div className="panel-content">
						<div className="field is-flex is-ai-center">
							<label className="label has-mr-05 is-bold">Type:</label>
							<div className="select no-mb">
								<select
									value={type}
									onChange={e => {
										this.setState({ type: e.target.value });
									}}
								>
									<option value={INSTALLATION}>เบิกไปติดตั้ง</option>
									<option value={BORROW}>ยืมสินค้า</option>
									<option value={TRANSFER}>โอนสินค้าไปยัง Service Stock</option>
								</select>
							</div>
						</div>
						<Field
							type="date"
							placeholder="Date"
							label="Date"
							value={date}
							onChange={e => this.setState({ date: e.target.value })}
						/>
						<Field
							type="text"
							placeholder="Staff Name"
							label="ผู้เบิก"
							value={staffName}
							onChange={e => this.setState({ staffName: e.target.value })}
						/>
						{type === BORROW && (
							<Field
								type="date"
								placeholder="Return Date"
								label="Return Date"
								value={returnDate}
								onChange={e => this.setState({ returnDate: e.target.value })}
							/>
						)}
						{type === INSTALLATION && (
							<React.Fragment>
								<Field
									type="date"
									placeholder="Install Date"
									label="Install Date"
									value={installDate}
									onChange={e => this.setState({ installDate: e.target.value })}
								/>
								<hr />
								<Field
									type="text"
									placeholder="PO Number"
									label="PO Number"
									value={poNumber}
									onChange={e => this.setState({ poNumber: e.target.value })}
								/>
								<Field
									type="text"
									placeholder="DO Number"
									label="DO Number"
									value={doNumber}
									onChange={e => this.setState({ doNumber: e.target.value })}
								/>
							</React.Fragment>
						)}
						<hr />
						<CustomerSearch />
						<JobSelect disabled={!selectedCustomer} />
						<BranchSearch
							disabled={selectedJobCode === "" || !selectedJobCode}
							single={true}
						/>
						<hr />
						<div className="field">
							<label className="label" style={{ display: "block" }}>
								Remarks:
							</label>
							<textarea
								type="text"
								value={remarks}
								onChange={e => this.setState({ remarks: e.target.value })}
								placeholder="Remarks"
								className="input textarea is-fullwidth"
							/>
						</div>
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							เปิดใบเบิกสินค้า
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const Field = ({ value, onChange, placeholder, className, label, type, inputClass }) => (
	<div className={className ? className : "field is-flex is-ai-center"}>
		<label className="label">{label}:</label>
		<input
			type={type ? type : "text"}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={`input ${inputClass}`}
		/>
	</div>
);

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranches: state.record.selectedBranches,
	selectedJobCode: state.record.selectedJobCode
});

const mapDispatchToProps = {
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Withdraw);
