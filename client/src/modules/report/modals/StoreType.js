import React from "react";
import Axios from "axios";

class NewStoreType extends React.Component {
	state = {
		storeTypeName: ""
	};
	componentDidMount() {
		const { modalType, data } = this.props;
		if (modalType === "EDIT") {
			this.setState({
				storeTypeName: data.name
			});
		}
	}
	handleSubmit() {
		const { storeTypeName } = this.state;
		const { modalType, data } = this.props;
		Axios.request({
			method: modalType === "EDIT" ? "PUT" : "POST",
			url: modalType === "EDIT" ? `store-type/${data.id}/edit` : "/store-type/add",
			data: {
				name: storeTypeName
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}
	render() {
		const { storeTypeName } = this.state;
		return (
			<div>
				<div className="field">
					<label className="label">Store Type Name</label>
					<input
						className="input is-fullwidth"
						placeholder="Store Type Name"
						value={storeTypeName}
						onChange={e => this.setState({ storeTypeName: e.target.value })}
					/>
				</div>
				<button className="button" onClick={() => this.handleSubmit()}>
					Add
				</button>
			</div>
		);
	}
}

export default NewStoreType;
