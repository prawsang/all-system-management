import React from "react";
import Table from "@/modules/single/components/Table";
import ItemsTable from "@/modules/single/tables/items";
import { BranchData, CustomerData, JobData } from "../../data/";
import Modal from "@/common/components/Modal";
import Field from "@/modules/single/components/Field";
import Axios from "axios";

class Withdrawal extends React.PureComponent {
	state = {
		edit: false,
		date: "",
		poNumber: "",
		doNumber: "",
		remarks: "",
		installDate: "",
		returnDate: ""
	};

	handleEdit() {
		const { data } = this.props;
		const { date, poNumber, doNumber, installDate, returnDate } = this.state;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.withdrawal.id}/edit`,
			data: {
				job_code: data.withdrawal.po
					? data.withdrawal.po.job_code
					: data.withdrawal.job_code,
				branch_id: data.withdrawal.branch_id,
				po_number: poNumber,
				do_number: doNumber,
				staff_code: "020", //hard code
				type: data.withdrawal.type,
				return_by: returnDate,
				date,
				install_date: installDate,
				has_po: data.withdrawal.has_po
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}

	render() {
		const { data } = this.props;
		const { edit, date, poNumber, doNumber, remarks, installDate, returnDate } = this.state;
		if (data) {
			if (!data.withdrawal) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>ใบเบิกหมายเลข {data && data.withdrawal.id}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<h5 className="no-mt has-mb-10">
										ใบเบิก
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() =>
												this.setState({
													edit: true,
													date: data.withdrawal.date,
													poNumber: data.withdrawal.po_number,
													doNumber: data.withdrawal.do_number,
													installDate: data.withdrawal.install_date,
													returnDate: data.withdrawal.return_by
												})
											}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date:</label>
										<span>{data.withdrawal.date}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">PO:</label>
										<span>
											{data.withdrawal.has_po
												? data.withdrawal.po_number
													? data.withdrawal.po_number
													: "ยังไม่ได้รับ PO"
												: "ไม่มี PO"}
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">DO Number:</label>
										<span>{data.withdrawal.do_number}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.withdrawal.status}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">ผู้เบิก:</label>
										<span>
											{data.withdrawal.user.name} (
											{data.withdrawal.user.department})
										</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Type:</label>
										<span>{data.withdrawal.type}</span>
									</div>
									{data.withdrawal.type === "BORROW" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Return By:</label>
											<span>{data.withdrawal.return_by}</span>
										</div>
									)}
									{data.withdrawal.type === "INSTALLATION" && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">
												Install Date:
											</label>
											<span>{data.withdrawal.install_date}</span>
										</div>
									)}
								</div>
								<hr />
								<div>
									<h5 className="has-mb-10 has-mt-10">Remarks</h5>
									<div className="has-mb-10">
										<span>
											{data.withdrawal.remarks
												? data.withdrawal.remarks
												: "No Remarks"}
										</span>
									</div>
								</div>
								<hr />
								<CustomerData data={data.withdrawal.branch.customer} />
								<hr />
								<JobData
									data={
										data.withdrawal.po
											? data.withdrawal.po.job
											: data.withdrawal.job
									}
								/>
								<hr />
								<BranchData data={data.withdrawal.branch} />
								<hr />
							</div>
							<Table
								data={data}
								table={data => <ItemsTable data={data.withdrawal} />}
								className="no-pt"
								title="Items"
								noPage={true}
							/>
						</React.Fragment>
					)}
				</div>
				<Modal
					active={edit}
					close={() => this.setState({ edit: false })}
					title="แก้ไขใบเบิก"
				>
					{data && (
						<div>
							<Field
								editable={false}
								value={data.withdrawal.id}
								label="หมายเลขใบเบิก"
							/>
							<Field editable={false} value={data.withdrawal.type} label="Type" />
							<Field
								editable={true}
								type="date"
								label="Date"
								value={date}
								onChange={e => this.setState({ date: e.target.value })}
							/>
							{data.withdrawal.type === "BORROW" && (
								<Field
									editable={true}
									type="date"
									label="Return Date"
									value={returnDate}
									onChange={e => this.setState({ returnDate: e.target.value })}
								/>
							)}
							{data.withdrawal.type === "INSTALLATION" && (
								<Field
									editable={true}
									type="date"
									label="Install Date"
									value={installDate}
									onChange={e => this.setState({ installDate: e.target.value })}
								/>
							)}
							<Field
								editable={data.withdrawal.has_po}
								type="text"
								label="PO Number"
								value={poNumber}
								text={data.withdrawal.has_po || "ไม่มี PO"}
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
								<button
									className="button is-light"
									onClick={() => this.setState({ edit: false })}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</Modal>
			</React.Fragment>
		);
	}
}

export default Withdrawal;
