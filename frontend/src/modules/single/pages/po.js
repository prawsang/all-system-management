import React from "react";
import FetchDataFromServer from '@/common/components/FetchDataFromServer';
import Table from '../components/Table';
import BranchesTable from '../tables/branches';
import Modal from '@/common/components/Modal';
import Field from "../components/Field";
import Axios from 'axios';
import history from '@/common/history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

class PO extends React.PureComponent {
	state = {
		edit: false,
		installed: false,
		description: ''
	}
	handleFormSubmit(e) {
		const { date, description, installed } = e.target;
		Axios.request({
			method: 'PUT',
			url: `/po/${e.target.po_number.value}/edit`,
			data: {
				date: date.value,
				description: description.value,
				installed: installed.value
			}
		})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}
	render() {
		const { data } = this.props;
		const { 
			edit,
			installed,
			description
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
										<h5 className="no-mt has-mb-10">
											Purchase Order
											<span 
												className="is-clickable accent has-ml-10 is-6"
												onClick={() => this.setState({ 
													edit: true,
													installed: data.po.installed,
													description: data.po.description
												})}
											>
												Edit
											</span>
										</h5>
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
										<h5 className="no-mt has-mb-10">
											Job
											<span 
												className="is-clickable accent has-ml-10 is-6"
												onClick={() => history.push(`/single/job/${data.po.job_code}`)}
											>
												<FontAwesomeIcon icon={faExternalLinkAlt}/>
											</span>
										</h5>
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
									url={data && `/po/${data.po.po_number}/branches`}
									render={d => 
										<Table 
											data={d} 
											table={d => <BranchesTable data={d} />} 
											className="no-pt"
											title="Branches"
										/>
									}
								/>
								<Modal active={edit} close={() => this.setState({ edit: false })} title="Edit PO">
									<form onSubmit={(e) => this.handleFormSubmit(e)}>
										<Field name="po_number" editable={false} value={data.po.po_number} label="PO Number"/>
										<Field name="date" editable={false} value={data.po.date} label="Date"/>
										<Field 
											editable={true} 
											name="installed"
											type="checkbox" 
											label="Installed" 
											value={installed} 
											onChange={() => this.setState({ installed: !installed})}
										/>
										<Field 
											editable={true} 
											name="description"
											type="text" 
											label="Description" 
											value={description} 
											onChange={(e) => this.setState({ description: e.target.value})}
										/>
										<div className="buttons">
											<button className="button" type="submit">Confirm</button>
											<button 
												className="button is-light" 
												type="button"
												onClick={() => this.setState({ edit: false })}
											>
												Cancel
											</button>
										</div>
									</form>
								</Modal>
							</React.Fragment>
						)}
				</div>
			</React.Fragment>
		);
	}
}

export default PO;
