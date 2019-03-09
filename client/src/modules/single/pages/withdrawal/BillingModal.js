import React from "react";
import Axios from "axios";
import Modal from "@/common/components/Modal";

class BillingModal extends React.Component {
	state = {
		billed: ""
	};
	componentDidMount() {
		const { data } = this.props;
		this.setState({
			billed: data.billed ? data.billed : false
		});
	}
	editBilling() {
		const { data } = this.props;
		const { billed } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit-billing`,
			data: {
				billed
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}
	render() {
		const { active, close } = this.props;
		const { billed } = this.state;
		return (
			<Modal active={active} close={close} title="Edit Billing">
				<div className="field is-flex is-ai-center">
					<label className="label">Billing</label>
					<input
						type="checkbox"
						className="checkbox"
						value={billed}
						onChange={e => this.setState({ billed: e.target.value })}
					/>
				</div>
				<div className="buttons">
					<button className="button" onClick={() => this.editBilling()}>
						Edit
					</button>
					<button className="button is-light" onClick={close}>
						Cancel
					</button>
				</div>
			</Modal>
		);
	}
}

export default BillingModal;
