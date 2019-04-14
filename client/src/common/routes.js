import React from "react";
import { Router, Switch } from "react-router-dom";
import history from "./history";
import Report from "../modules/report";
import Record from "../modules/record";
import Single from "../modules/single";
import SearchItem from "../modules/searchitem";
import Login from "../modules/login";
import { setAuth } from "../actions/auth";
import { connect } from "react-redux";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

class AppRouter extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Router history={history}>
					<Switch>
						<PublicRoute path="/login" component={Login} />
						<PrivateRoute path="/single" component={Single} />
						<PrivateRoute path="/record" component={Record} />
						<PrivateRoute path="/report" component={Report} />
						<PrivateRoute path="/search-item" component={SearchItem} />
						<PrivateRoute path="/" component={Home} />
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}
const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(
	mapStateToProps,
	{ setAuth }
)(AppRouter);

const Home = () => (
	<div className="content">
		<p className="is-gray-3">Please select a menu.</p>
	</div>
);
