import React from "react";
import Table from "@/modules/single/components/Table";
import ItemsTable from "@/modules/single/tables/items";
import { BranchData, CustomerData, JobData } from "../../data/";

class Withdrawal extends React.PureComponent {
	state = {
		edit: false
	};
	render() {
		const { data } = this.props;
		// const { edit } = this.state;
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
									<h5 className="no-mt has-mb-10">ใบเบิก</h5>
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
								<CustomerData data={data && data.withdrawal.branch.customer} />
								<hr />
								<JobData data={data && data.withdrawal.job} />
								<hr />
								<BranchData data={data && data.withdrawal.branch} />
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
			</React.Fragment>
		);
	}
}

export default Withdrawal;
