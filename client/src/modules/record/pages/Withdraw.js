import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CustomerSearch from "../components/search/CustomerSearch";
import JobSelect from "../components/JobSelect";
import BranchSearch from "../components/search/BranchSearch";
import { connect } from "react-redux";
import Axios from "axios";

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
		serialNos: [],
		serialNo: "",
		remarks: ""
	};

	handleAddSerial(e) {
		e.preventDefault();
		this.setState({
			serialNos: [...this.state.serialNos, this.state.serialNo],
			serialNo: ""
		});
	}

	async handleSubmit() {
		const {
			type,
			date,
			returnDate,
			installDate,
			poNumber,
			doNumber,
			serialNos,
			remarks
		} = this.state;
		const { selectedBranches, selectedJobCode } = this.props;
		let id = "";

		try {
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
					staff_code: "020", //hard code
					job_code: selectedJobCode,
					branch_id: selectedBranches[0].id,
					remarks,
					has_po: type === INSTALLATION
				}
			}).then(res => (id = res.data.id));
		} catch (err) {
			console.log(err);
			return;
		}

		let url = "";
		switch (type) {
			case INSTALLATION:
				url = `/withdrawal/${id}/add-items/install`;
				break;
			case BORROW:
				url = `/withdrawal/${id}/add-items/borrow`;
				break;
			case TRANSFER:
				url = `/withdrawal/${id}/add-items/transfer`;
				break;
			default:
				return;
		}

		try {
			await Axios.request({
				method: "PUT",
				url,
				data: {
					serial_no: serialNos
				}
			});
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const {
			type,
			date,
			returnDate,
			installDate,
			poNumber,
			doNumber,
			serialNos,
			serialNo,
			remarks
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
							<Field
								type="date"
								placeholder="Install Date"
								label="Install Date"
								value={installDate}
								onChange={e => this.setState({ installDate: e.target.value })}
							/>
						)}
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
						<hr />
						<label className="label" style={{ display: "block" }}>
							Serial No.
						</label>
						<form onSubmit={e => this.handleAddSerial(e)}>
							<div className="field is-flex">
								<input
									value={serialNo}
									onChange={e => this.setState({ serialNo: e.target.value })}
									className="input is-fullwidth"
									placeholder="Serial No."
								/>
								<button className="button has-ml-05" type="submit">
									Add
								</button>
							</div>
						</form>
						<div style={{ margin: "2em 0" }}>
							<small className="label" style={{ display: "block" }}>
								Scanned Serial No.
							</small>
							{serialNos.length > 0 ? (
								serialNos.map((e, i) => (
									<div key={i + e} className="has-mb-05">
										{i + 1}) <span className="is-bold">{e}</span>
										<button
											className="is-danger has-ml-10 button"
											style={{ padding: "5px 10px" }}
											onClick={() =>
												this.setState({
													serialNos: serialNos
														.slice(0, i)
														.concat(
															serialNos.slice(i + 1, serialNos.length)
														)
												})
											}
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</div>
								))
							) : (
								<p className="is-gray-3 has-mt-10">ยังไม่ได้ Scan</p>
							)}
						</div>
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							ยืนยันการเบิกสินค้า
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

export default connect(
	mapStateToProps,
	null
)(Withdraw);
