import React from "react";
import Field from '../components/Field';
import Axios from 'axios';

class PO extends React.PureComponent {
	componentDidMount() {
		Axios.get(`/po/branches/${this.props.po_number}`)
			.then(res => this.setState({ branches: res.data.branches }));
	}
	state = {
		edit: false,
		branches: []
	}
	render() {
		const { data } = this.props;
		const { 
			edit,
			branches
		} = this.state;

		return (
			<React.Fragment>
				<h3>PO Number: {data && data.po.po_number}</h3>
				<div className="panel">
						{ data && (
							<React.Fragment>
								<div className="panel-content no-pb">
									<form>
										<h5 className="no-mt has-mb-10">Purchase Order</h5>
										<Field 
											label="Date"
											edit={edit}
											editable={false}
											value={data.po.date}
										/>
										<Field 
											label="Installed"
											edit={edit}
											editable={false}
											value={data.po.installed}
											type="checkbox"
											text={data.po.installed ? "Installed" : "Not Installed"}
											onChange={(e) => this.setState({ installed: e.target.value })}
										/>
										<Field 
											label="Description"
											edit={edit}
											editable={true}
											value={data.po.description}
											onChange={(e) => this.setState({ description: e.target.value})}
										/>
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
								<h5 className="no-mt" style={{ paddingLeft: 30 }}>Branches</h5>
								<table className="table is-fullwidth">
									<thead>
										<tr>
											<td>Branch Code</td>
											<td>Branch Name</td>
											<td>Store Type</td>
											<td>Province</td>
										</tr>
									</thead>
									<tbody className="is-hoverable">
										{branches && branches.map((e,i) => (
											<tr key={e.name + i} className="is-hoverable is-clickable">
												<td>{e.branch_code}</td>
												<td>{e.name}</td>
												<td>{e.store_type.name}</td>
												<td>{e.province}</td>
											</tr>
										))}
									</tbody>
								</table>
								<div style={{ paddingBottom: 30 }}/>
							</React.Fragment>
						)}
				</div>
			</React.Fragment>
		);
	}
}

export default PO;
