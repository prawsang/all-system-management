import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class Edititem extends React.Component {
	state = {
		type: "",
		model: "",
		models: [],
		remarks: ""
	};

	getModelsOfType = type => {
		if (type !== "") {
			Axios.get(`/model/type/${type}`)
				.then(res => {
					this.setState({ models: res.data.models });
					console.log(res);
				})
				.catch(err => console.log(err));
		}
	};

	edit() {
		const { model, remarks } = this.state;
		const { item } = this.props;
		Axios.request({
			method: "PUT",
			url: `/stock/${item.serial_no}/edit`,
			data: {
				model_id: model,
				remarks
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}

	componentDidMount() {
		const { item } = this.props;
		this.setState({ model: item.model.id, type: item.model.type, remarks: item.remarks });
		this.getModelsOfType(item.model.type);
	}

	render() {
		const { type, models, model, remarks } = this.state;
		const { close, active } = this.props;

		return (
			<Modal active={active} close={close} title="Edit Item">
				<div className="form">
					<div className="field is-flex is-ai-center">
						<label className="label">Type:</label>
						<div className="select no-mb">
							<select
								value={type}
								onChange={e => {
									this.setState({ type: e.target.value });
									this.getModelsOfType(e.target.value);
								}}
							>
								<option disabled={true}>Select Type</option>
								<option value="POS">POS</option>
								<option value="SCANNER">Scanner</option>
								<option value="PRINTER">Printer</option>
								<option value="KEYBOARD">Keyboard</option>
								<option value="MONITOR">Monitor</option>
								<option value="CASH_DRAWER">Cash Drawer</option>
							</select>
						</div>
					</div>
					<div className="field is-flex is-ai-center">
						<label className="label">Model:</label>
						<div className={`select no-mb ${type === "" && "is-disabled"}`}>
							<select
								value={model}
								onChange={e => this.setState({ model: e.target.value })}
								disabled={type === ""}
							>
								<option disabled={true}>เลือกรุ่น</option>
								{models.length > 0 ? (
									models.map((e, i) => (
										<option value={e.id} key={e.id + i}>
											{e.name}
										</option>
									))
								) : (
									<option value="" disabled>
										No Models
									</option>
								)}
							</select>
						</div>
					</div>
					<div className="field">
						<label className="label">Remarks</label>
						<textarea
							className="input textarea is-fullwidth"
							placeholder="Remarks"
							onChange={e => this.setState({ remarks: e.target.value })}
							value={remarks}
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

export default Edititem;
