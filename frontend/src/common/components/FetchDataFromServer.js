import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';

class FetchDataFromServer extends React.Component {
    state = {
        data: null
    };
    componentDidMount() {
        const { url, currentPage, currentLimit } = this.props;
        Axios.get(`${url}?page=${currentPage}&limit=${currentLimit}`)
            .then(res => {
                this.setState({ data: res.data });
                console.log(res);
            });
    }
    render() {
        const { render } = this.props;
        const { data } = this.state;
        return render(data);
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