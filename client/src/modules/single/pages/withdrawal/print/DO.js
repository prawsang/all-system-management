import React from "react";
// import Header from "./Header";
import Items from "./Items";

const DOPage = ({ currentWithdrawal, start, end, items, pageNumber }) => {
	return (
		<div className="print-preview">
			<div className="print-preview-page">
				<p style={{ float: "right" }}>หน้า {pageNumber}</p>
				{/* <Header /> */}
				<div className="block has-mb-10 is-ta-center" style={{ marginTop: "10mm" }}>
					<h3>ใบส่งสินค้า (Delivery Order)</h3>
				</div>
				<table className="has-mb-10 is-fullwidth">
					<tbody>
						<tr>
							<td style={{ width: "50%" }}>
								<b>DO Number: </b>
								{currentWithdrawal.do_number}
							</td>
							<td style={{ width: "50%" }}>
								<b>PO Number: </b>
								{currentWithdrawal.po_number
									? currentWithdrawal.po_number
									: "ยังไม่ได้รับ PO"}
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<b>Customer Name:</b> {currentWithdrawal.branch.customer.name}
							</td>
						</tr>
						<tr>
							<td style={{ width: "50%" }}>
								<b>Branch Name: </b>
								{currentWithdrawal.branch.name}
							</td>
							<td style={{ width: "50%" }}>
								<b>Branch Code: </b>
								{currentWithdrawal.branch.branch_code}
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<b>Address: </b>
								{currentWithdrawal.branch.address}
							</td>
						</tr>
					</tbody>
				</table>
				<Items start={start} end={end} items={items} />
				<div className="block has-mb-10">
					<b>Remarks: </b>
					{currentWithdrawal.remarks}
				</div>
				<div className="block" style={{ paddingTop: "10mm" }}>
					<div className="is-flex is-jc-space-between">
						<p>
							ลงชื่อ .................................... (ผู้ส่งของ) วันที่
							___/___/______
						</p>
						<p>
							ลงชื่อ .................................... (ผู้รับของ) วันที่
							___/___/______
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DOPage;
