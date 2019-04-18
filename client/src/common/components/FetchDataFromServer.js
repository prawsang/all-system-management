import React from "react";
import Axios from "axios";
import { setSearchCol, setSearchTerm, setFilters } from "@/actions/report";
import { connect } from "react-redux";

class FetchDataFromServer extends React.Component {
	state = {
		data: null
	};

	makeFilterString() {
		const { filters } = this.props;
		let string = [];
		// Date Filters
		if (filters.to) {
			string.push(`to=${filters.to}`);
		}
		if (filters.from) {
			string.push(`from=${filters.from}`);
		}
		if (filters.install_to) {
			string.push(`install_to=${filters.install_to}`);
		}
		if (filters.install_from) {
			string.push(`install_from=${filters.install_from}`);
		}
		if (filters.return_to) {
			string.push(`return_to=${filters.return_to}`);
		}
		if (filters.return_from) {
			string.push(`return_from=${filters.return_from}`);
		}

		// Boolean Filters
		if (filters.broken !== null) {
			string.push(filters.broken ? "broken=true" : "broken=false");
		}
		if (filters.installed !== null) {
			string.push(filters.installed ? "installed=true" : "installed=false");
		}

		// Text Filters
		if (filters.type !== null) {
			string.push(`type=${filters.type}`);
		}
		if (filters.status !== null) {
			string.push(`status=${filters.status}`);
		}

		if (string.length > 0) {
			return string.join("&");
		}
		return null;
	}

	componentDidMount() {
		const {
			url,
			currentPage,
			currentLimit,
			disabled,
			params,
			filters,
			searchTerm,
			searchCol
		} = this.props;

		const link = `${url}?page=${currentPage}&limit=${currentLimit}
		${searchTerm ? "&search_term=" + searchTerm : ""}
		${searchCol ? "&search_col=" + searchCol : ""}
		${params ? "&" + params : ""}
		${filters ? "&" + this.makeFilterString(filters) : ""}`;

		if (!disabled) {
			this.props.setSearchCol(null);
			this.props.setSearchTerm(null);
			Axios.get(link).then(res => {
				this.setState({ data: res.data });
				console.log(res);
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			const {
				url,
				currentPage,
				currentLimit,
				disabled,
				params,
				searchTerm,
				searchCol,
				filters
			} = this.props;
			const {
				url: prevUrl,
				currentPage: prevCurrentPage,
				currentLimit: prevCurrentLimit,
				disabled: prevDisabled,
				params: prevParams,
				searchTerm: prevSearchTerm,
				filters: prevFilters
			} = prevProps;
			if (
				url !== prevUrl ||
				currentPage !== prevCurrentPage ||
				currentLimit !== prevCurrentLimit ||
				disabled !== prevDisabled ||
				params !== prevParams ||
				searchTerm !== prevSearchTerm ||
				filters !== prevFilters
			) {
				if (!disabled) {
					if (url !== prevUrl) {
						this.props.setSearchCol(null);
						this.props.setSearchTerm(null);
					}
					const link = `${url}?page=${currentPage}&limit=${currentLimit}
					${searchTerm ? "&search_term=" + searchTerm : ""}
					${searchCol ? "&search_col=" + searchCol : ""}
					${params ? "&" + params : ""}
					${filters ? "&" + this.makeFilterString(filters) : ""}`;
					console.log(link);
					Axios.get(link).then(res => {
						this.setState({ data: res.data });
						console.log(res);
					});
				}
			}
		}
	}
	render() {
		const { render, className } = this.props;
		const { data } = this.state;
		return <div className={className}>{render(data)}</div>;
	}
}

const mapStateToProps = state => ({
	currentPage: state.report.currentPage,
	currentLimit: state.report.currentLimit,
	searchTerm: state.report.searchTerm,
	searchCol: state.report.searchCol,
	filters: state.report.filters
});
const mapDispatchToProps = {
	setSearchCol,
	setSearchTerm,
	setFilters
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FetchDataFromServer);
