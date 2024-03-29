import React from "react";
import Modal from "@/common/components/Modal";
import Axios from "axios";

class Edititem extends React.Component {
	state = {
		type: "",
		model: "",
		models: [],
		remarks: "",
		stockLocation: "",
		poNumber: "",
		prNumber: ""
	};

	getModelsOfType = type => {
		if (type !== "") {
			Axios.get(`/model/type/${type}`).then(res => {
				this.setState({ models: res.data.rows });
			});
		}
	};

	edit() {
		const { model, remarks, stockLocation, poNumber, prNumber } = this.state;
		const { item } = this.props;
		Axios.request({
			method: "PUT",
			url: `/stock/${item.serial_no}/edit`,
			data: {
				model_id: model,
				remarks,
				stock_location: stockLocation,
				po_number: poNumber,
				prNumber: prNumber
			}
		}).then(res => window.location.reload());
	}

	componentDidMount() {
		const { item } = this.props;
		this.setState({
			model: item.model.id,
			type: item.model.type,
			remarks: item.remarks,
			stockLocation: item.stock_location,
			poNumber: item.po_number,
			prNumber: item.pr_number
		});
		this.getModelsOfType(item.model.type);
	}

	render() {
		const { type, models, model, remarks, stockLocation, poNumber, prNumber } = this.state;
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
										<option value={e.model_id} key={e.model_id + i}>
											{e.model_name}
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
						<label className="label">Stock Location</label>
						<input
							className="input is-fullwidth"
							placeholder="Stock Location"
							onChange={e => this.setState({ stockLocation: e.target.value })}
							value={stockLocation}
						/>
					</div>
					<div className="field">
						<label className="label">PO Number:</label>
						<input
							className="input is-fullwidth"
							placeholder="PO Number"
							value={poNumber}
							onChange={e => this.setState({ poNumber: e.target.value })}
						/>
					</div>
					<div className="field">
						<label className="label">PR Number:</label>
						<input
							className="input is-fullwidth"
							placeholder="PR Number"
							value={prNumber}
							onChange={e => this.setState({ prNumber: e.target.value })}
						/>
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
