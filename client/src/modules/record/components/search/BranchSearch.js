import React from "react";
import SearchField from "../SearchField";
import { setSelectedBranches } from "@/actions/record";
import { connect } from "react-redux";

class BranchSearch extends React.Component {
	state = {
		showResults: false,
		branch: ""
	};

	render() {
		const { showResults, branch } = this.state;
		const { selectedBranches, setSelectedBranches, selectedCustomer, disabled } = this.props;
		return (
			<SearchField
				value={branch}
				onChange={e => {
					this.setState({ branch: e.target.value });
				}}
				placeholder="Branch Name"
				searchUrl={`/customer/${selectedCustomer &&
					selectedCustomer.customer_code}/branches`}
				searchTerm={branch}
				searchName="name"
				disabled={disabled}
				showResults={() => this.setState({ showResults: true })}
				hideResults={() => this.setState({ showResults: false })}
				list={data => (
					<div className={`${showResults || "is-hidden"}`}>
						<div
							className="panel menu dropdown"
							onClick={() => this.setState({ showResults: false })}
						>
							{data ? (
								data.branches.length > 0 ? (
									data.branches.map((e, i) => (
										<span
											key={e.name + i}
											className="list-item is-clickable"
											onClick={() => {
												setSelectedBranches([...selectedBranches, e]);
												this.setState({ branch: "" });
											}}
										>
											{e.name} {e.branch_code && `(${e.branch_code})`}
										</span>
									))
								) : (
									<span className="list-item">ไม่พบรายการ</span>
								)
							) : (
								<span className="list-item">
									กรุณาพิมพ์อย่างน้อย 3 ตัวอักษรแล้วกดค้นหา
								</span>
							)}
						</div>
					</div>
				)}
			/>
		);
	}
}

const mapStateToProps = state => ({
	selectedBranches: state.record.selectedBranches,
	selectedCustomer: state.record.selectedCustomer
});
const mapDispatchToProps = {
	setSelectedBranches
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BranchSearch);
