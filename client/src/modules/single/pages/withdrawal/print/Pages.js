import React from "react";
import history from "@/common/history";
import { connect } from "react-redux";

class Pages extends React.Component {
	componentDidMount() {
		const { currentWithdrawal, id, type } = this.props;
		if (!currentWithdrawal) {
			history.push(`/single/withdrawal/${id}`);
		}
		if (type === "SR") {
			if (!currentWithdrawal || currentWithdrawal.type !== "INSTALLATION") {
				history.push(`/single/withdrawal/${id}`);
			}
		} else if (type === "DO") {
			if (
				!currentWithdrawal ||
				currentWithdrawal.type !== "INSTALLATION" ||
				!currentWithdrawal.do_number ||
				currentWithdrawal.do_number === ""
			) {
				history.push(`/single/withdrawal/${id}`);
			}
		}
	}
	render() {
		const { render, currentWithdrawal, items } = this.props;

		let pages = [];
		let m = items.maxCount;
		let e = 0;
		let p = 1;

		while (m >= 0) {
			pages.push(
				render({
					currentWithdrawal,
					items,
					start: e,
					end: e + 10,
					key: p,
					pageNumber: p
				})
			);
			m = m - 10;
			e = e + 10;
			p = p + 1;
		}
		return pages;
	}
}

const mapStateToProps = state => ({
	currentWithdrawal: state.withdrawal.currentWithdrawal,
	items: state.withdrawal.items
});

export default connect(
	mapStateToProps,
	null
)(Pages);
