import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditJob extends React.Component {
	state = {
		name: ""
	};

	edit() {
		const { name } = this.state;
		const { job } = this.props;
		Axios.request({
			method: "PUT",
			url: `/job/${job.job_code}/edit`,
			data: {
				customer_code: job.customer_code,
				name
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { job } = this.props;
		this.setState({ name: job.name });
	}

	render() {
		const { name } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Job">
				<div className="form">
					<div className="field">
						<label className="label">Job Name</label>
						<input
							className="input is-fullwidth"
							placeholder="job Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.edit()}>
							Edit
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

export default EditJob;
