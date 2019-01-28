import React from "react";
import FetchDataFromServer from '@/common/components/FetchDataFromServer';
import Table from '../components/Table';
import { setPage } from '@/actions/report';
import { connect } from 'react-redux';
import JobsTable from "../tables/jobs";
import BranchesTable from "../tables/branches";

class Customer extends React.Component {
	state = {
        edit: false,
        activeTable: 0 // 0 = branches, 1 = jobs
	}
	render() {
		const { data } = this.props;
		const { 
            edit,
            activeTable
		} = this.state;
        if (data) {
            if (!data.customer) return <p>ไม่พบรายการ</p>
        }
		return (
			<React.Fragment>
				<h3>Customer: {data && data.customer.name}</h3>
				<div className="panel">
						{ data && (
							<React.Fragment>
								<div className="panel-content no-pb">
									<div>
										<h5 className="no-mt has-mb-10">Customer</h5>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Customer Code:</label>
											<span>{data.customer.customer_code}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Customer Name:</label>
											<span>{data.customer.name}</span>
										</div>
									</div>
									<hr/>
								</div>
                                <div className="tabs" style={{ paddingLeft: 30 }}>
                                    <div 
                                        className={`tab-item ${activeTable === 0 ? 'is-active' : ''}`}
                                        onClick={() => {
                                            this.setState({ activeTable: 0});
                                            this.props.setPage(1);
                                        }}
                                    >
                                        Branches
                                    </div>
                                    <div 
                                        className={`tab-item ${activeTable === 1 ? 'is-active' : ''}`}
                                        onClick={() => {
                                            this.setState({ activeTable: 1});
                                            this.props.setPage(1);
                                        }}
                                    >
                                        Jobs
                                    </div>
                                </div>
                                <div>
                                    <FetchDataFromServer
                                        className={activeTable === 0 ? '' : 'is-hidden'}
                                        disabled={activeTable !== 0}
                                        url={data && `/customer/branches/${data.customer.customer_code}`}
                                        render={d => 
                                            <Table 
                                                data={d} 
                                                table={d => <BranchesTable data={d} />} 
                                                className="no-pt"
                                                title="Branches"
                                            />
                                        }
                                    />
                                    <Table 
                                        data={data} 
                                        table={data => <JobsTable data={data.customer} />} 
                                        className={activeTable === 1 ? 'no-pt' : 'no-pt is-hidden'}
                                        title="Jobs"
                                        noPage={true}
                                    />
                                </div>
							</React.Fragment>
						)}
				</div>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
    setPage
}

export default connect(
    null,
    mapDispatchToProps
)(Customer);