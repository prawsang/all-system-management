import React from "react";
import Axios from "axios";
import CustomerSearch from "../components/search/CustomerSearch";
import JobSelect from "../components/JobSelect";
import { connect } from "react-redux";
import { setSelectedBranches, resetRecordData } from "@/actions/record";
import history from "@/common/history";

class AddPO extends React.Component {
	state = {
		poNumber: "",
		date: ""
	};

	async handleSubmit() {
		const { selectedJobCode } = this.props;
		const { poNumber, description, date } = this.state;
		await Axios.request({
			url: "/po/add",
			method: "POST",
			data: {
				po_number: poNumber,
				description,
				date,
				job_code: selectedJobCode
			}
		}).then(res => {
			history.push(`/single/po/${poNumber}`);
		});
	}
	componentDidMount() {
		this.props.resetRecordData();
	}
	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const { poNumber, description, date } = this.state;
		const { selectedCustomer } = this.props;
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
