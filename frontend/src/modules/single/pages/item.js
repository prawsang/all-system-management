import React from "react";
import Table from "../components/Table";
import WithdrawalsTable from "../tables/withdrawals";
import history from "@/common/history";

class Item extends React.Component {
	state = {
		edit: false
	};
	render() {
		const { data } = this.props;
		const { edit } = this.state;
		if (data) {
            if (!data.item) return <p>ไม่พบรายการ</p>
        }
		return (
			<React.Fragment>
				<h3>Item: {data && data.item.serial_no}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<h5 className="no-mt has-mb-10">Item</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Status:</label>
										<span>{data.item.status}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Model Name:</label>
										<span>{data.item.model.name}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Type:</label>
										<span>{data.item.model.type}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Remarks:</label>
										<span>{data.item.remarks}</span>
									</div>
								</div>
								<hr />
								<div>
									<h5 className="no-mt has-mb-10">Reserved By</h5>
									{data.item.reserve_job && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Job:</label>
											<span>
												{data.item.reserve_job.name} (
												{data.item.reserve_job.job_code})
											</span>
										</div>
									)}
									{data.item.reserve_branch && (
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Branch:</label>
											<span>
												{data.item.reserve_branch.name}{" "}
												{data.item.reserve_branch.branch_code &&
													`(${data.item.reserve_branch.branch_code})`}
											</span>
										</div>
                                    )}
                                    {(!data.item.reserve_branch && !data.item.reserve_job) && (
                                        <span>This item is not reserved</span>
                                    )}
								</div>
								<hr />
							</div>
							<Table
								data={data}
								table={data => <WithdrawalsTable data={data.item} />}
								className="no-pt"
								title="ประวัติการเบิก"
								noPage={true}
							/>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Item;
