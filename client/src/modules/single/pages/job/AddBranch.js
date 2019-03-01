import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";
import BranchSearch from "./BranchSearch";
import { connect } from "react-redux";
import { setSelectedCustomer } from "@/actions/record";

class EditJob extends React.Component {
	state = {
		name: ""
	};

	addBranch() {
		const { job, selectedBranches } = this.props;
		let branchIds = [];
		selectedBranches.forEach(e => branchIds.push(e.id));
		Axios.request({
			method: "POST",
			url: `/job/${job.job_code}/add-branch`,
			data: {
				branch_id: branchIds
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}

	componentDidMount() {
		const { job, setSelectedCustomer } = this.props;
		this.setState({ name: job.name });
		setSelectedCustomer({
			customer_code: job.customer_code
		});
	}

	render() {
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Add Branches to Job">
				<div className="form">
					<BranchSearch />
					<div className="buttons">
						<button className="button" onClick={() => this.addBranch()}>
							Add Branches
						</button>
						<button className="button is-light" onClick={close}>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => ({
	selectedBranches: state.record.selectedBranches
});

const mapDispatchToProps = {
	setSelectedCustomer
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditJob);
