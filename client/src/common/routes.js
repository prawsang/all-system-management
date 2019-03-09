import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Nav from "./components/Nav";
import Report from "../modules/report";
import Record from "../modules/record";
import Single from "../modules/single";
import SearchItem from "../modules/searchitem";
import Error from "./components/Error";

class AppRouter extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Nav />
				<Error />
				<div className="container main with-side-bar">
					<Router history={history}>
						<Switch>
							<Route path="/single" component={Single} />
							<Route path="/record" component={Record} />
							<Route path="/report" component={Report} />
							<Route path="/search-item" component={SearchItem} />
							<Route path="/" component={Home} />
						</Switch>
					</Router>
				</div>
			</React.Fragment>
		);
	}
}
export default AppRouter;

const Home = () => (
	<div className="content">
		<p className="is-gray-3">Please select a menu.</p>
	</div>
);
