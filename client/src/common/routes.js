import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Nav from "./components/Nav";
import Report from "../modules/report";
import Record from "../modules/record";
import Single from "../modules/single";
import SearchItem from "../modules/searchitem";
import Error from "./components/Error";
import Login from "../modules/login";

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
export default AppRouter;

const PublicRoute = props => {
	let { isAuthenticated, path, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props => (
				<React.Fragment>
					<Component {...props} />
					<Error />
				</React.Fragment>
			)}
		/>
	);
};

const PrivateRoute = props => {
	let { isAuthenticated, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			component={props => (
				<React.Fragment>
					<Nav />
					<Error />
					<div className="container main with-side-bar">
						<Component {...props} />
					</div>
				</React.Fragment>
			)}
		/>
	);
};

const Home = () => (
	<div className="content">
		<p className="is-gray-3">Please select a menu.</p>
	</div>
);
