import React from "react";
import Header from "./Header";
import Items from "./Items";
import { connect } from "react-redux";
import history from "@/common/history";
import { formatDate } from "@/common/date";

const General = ({ currentWithdrawal, match }) => {
	if (!currentWithdrawal) {
		history.push(`/single/withdrawal/${match.params.id}`);
		return <p />;
	}
	return (
		<div className="print-preview">
			<div className="print-preview-page">
				<Header />
				<div className="block header is-fullwidth is-ta-center has-mb-10">
					<h3>ใบเบิกสินค้า</h3>
				</div>
				<div className="is-flex is-jc-space-between is-ai-flex-start has-mb-10">
					<h5 className="no-mt">ประเภท: {getTypeText(currentWithdrawal.type)}</h5>
					<p>
						เลขที่: {currentWithdrawal.id} <br />
						วันที่: {formatDate(currentWithdrawal.date)}
					</p>
				</div>
				{currentWithdrawal.type !== "TRANSFER" && (
					<div className="block has-mb-10">
						{currentWithdrawal.type === "INSTALLATION" && (
							<p>
								ติดตั้งวันที่: <b>{formatDate(currentWithdrawal.install_date)}</b>
							</p>
						)}
						{currentWithdrawal.type === "BORROW" && (
							<p>
								คืนภายในวันที่: <b>{formatDate(currentWithdrawal.return_by)}</b>
							</p>
						)}
					</div>
				)}
				<table className="is-fullwidth has-mb-10">
					<tbody>
						<tr>
							<td style={{ width: "50%" }}>
								<b>ผู้เบิก: </b>
								{currentWithdrawal.staff_name}
							</td>
							<td style={{ width: "50%" }}>
								<b>แผนก: </b>
							</td>
						</tr>
						<tr>
							<td style={{ width: "50%" }}>
								<b>Customer Name: </b>
								{currentWithdrawal.branch.customer.name} (
								{currentWithdrawal.branch.customer_code})
							</td>
							<td style={{ width: "50%" }}>
								<b>Branch Name: </b>
								{currentWithdrawal.branch.name}{" "}
								{currentWithdrawal.branch.branch_code &&
									`(${currentWithdrawal.branch.branch_code})`}
							</td>
						</tr>
					</tbody>
				</table>
				<Items />
				<div className="block has-mb-10">
					<b>Remarks: </b>
					{currentWithdrawal.remarks}
				</div>
				<div className="block" style={{ paddingTop: "10mm" }}>
					<div className="is-flex is-jc-space-between">
						<p>
							ลงชื่อ .................................... (ผู้เบิก) วันที่
							___/___/______
						</p>
						<p>
							ลงชื่อ .................................... (ผู้ตรวจสอบ) วันที่
							___/___/______
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const getTypeText = type => {
	switch (type) {
		case "INSTALLATION":
			return "เบิกไปติดตั้ง";
		case "BORROW":
			return "ยืมสินค้า";
		case "TRANSFER":
			return "โอนสินค้า";
		default:
			return "";
	}
};

const mapStateToProps = state => ({
	currentWithdrawal: state.withdrawal.currentWithdrawal
});

export default connect(
	mapStateToProps,
	null
)(General);
