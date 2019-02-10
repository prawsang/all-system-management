import React from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class AddItems extends React.Component {
	state = {
		type: "",
		model: "",
		models: [],
		remarks: "",
		serialNos: [],
		serialNo: ""
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

	handleAddSerial(e) {
		e.preventDefault();
		this.setState({
			serialNos: [...this.state.serialNos, this.state.serialNo],
			serialNo: ""
		});
	}

	handleSubmit() {
		const { model, remarks, serialNos } = this.state;
		Axios.request({
			method: "POST",
			url: "/stock/add",
			data: {
				model_id: model,
				serial_no: serialNos,
				remarks
			}
		})
			.then(res => this.resetPage())
			.catch(err => {
				console.log(err);
				this.resetPage();
			});
	}

	resetPage() {
		this.setState({
			type: "",
			model: "",
			models: [],
			remarks: "",
			serialNos: [],
			serialNo: ""
		});
	}

	render() {
		const { type, models, model, remarks, serialNos, serialNo } = this.state;

		return (
			<div className="content">
				<h3>รับของเข้า Stock</h3>
				<div className="panel">
					<div className="panel-content">
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
									<option value="">Select Type</option>
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
									<option value="">เลือกรุ่น</option>
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
							<label className="label">Remarks:</label>
							<textarea
								className="input textarea is-fullwidth"
								placeholder="Remarks"
								value={remarks}
								onChange={e => this.setState({ remarks: e.target.value })}
							/>
						</div>
						<label className="label">Serial No.</label>
						<form onSubmit={e => this.handleAddSerial(e)}>
							<div className="field is-flex">
								<input
									value={serialNo}
									onChange={e => this.setState({ serialNo: e.target.value })}
									className="input is-fullwidth"
									placeholder="Serial No."
								/>
								<button className="button has-ml-05" type="submit">
									Add
								</button>
							</div>
						</form>
						<label className="label">Scanned Serial No.</label>
						{serialNos.length > 0 ? (
							serialNos.map((e, i) => (
								<div key={i + e} className="has-mb-05">
									{i + 1}) <span className="is-bold">{e}</span>
									<button
										className="is-danger has-ml-10 button"
										style={{ padding: "5px 10px" }}
										onClick={() =>
											this.setState({
												serialNos: serialNos
													.slice(0, i)
													.concat(
														serialNos.slice(i + 1, serialNos.length)
													)
											})
										}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							))
						) : (
							<p className="is-gray-3">ยังไม่ได้ Scan</p>
						)}
						<button className="button has-mt-10" onClick={() => this.handleSubmit()}>
							ยื่นยันการรับของ
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default AddItems;
