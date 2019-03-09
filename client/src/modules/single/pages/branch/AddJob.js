import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditBranch extends React.Component {
	state = {
		selectedJobCode: "",
		jobs: []
	};

	edit() {
		const { selectedJobCode } = this.state;
		const { branch } = this.props;
		Axios.request({
			method: "POST",
			url: `/branch/${branch.id}/add-job`,
			data: {
				job_code: [selectedJobCode]
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { branch } = this.props;
		Axios.get(`/customer/${branch.customer_code}/details`).then(
			res => res.data.customer.jobs && this.setState({ jobs: res.data.customer.jobs })
		);
	}

	render() {
		const { selectedJobCode, jobs } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Add Job to Branch">
				<div className="form">
					<div className="field">
						<label className="label">Job:</label>
						<div className="select">
							<select
								value={selectedJobCode}
								onChange={e => this.setState({ selectedJobCode: e.target.value })}
							>
								<option value="">--</option>
								{jobs.map((e, i) => (
									<option value={e.job_code} key={i}>
										{e.name} ({e.job_code})
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.edit()}>
							Add
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

export default EditBranch;
