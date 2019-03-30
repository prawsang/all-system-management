import React from "react";
import Header from "./Header";
import Items from "./Items";
import { connect } from "react-redux";
import history from "@/common/history";

const ServiceReportPage = ({ currentWithdrawal, start, end, items, pageNumber }) => {
	return (
		<div className="print-preview">
			<div className="print-preview-page">
				<p style={{ float: "right" }}>หน้า {pageNumber}</p>
				<Header />
				<div className="block header is-fullwidth is-ta-center has-mb-10">
					<h3>SERVICE REPORT</h3>
				</div>
				<table className="is-fullwidth has-mb-10">
					<tbody>
						<tr>
							<td style={{ width: "50%" }}>
								<b>Customer Name: </b>
								{currentWithdrawal.branch.customer.name}
							</td>
							<td style={{ width: "50%" }}>
								<b>Branch Code: </b>
								{currentWithdrawal.branch.branch_code}
							</td>
						</tr>
						<tr>
							<td style={{ width: "50%" }}>
								<b>Address: </b>
								{currentWithdrawal.branch.address}
							</td>
							<td style={{ width: "50%" }}>
								<b>Job Code: </b>
								{currentWithdrawal.job_code
									? currentWithdrawal.job_code
									: currentWithdrawal.po.job_code}
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<b>ผู้เบิก:</b> {currentWithdrawal.staff_name}
							</td>
						</tr>
					</tbody>
				</table>
				<div className="block is-fullwidth has-mb-10">
					<b>Type of Service: </b>INSTALLATION
				</div>
				<Items start={start} end={end} items={items} />
				<div className="block has-mb-10">
					<b>Remarks: </b>
					{currentWithdrawal.remarks}
				</div>
				<div className="block" style={{ paddingTop: "10mm" }}>
					<div className="is-flex">
						<p>
							ลงชื่อ .................................................... (ผู้เบิก)
							วันที่ ___/___/______
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const ServiceReport = ({ currentWithdrawal, items, match }) => {
	if (!currentWithdrawal || currentWithdrawal.type !== "INSTALLATION") {
		history.push(`/single/withdrawal/${match.params.id}`);
		return <p />;
	}
	let pages = [];
	let m = items.maxCount;
	let e = 0;
	let p = 1;

	while (m >= 0) {
		pages.push(
			<ServiceReportPage
				currentWithdrawal={currentWithdrawal}
				start={e}
				end={e + 10}
				items={items}
				key={p}
				pageNumber={p}
			/>
		);
		m = m - 10;
		e = e + 10;
		p = p + 1;
	}
	return pages;
};

const mapStateToProps = state => ({
	currentWithdrawal: state.withdrawal.currentWithdrawal,
	items: state.withdrawal.items
});

export default connect(
	mapStateToProps,
	null
)(ServiceReport);
