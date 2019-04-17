import React from "react";
import Axios from "axios";
import { setSearchCol, setSearchTerm } from "@/actions/report";
import { connect } from "react-redux";

class FetchDataFromServer extends React.Component {
	state = {
		data: null
	};
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
		${filters ? "&" + filters : ""}`;

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
					${filters ? "&" + filters : ""}`;

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
	searchCol: state.report.searchCol
});
const mapDispatchToProps = {
	setSearchCol,
	setSearchTerm
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FetchDataFromServer);
