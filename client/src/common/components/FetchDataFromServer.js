import React from "react";
import Axios from "axios";
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
			searchTerm,
			searchCol
		} = this.props;
		if (!disabled) {
			Axios.get(
				`${url}?page=${currentPage}&limit=${currentLimit}${
					searchTerm ? "&search_term=" + searchTerm : ""
				}${searchCol ? "&search_col=" + searchCol : ""}${params ? "&" + params : ""}`
			).then(res => {
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
				searchCol
			} = this.props;
			const {
				url: prevUrl,
				currentPage: prevCurrentPage,
				currentLimit: prevCurrentLimit,
				disabled: prevDisabled,
				params: prevParams,
				searchTerm: prevSearchTerm
			} = prevProps;
			if (
				url !== prevUrl ||
				currentPage !== prevCurrentPage ||
				currentLimit !== prevCurrentLimit ||
				disabled !== prevDisabled ||
				params !== prevParams ||
				searchTerm !== prevSearchTerm
			) {
				if (!disabled) {
					Axios.get(
						`${url}?page=${currentPage}&limit=${currentLimit}${
							searchTerm ? "&search_term=" + searchTerm : ""
						}${searchCol ? "&search_col=" + searchCol : ""}${
							params ? "&" + params : ""
						}`
					).then(res => {
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

export default connect(
	mapStateToProps,
	null
)(FetchDataFromServer);
