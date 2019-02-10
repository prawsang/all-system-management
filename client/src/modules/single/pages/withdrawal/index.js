import React from "react";
import Table from "@/modules/single/components/Table";
import ItemsTable from "@/modules/single/tables/items";
import { BranchData, CustomerData, JobData } from "../../data/";
import Modal from "@/common/components/Modal";
import EditModal from "./EditModal";
import RemarksModal from "./RemarksModal";
import ChangeCustomer from "./ChangeCustomer";
import Axios from "axios";

class Withdrawal extends React.PureComponent {
	state = {
		edit: false,
		showCancelConfirm: false,
		editRemarks: false,
		changeCustomer: false
	};

	cancelWithdrawal() {
		const { data } = this.props;
		Axios.request({
			method: "PUT",
			url: `/withdrawal/${data.withdrawal.id}/change-status`,
			data: {
				status: "CANCELLED"
			}
		})
			.then(res => window.location.reload())
			.catch(err => console.log(err));
	}

	render() {
		const { data } = this.props;
		const { edit, showCancelConfirm, editRemarks, changeCustomer } = this.state;
		if (data) {
			if (!data.withdrawal) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>ใบเบิกหมายเลข {data && data.withdrawal.id}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb" style={{ position: "relative" }}>
								<div style={{ float: "right" }}>
									<button
										className="button is-danger"
										onClick={() =>
											this.setState({
												showCancelConfirm: true
											})
										}
										disabled={data.withdrawal.status === "CANCELLED"}
									>
										Cancel Withdrawal
									</button>
								</div>
								<div>
									<h5 className="no-mt has-mb-10">
										ใบเบิก
										<span
											className={`is-clickable accent has-ml-10 is-6 ${data
												.withdrawal.status === "PENDING" || "is-disabled"}`}
											onClick={() => this.setState({ edit: true })}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.withdrawal.status}</span>
									</div>
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
									<h5 className="no-mt has-mb-10">
										Remarks
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() => this.setState({ editRemarks: true })}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<span>
											{data.withdrawal.remarks
												? data.withdrawal.remarks
												: "No Remarks"}
										</span>
									</div>
								</div>
								<hr />
								<button
									className="button has-mb-10"
									onClick={() => this.setState({ changeCustomer: true })}
									disabled={data.withdrawal.status !== "PENDING"}
								>
									Change
								</button>
								<div style={{ marginBottom: "2em" }}>
									<CustomerData data={data.withdrawal.branch.customer} />
								</div>
								<div style={{ marginBottom: "2em" }}>
									{data.po && <small>ข้อมูล Job มาจาก PO</small>}
									<JobData
										data={
											data.withdrawal.po
												? data.withdrawal.po.job
												: data.withdrawal.job
										}
									/>
								</div>
								<div style={{ marginBottom: "2em" }}>
									<BranchData data={data.withdrawal.branch} />
								</div>
								<hr />
							</div>
							<Table
								data={data}
								table={data => (
									<ItemsTable
										data={data.withdrawal}
										showDelete={true}
										withdrawalId={data.withdrawal.id}
									/>
								)}
								className="no-pt"
								title="Items"
								noPage={true}
							/>
							<EditModal
								data={data.withdrawal}
								active={edit}
								close={() => this.setState({ edit: false })}
							/>
							<RemarksModal
								data={data.withdrawal}
								active={editRemarks}
								close={() => this.setState({ editRemarks: false })}
							/>
							<ChangeCustomer
								data={data.withdrawal}
								active={changeCustomer}
								close={() => this.setState({ changeCustomer: false })}
							/>
							<CancelConfirm
								onSubmit={() => this.cancelWithdrawal()}
								close={() => this.setState({ showCancelConfirm: false })}
								active={showCancelConfirm}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const CancelConfirm = ({ onSubmit, close, active }) => (
	<Modal title="Confirm" close={close} active={active}>
		<p>เมื่อ Cancel แล้ว ใบเบิกนี้จะไม่สามารถนำกลับมาใช้ได้อีก</p>
		<div className="buttons">
			<button className="button is-danger" onClick={onSubmit}>
				Cancel ใบเบิก
			</button>
			<button className="button is-light" onClick={close}>
				ไม่ Cancel
			</button>
		</div>
	</Modal>
);

export default Withdrawal;
