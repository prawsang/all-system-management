import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import Axios from "axios";

const CUSTOMER = "CUSTOMER";
const BRANCH = "BRANCH";

class PORecord extends React.Component {
	state = {
		searchCustomer: "",
		searchBranch: "",
		customers: [],
		jobs: [],
		branches: [],
		selectedBranches: [],
		selectedCustomerCode: "",
		selectedJobCode: "",
		poNumber: "",
		focus: null
	};

	searchCustomerName = customerName => {
		if (customerName.length >= 3) {
			Axios.request(`/customer/get-all?search=name&search_term=${this.state.searchCustomer}`)
				.then(res => this.setState({ customers: res.data.customers }))
				.catch(err => console.log(err));
		}
	};
	getJobsForSelectedCustomer = customer => {
		Axios.request(`/customer/${customer.customer_code}/details`)
			.then(res => this.setState({ jobs: res.data.customer.jobs }))
			.catch(err => console.log(err));
	};
	searchBranchForSelectedCustomer = () => {
		Axios.request(
			`/customer/${this.state.selectedCustomerCode}/branches?search=name&search_term=${
				this.state.searchBranch
			}`
		)
			.then(res => this.setState({ branches: res.data.branches }))
			.catch(err => console.log(err));
	};

	render() {
		const {
			searchCustomer,
			searchBranch,
			customers,
			jobs,
			branches,
			selectedBranches,
			selectedCustomerCode,
			selectedJobCode,
			poNumber,
			focus
		} = this.state;

		return (
			<div className="content">
				<h3>บันทึกใบสั่งซื้อ (PO)</h3>
				<div className="panel">
					<div className="panel-content">
						<form className="form" onSubmit={e => e.preventDefault()}>
							<div className="field">
								<input className="input is-fullwidth" placeholder="PO Number" />
							</div>
							<div className="field">
								<div className="is-flex">
									<input
										className="input is-flex-fullwidth"
										placeholder="Customer Name"
										value={searchCustomer}
										onChange={e =>
											this.setState({ searchCustomer: e.target.value })
										}
										onFocus={() => this.setState({ focus: CUSTOMER })}
										onBlur={() => this.setState({ focus: null })}
									/>
									<button
										className="button has-ml-05"
										type="button"
										onClick={() => {
											this.searchCustomerName(searchCustomer);
										}}
										onFocus={() => this.setState({ focus: CUSTOMER })}
									>
										<FontAwesomeIcon icon={faSearch} />
									</button>
									<div
										className={`panel menu dropdown ${focus === CUSTOMER ||
											"is-hidden"}`}
									>
										{customers.length > 0 ? (
											customers.map((e, i) => (
												<span
													key={e.name + i}
													className="list-item is-clickable"
													onClick={() => {
														this.setState({
															searchCustomer: e.name,
															selectedCustomerCode: e.customer_code,
															focus: null
														});
														this.getJobsForSelectedCustomer(e);
													}}
												>
													{e.name} ({e.customer_code})
												</span>
											))
										) : (
											<span className="list-item">ไม่พบรายการ</span>
										)}
									</div>
								</div>
							</div>
							<div
								className={`field ${selectedCustomerCode === "" && "is-disabled"}`}
							>
								<div className="select">
									<select
										value={selectedJobCode}
										onChange={e =>
											this.setState({ selectedJobCode: e.target.value })
										}
										disabled={selectedCustomerCode === ""}
									>
										<option value="">เลือก Job</option>
										{jobs.length > 0 ? (
											jobs.map((e, i) => (
												<option key={e.job_code + i} value={e.job_code}>
													{e.name} ({e.job_code})
												</option>
											))
										) : (
											<option value="">ลูกค้าท่านนี้ยังไม่มี Job</option>
										)}
									</select>
								</div>
							</div>
							<div className={`field ${selectedJobCode === "" && "is-disabled"}`}>
								<div className="is-flex">
									<input
										className="input is-flex-fullwidth"
										placeholder="Branch Name"
										disabled={selectedJobCode === ""}
										onFocus={() => this.setState({ focus: BRANCH })}
										onBlur={() => this.setState({ focus: null })}
										value={searchBranch}
										onChange={e =>
											this.setState({ searchBranch: e.target.value })
										}
									/>
									<button
										className="button has-ml-05"
										type="button"
										onClick={() => this.searchBranchForSelectedCustomer()}
										onFocus={() => this.setState({ focus: BRANCH })}
									>
										<FontAwesomeIcon icon={faSearch} />
									</button>
									<div
										className={`panel menu dropdown ${focus === BRANCH ||
											"is-hidden"}`}
									>
										{branches.length > 0 ? (
											branches.map((e, i) => (
												<span
													key={e.name + i}
													className="list-item is-clickable"
													onClick={() => {
														this.setState({
															searchBranch: "",
															branches: [],
															selectedBranches: [
																...selectedBranches,
																{
																	name: e.name,
																	branch_id: e.branch_id,
																	branch_code: e.branch_code
																}
															],
															focus: null
														});
													}}
												>
													{e.name} {e.branch_code && `(${e.branch_code})`}
												</span>
											))
										) : (
											<span className="list-item">ไม่พบรายการ</span>
										)}
									</div>
								</div>
							</div>
							<h6>สาขาที่เลือกไว้</h6>
							<div>
								{selectedBranches.length > 0 ? (
									<ul className="no-mt">
										{selectedBranches.map((e, i) => (
											<li key={i + e.name}>
												{e.name}
												<span
													className="danger has-ml-05 is-clickable"
													onClick={() =>
														// this.setState({
														// 	selectedBranches:
														// 		selectedBranches.splice(0, i) +
														// 		selectedBranches.splice(
														// 			i,
														// 			selectedBranches.length
														// 		)
														// })
														console.log(selectedBranches.slice(i, 1))
													}
												>
													<FontAwesomeIcon icon={faTrash} />
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="is-gray-3 has-mb-10">ยังไม่ได้เลือกสาขา</p>
								)}
							</div>
							<div className="field">
								<button className="button">บันทึกใบสั่งซื้อ</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default PORecord;
