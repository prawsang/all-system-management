import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class EditBranch extends React.Component {
	state = {
		name: "",
		branchCode: "",
		address: "",
		province: "",
		storeTypeId: 0,
		storeTypes: []
	};

	edit() {
		const { branchCode, name, address, province, storeTypeId } = this.state;
		const { branch } = this.props;
		Axios.request({
			method: "PUT",
			url: `/branch/${branch.id}/edit`,
			data: {
				name,
				branch_code: branchCode,
				address,
				province,
				store_type_id: storeTypeId,
				customer_code: branch.customer_code
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}

	componentDidMount() {
		const { branch } = this.props;
		Axios.get("/store-type/get-all")
			.then(res => this.setState({ storeTypes: res.data.types }))
			.catch(err => console.log(err));
		this.setState({
			name: branch.name,
			branchCode: branch.branch_code,
			address: branch.address,
			province: branch.province,
			storeTypeId: branch.store_type_id
		});
	}

	render() {
		const { branchCode, name, address, province, storeTypeId, storeTypes } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Add New Job">
				<div className="form">
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
								className="select is-fullwidth "
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

export default EditBranch;
