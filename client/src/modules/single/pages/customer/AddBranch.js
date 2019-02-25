import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class AddBranch extends React.Component {
	state = {
		branchCode: "",
		name: "",
		address: "",
		province: "",
		storeTypeId: 0,
		storeTypes: [],
		selectedJobs: []
	};
	componentDidMount() {
		Axios.get("/store-type/get-all")
			.then(res => this.setState({ storeTypes: res.data.types }))
			.catch(err => console.log(err));
	}

	toggleSelectJob(checked, jobCode) {
		const { selectedJobs } = this.state;
		if (checked) {
			this.setState({ selectedJobs: [...selectedJobs, jobCode] });
		} else {
			const find = selectedJobs.indexOf(jobCode);
			if (find > -1) {
				this.setState({
					selectedJobs: selectedJobs
						.slice(0, find)
						.concat(selectedJobs.slice(find + 1, selectedJobs.length))
				});
			}
		}
	}

	addBranch() {
		const { branchCode, name, address, province, storeTypeId, selectedJobs } = this.state;
		const { customer } = this.props;
		Axios.request({
			method: "POST",
			url: "/branch/add",
			data: {
				customer_code: customer.customer_code,
				branch_code: branchCode,
				job_code: selectedJobs,
				name,
				address,
				province,
				store_type_id: storeTypeId
			}
		}).catch(err => console.log(err));
	}

	render() {
		const { branchCode, name, address, province, storeTypeId, storeTypes } = this.state;
		const { close, active, customer } = this.props;

		return (
			<Modal active={active} close={close} title="Add New Branch">
				<div className="form">
					<p>
						ลูกค้า: <b>{customer && customer.name}</b>
					</p>
					<div className="field">
						<label className="label">Branch Code</label>
						<input
							className="input is-fullwidth"
							placeholder="Branch Code"
							onChange={e => this.setState({ branchCode: e.target.value })}
							value={branchCode}
						/>
					</div>
					<div className="field">
						<label className="label">Branch Name</label>
						<input
							className="input is-fullwidth"
							placeholder="Branch Name"
							onChange={e => this.setState({ name: e.target.value })}
							value={name}
						/>
					</div>
					<div className="field">
						<label className="label">Address</label>
						<input
							className="input is-fullwidth"
							placeholder="Address"
							onChange={e => this.setState({ address: e.target.value })}
							value={address}
						/>
					</div>
					<div className="field">
						<label className="label">Province</label>
						<input
							className="input is-fullwidth"
							placeholder="Province"
							onChange={e => this.setState({ province: e.target.value })}
							value={province}
						/>
					</div>
					<div className="field">
						<label className="label">Store Type</label>
						<div className="select">
							<select
								className="select is-fullwidth"
								onChange={e => this.setState({ storeTypeId: e.target.value })}
								value={storeTypeId}
							>
								{storeTypes.map((e, i) => (
									<option value={e.id} key={i + e.id}>
										{e.name}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="has-mb-10">
						<label className="label">Jobs</label>
						{customer &&
							(customer.jobs.length > 0 ? (
								customer.jobs.map((e, i) => (
									<div
										className="field is-flex is-ai-center has-mb-05"
										key={e.name + i}
									>
										<input
											className="checkbox"
											type="checkbox"
											onChange={ev =>
												this.toggleSelectJob(ev.target.checked, e.job_code)
											}
										/>
										<label className="has-ml-05">{e.name}</label>
									</div>
								))
							) : (
								<p>ลูกค้าท่านนี้ยังไม่มี Job</p>
							))}
					</div>
					<div className="buttons">
						<button className="button" onClick={() => this.addBranch()}>
							Add Branch
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

export default AddBranch;
