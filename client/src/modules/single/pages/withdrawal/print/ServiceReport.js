import React from "react";
import Header from "./Header";
import Items from "./Items";
import { connect } from "react-redux";
import history from "@/common/history";

const ServiceReport = ({ currentWithdrawal, match }) => {
	if (!currentWithdrawal || currentWithdrawal.type !== "INSTALLATION") {
		history.push(`/single/withdrawal/${match.params.id}`);
		return <p />;
	}
	return (
		<div className="print-preview">
			<div className="print-preview-page">
				<Header />
				<div className="block header is-fullwidth is-ta-center has-mb-10">
					<h3>SERVICE REPORT</h3>
				</div>
				<table className="is-fullwidth has-mb-10">
					<tbody>
						<tr>
							<td>
								<b>Customer Name: </b>
								{currentWithdrawal.branch.customer.name}
							</td>
							<td>
								<b>Branch Code: </b>
								{currentWithdrawal.branch.branch_code}
							</td>
						</tr>
						<tr>
							<td>
								<b>Address: </b>
								{currentWithdrawal.branch.address}
							</td>
							<td>
								<b>Job Code: </b>
								{currentWithdrawal.job_code
									? currentWithdrawal.job_code
									: currentWithdrawal.po.job_code}
							</td>
						</tr>
					</tbody>
				</table>
				<div className="block is-fullwidth has-mb-10">
					<b>Type of Service: </b>INSTALLATION
				</div>
				<Items />
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

const mapStateToProps = state => ({
	currentWithdrawal: state.withdrawal.currentWithdrawal
});

export default connect(
	mapStateToProps,
	null
)(ServiceReport);
