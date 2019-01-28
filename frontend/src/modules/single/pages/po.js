import React from "react";
import FetchDataFromServer from '@/common/components/FetchDataFromServer';
import Table from '../components/Table';
import BranchesTable from '../tables/branches';

class PO extends React.PureComponent {
	state = {
		edit: false
	}
	render() {
		const { data } = this.props;
		const { 
			edit
		} = this.state;
		if (data) {
            if (!data.po) return <p>ไม่พบรายการ</p>
        }
		return (
			<React.Fragment>
				<h3>PO Number: {data && data.po.po_number}</h3>
				<div className="panel">
						{ data && (
							<React.Fragment>
								<div className="panel-content no-pb">
									<form>
										<h5 className="no-mt has-mb-10">Purchase Order</h5>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Date:</label>
											<span>{data.po.date}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Installed:</label>
											<span>{data.po.installed ? "Installed" : "Not Installed"}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Description:</label>
											<span>{data.po.description}</span>
										</div>
									</form>
									<hr/>
									<div>
										<h5 className="has-mb-10 has-mt-10">Job</h5>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Job Code:</label>
											<span>{data.po.job_code}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Job Name:</label>
											<span>{data.po.job.name}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Customer Name:</label>
											<span>{data.po.job.customer.name}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Customer Code:</label>
											<span>{data.po.job.customer.customer_code}</span>
										</div>
									</div>
									<hr/>
								</div>
								<FetchDataFromServer
									url={data && `/po/branches/${data.po.po_number}`}
									render={d => 
										<Table 
											data={d} 
											table={d => <BranchesTable data={d} />} 
											className="no-pt"
											title="Branches"
										/>
									}
								/>
							</React.Fragment>
						)}
				</div>
			</React.Fragment>
		);
	}
}

export default PO;
