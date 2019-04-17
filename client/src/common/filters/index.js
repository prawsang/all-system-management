import React from "react";
import Modal from "../components/Modal";
import { setFilters } from "@/actions/report";
import { connect } from "react-redux";
import { Select, Date, Checkbox } from "./form";
import Filter from "./filter";

class Filters extends React.Component {
	// Available Filters:
	// Branch-PO Installed/Uninstalled (installed)
	// PO Date (from/to)
	// Broken Items (broken)
	// Item Status (status)
	// Item Type (type)
	// Withdrawal Date (from/to)
	// Installation Date (install_from/install_to)
	// Return Date (return_from/return_to)
	// Overdue Items (return_to = today)

	toggleBooleanFilter(value) {
		return value !== null ? null : false;
	}

	render() {
		const { active, close, filters, setFilters } = this.props;
		const { broken } = this.props;
		return (
			<Modal title="Filters" active={active} close={close}>
				<Filter
					onChange={() => setFilters({ broken: this.toggleBooleanFilter(broken) })}
					value={broken === null ? false : true}
					render={value => (
						<Checkbox
							disabled={!value}
							label="Broken"
							checked={broken === null ? false : broken}
							onChange={() => setFilters({ broken: !broken })}
						/>
					)}
				/>
			</Modal>
		);
	}
}

const mapDispatchToProps = {
	setFilters
};
const mapStateToProps = state => ({
	broken: state.report.filters.broken
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filters);
