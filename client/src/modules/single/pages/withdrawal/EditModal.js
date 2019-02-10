import React from "react";
import Modal from "@/common/components/Modal";
import Field from "../../components/Field";
import Axios from "axios";

class EditModal extends React.Component {
	state = {
		date: "",
		poNumber: "",
		doNumber: "",
		remarks: "",
		installDate: "",
		returnDate: ""
	};

	componentDidMount() {
		const { date, po_number, do_number, remarks, install_date, return_by } = this.props.data;

		this.setState({
			date: date ? date : "",
			poNumber: po_number ? po_number : "",
			doNumber: do_number ? do_number : "",
			remarks: remarks ? remarks : "",
			installDate: install_date ? install_date : "",
			returnDate: return_by ? return_by : ""
		});
	}

	handleEdit() {
		const { data } = this.props;
		const { date, poNumber, doNumber, installDate, returnDate } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.id}/edit`,
			data: {
				job_code: data.po ? data.po.job_code : data.job_code,
				branch_id: data.branch_id,
				po_number: poNumber,
				do_number: doNumber,
				staff_code: "020", //hard code
				type: data.type,
				return_by: returnDate,
				date,
				install_date: installDate,
				has_po: data.has_po
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}

	render() {
		const { active, close, data } = this.props;
		const { date, poNumber, doNumber, installDate, returnDate } = this.state;
		return (
			<Modal active={active} close={close} title="แก้ไขใบเบิก">
				<Field editable={false} value={data.id} label="หมายเลขใบเบิก" />
				<Field editable={false} value={data.type} label="Type" />
				<Field
					editable={true}
					type="date"
					label="Date"
					value={date}
					onChange={e => this.setState({ date: e.target.value })}
				/>
				{data.type === "BORROW" && (
					<Field
						editable={true}
						type="date"
						label="Return Date"
						value={returnDate}
						onChange={e => this.setState({ returnDate: e.target.value })}
					/>
				)}
				{data.type === "INSTALLATION" && (
					<Field
						editable={true}
						type="date"
						label="Install Date"
						value={installDate}
						onChange={e => this.setState({ installDate: e.target.value })}
					/>
				)}
				<Field
					editable={data.has_po}
					type="text"
					label="PO Number"
					value={poNumber}
					text={data.has_po || "ไม่มี PO"}
					onChange={e => this.setState({ poNumber: e.target.value })}
				/>
				<Field
					editable={true}
					type="text"
					label="DO Number"
					value={doNumber}
					onChange={e => this.setState({ doNumber: e.target.value })}
				/>
				<div className="buttons">
					<button className="button" onClick={() => this.handleEdit()}>
						ยืนยันการแก้ไข
					</button>
					<button className="button is-light" onClick={close}>
						Cancel
					</button>
				</div>
			</Modal>
		);
	}
}

export default EditModal;
