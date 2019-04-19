import React from "react";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Table from "@/common/components/InnerTable";
import BranchesTable from "@/common/tables/branches";
import Modal from "@/common/components/Modal";
import Field from "../../components/Field";
import Axios from "axios";
import { JobData } from "../../data";
import AddBranchModal from "./AddBranchModal";
import { connect } from "react-redux";
import { setSelectedJobCode } from "@/actions/record";
import { formatDate } from "@/common/date";

class PO extends React.PureComponent {
	state = {
		edit: false,
		description: ""
	};
	handleFormSubmit() {
		const { description } = this.state;
		const { data } = this.props;
		Axios.request({
			method: "PUT",
			url: `/po/${data.po.po_number}/edit`,
			data: {
				date: data.po.date,
				description,
				job_code: data.po.job_code
			}
		});
		window.location.reload();
	}

	render() {
		const { data, setSelectedJobCode } = this.props;
		const { edit, description, showAddBranches } = this.state;
		if (data) {
			if (!data.po) return <p>ไม่พบรายการ</p>;
		}
		return (
			<React.Fragment>
				<h3>PO Number: {data && data.po.po_number}</h3>
				<div className="panel">
					{data && (
						<React.Fragment>
							<div className="panel-content no-pb">
								<div>
									<h5 className="no-mt has-mb-10">
										Purchase Order
										<span
											className="is-clickable accent has-ml-10 is-6"
											onClick={() =>
												this.setState({
													edit: true,
													description: data.po.description
												})
											}
										>
											Edit
										</span>
									</h5>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Date:</label>
										<span>{formatDate(data.po.date)}</span>
									</div>
									<div className="has-mb-10">
										<label className="is-bold has-mr-05">Description:</label>
										<span>{data.po.description}</span>
									</div>
								</div>
								<hr />
								<JobData data={data.po.job} />
								<hr />
								<button
									className="button has-mb-10"
									type="button"
									onClick={() => {
										this.setState({ showAddBranches: true });
										setSelectedJobCode(data.po.job_code);
									}}
								>
									Add Branches
								</button>
							</div>
							<FetchDataFromServer
								url={data && `/po/${data.po.po_number}/branches`}
								render={d => (
									<Table
										data={d}
										table={d => <BranchesTable data={d} showInstalled={true} />}
										className="no-pt"
										title="Branches"
									/>
								)}
							/>
							<Modal
								active={edit}
								close={() => this.setState({ edit: false })}
								title="Edit PO"
							>
								<Field
									name="po_number"
									editable={false}
									value={data.po.po_number}
									label="PO Number"
								/>
								<Field
									name="date"
									editable={false}
									value={data.po.date}
									label="Date"
								/>
								<Field
									editable={true}
									name="description"
									type="text"
									label="Description"
									value={description}
									onChange={e => this.setState({ description: e.target.value })}
								/>
								<div className="buttons">
									<button
										className="button"
										onClick={() => this.handleFormSubmit()}
									>
										Confirm
									</button>
									<button
										className="button is-light"
										type="button"
										onClick={() => this.setState({ edit: false })}
									>
										Cancel
									</button>
								</div>
							</Modal>
						</React.Fragment>
					)}
				</div>
				<AddBranchModal
					active={showAddBranches}
					close={() => this.setState({ showAddBranches: false })}
					poNumber={data && data.po.po_number}
				/>
			</React.Fragment>
		);
	}
}

const mapDispatchToProps = {
	setSelectedJobCode
};

export default connect(
	null,
	mapDispatchToProps
)(PO);
