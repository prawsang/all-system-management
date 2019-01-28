import React from "react";
import FetchDataFromServer from '@/common/components/FetchDataFromServer';
import Table from '../components/Table';
import ItemsTable from '../tables/items';
import { setPage } from '@/actions/report';
import { connect } from 'react-redux';
import POTable from "../tables/po";

class Branch extends React.Component {
	state = {
        edit: false,
        activeTable: 0 // 0 = items, 1 = po
	}
	render() {
		const { data } = this.props;
		const { 
            edit,
            activeTable
		} = this.state;

		return (
			<React.Fragment>
				<h3>Branch: {data && data.branch.name}</h3>
				<div className="panel">
						{ data && (
							<React.Fragment>
								<div className="panel-content no-pb">
									<form>
										<h5 className="no-mt has-mb-10">Branch</h5>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Branch Code:</label>
											<span>{data.branch.branch_code}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Address:</label>
											<span>{data.branch.address}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Province:</label>
											<span>{data.branch.province}</span>
										</div>
                                        <div className="has-mb-10">
											<label className="is-bold has-mr-05">Store Type:</label>
											<span>{data.branch.store_type.name}</span>
										</div>
									</form>
									<hr/>
									<div>
										<h5 className="has-mb-10 has-mt-10">Customer</h5>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Customer Code:</label>
											<span>{data.branch.customer.customer_code}</span>
										</div>
										<div className="has-mb-10">
											<label className="is-bold has-mr-05">Customer Name:</label>
											<span>{data.branch.customer.name}</span>
										</div>
									</div>
									<hr/>
                                    <div>
										<h5 className="has-mb-10 has-mt-10">Jobs</h5>
                                        <ul className="has-mb-10">
                                            {data.branch.jobs.map((e,i) => 
                                                <li key={i+e.job_code}>{e.name} ({e.job_code})</li>
                                            )}
                                        </ul>
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
                                        Items
                                    </div>
                                    <div 
                                        className={`tab-item ${activeTable === 1 ? 'is-active' : ''}`}
                                        onClick={() => {
                                            this.setState({ activeTable: 1});
                                            this.props.setPage(1);
                                        }}
                                    >
                                        POs
                                    </div>
                                </div>
                                <div>
                                    <FetchDataFromServer
                                        className={activeTable === 0 ? '' : 'is-hidden'}
                                        disabled={activeTable !== 0}
                                        url={data && `/branch/items/${data.branch.id}`}
                                        render={d => 
                                            <Table 
                                                data={d} 
                                                table={d => <ItemsTable data={d} />} 
                                                className="no-pt"
                                                title="Items"
                                            />
                                        }
                                    />
                                    <FetchDataFromServer
                                        className={activeTable === 1 ? '' : 'is-hidden'}
                                        disabled={activeTable !== 1}
                                        url={data && `/branch/po/${data.branch.id}`}
                                        render={d => 
                                            <Table 
                                                data={d} 
                                                table={d => <POTable data={d} />} 
                                                className="no-pt"
                                                title="POs"
                                            />
                                        }
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
)(Branch);