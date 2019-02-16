import React from "react";
import Header from "./Header";

class ServiceReport extends React.Component {
	render() {
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
									<b>Customer Name: </b>Big C
								</td>
								<td>
									<b>Branch Code: </b>11168
								</td>
							</tr>
							<tr>
								<td>
									<b>Address: </b>124/157 หมู่ที่ 3 ตำบลไทรม้า อำเภอเมืองนนทบุรี
									จังหวัดนนทบุรี 11110
								</td>
								<td>
									<b>Job Code: </b> 018
								</td>
							</tr>
						</tbody>
					</table>
					<div className="block is-fullwidth has-mb-10">
						<b>Type of Service: </b>INSTALLATION
					</div>
					<table className="is-fullwidth has-mb-10">
						<thead>
							<tr>
								<td>Type</td>
								<td>Serials</td>
								<td>Total</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="is-bold has-no-line-break">POS</td>
								<td className="is-fullwidth">
									<span className="has-mr-10">123123123</span>
									<span className="has-mr-10">03294-293044</span>
									<span>0903409893</span>
								</td>
								<td>3</td>
							</tr>
							<tr>
								<td className="is-bold has-no-line-break">Scanner</td>
								<td className="is-fullwidth">
									<span className="has-mr-10">123123123</span>
									<span className="has-mr-10">03294-293044</span>
									<span>0903409893</span>
								</td>
								<td>3</td>
							</tr>
							<tr>
								<td className="is-bold has-no-line-break">Monitor</td>
								<td className="is-fullwidth">
									<span className="has-mr-10">123123123</span>
									<span className="has-mr-10">03294-293044</span>
									<span>0903409893</span>
								</td>
								<td>3</td>
							</tr>
							<tr>
								<td className="is-bold has-no-line-break">Keyboard</td>
								<td className="is-fullwidth">
									<span className="has-mr-10">123123123</span>
									<span className="has-mr-10">03294-293044</span>
									<span>0903409893</span>
								</td>
								<td>3</td>
							</tr>
							<tr>
								<td className="is-bold has-no-line-break">Printer</td>
								<td className="is-fullwidth">
									<span className="has-mr-10">123123123</span>
									<span className="has-mr-10">03294-293044</span>
									<span>0903409893</span>
								</td>
								<td>3</td>
							</tr>
							<tr>
								<td className="is-bold has-no-line-break">Cash Drawer</td>
								<td className="is-fullwidth">
									<span className="has-mr-10">123123123</span>
									<span className="has-mr-10">03294-293044</span>
									<span>0903409893</span>
								</td>
								<td>3</td>
							</tr>
						</tbody>
					</table>
					<div className="block">
						<b>Remarks: </b>These are the remarks of this service report.
					</div>
				</div>
			</div>
		);
	}
}

export default ServiceReport;
