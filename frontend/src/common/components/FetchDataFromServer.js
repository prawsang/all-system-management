import React from "react";
import Axios from "axios";
import { connect } from "react-redux";

class FetchDataFromServer extends React.Component {
	state = {
		data: null
	};
	componentDidMount() {
		const { url, currentPage, currentLimit, disabled } = this.props;
		if (!disabled) {
			Axios.get(`${url}?page=${currentPage}&limit=${currentLimit}`).then(res => {
				this.setState({ data: res.data });
				console.log(res);
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			const { url, currentPage, currentLimit, disabled } = this.props;
			if (!disabled) {
				Axios.get(`${url}?page=${currentPage}&limit=${currentLimit}`).then(res => {
					this.setState({ data: res.data });
					console.log(res);
				});
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
	currentLimit: state.report.currentLimit
});

export default connect(
	mapStateToProps,
	null
)(FetchDataFromServer);
