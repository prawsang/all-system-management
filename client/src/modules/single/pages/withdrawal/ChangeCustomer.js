import React from "react";
import Modal from "@/common/components/Modal";
import { connect } from "react-redux";
import {
	setSelectedCustomer,
	setSelectedJobCode,
	setSelectedBranches,
	resetRecordData
} from "@/actions/record";
import CustomerSearch from "@/modules/record/components/search/CustomerSearch";
import BranchSearch from "@/modules/record/components/search/BranchSearch";
import JobSelect from "@/modules/record/components/JobSelect";
import Axios from "axios";

class ChangeCustomer extends React.Component {
	componentDidMount() {
		this.props.resetRecordData();

		const { job_code, branch, po } = this.props.data;
		const { setSelectedCustomer, setSelectedJobCode, setSelectedBranches } = this.props;
		setSelectedCustomer(branch.customer);
		setSelectedJobCode(po ? po.job_code : job_code);
		setSelectedBranches([branch]);
	}

	handleEdit() {
		const { data, selectedJobCode, selectedBranches } = this.props;
		const {
			job_code,
			po_number,
			do_number,
			type,
			return_by,
			date,
			install_date,
			has_po,
			staff_name
		} = data;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit`,
			data: {
				job_code: selectedJobCode,
				branch_id: selectedBranches[0].id,
				po_number: po_number,
				do_number: do_number,
				staff_name: staff_name,
				type: type,
				return_by: return_by,
				date: date,
				install_date: install_date,
				has_po: has_po
			}
		}).then(res => window.location.reload());
	}

	componentWillUnmount() {
		this.props.resetRecordData();
	}

	render() {
		const { close, active, selectedCustomer, selectedJobCode, data } = this.props;
		if (!data) return <p />;

		return (
			<Modal close={close} active={active}>
				<div className="field">
					<label className="label has-mb-05">Customer Name:</label>
					<CustomerSearch />
				</div>
				<div className="field">
					<label className="label has-mb-05">Job:</label>
					<JobSelect disabled={!selectedCustomer} />
				</div>
				<div className="field">
					<label className="label has-mb-05">Branch Name:</label>
					<BranchSearch single={true} disabled={!selectedJobCode} />
				</div>
				<div className="buttons no-mb">
					<button className="button" onClick={() => this.handleEdit()}>
						Change
					</button>
					<button className="button is-light" onClick={close}>
						Cancel
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => ({
	selectedCustomer: state.record.selectedCustomer,
	selectedBranches: state.record.selectedBranches,
	selectedJobCode: state.record.selectedJobCode
});

const mapDispatchToProps = {
	setSelectedCustomer,
	setSelectedJobCode,
	setSelectedBranches,
	resetRecordData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangeCustomer);
