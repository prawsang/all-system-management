import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class AddJob extends React.Component {
	state = {
		jobCode: "",
		name: ""
	};

	addJob() {
		const { name, jobCode } = this.state;
		const { customer } = this.props;
		Axios.request({
			method: "POST",
			url: "/job/add",
			data: {
				customer_code: customer.customer_code,
				job_code: jobCode,
				name
			}
		}).then(res => window.location.reload());
	}

	render() {
		const { name, jobCode } = this.state;
		const { close, active, customer } = this.props;

		return (
			<Modal active={active} close={close} title="Add New Job">
				<div className="form">
					<p>
						ลูกค้า: <b>{customer && customer.name}</b>
					</p>
					<div className="field">
						<label className="label">Job Code</label>
						<input
							className="input is-fullwidth"
							placeholder="Job Code"
							onChange={e => this.setState({ jobCode: e.target.value })}
							value={jobCode}
						/>
					</div>
					<div className="field">
						<label className="label">Job Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Job Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.addJob()}>
							Add Job
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

export default AddJob;
