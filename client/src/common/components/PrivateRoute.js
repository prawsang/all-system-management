import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Nav from "./Nav";
import Error from "./Error";

const PrivateRoute = props => {
	let { isAuth, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			component={props =>
				isAuth ? (
					<React.Fragment>
						<Nav />
						<Error />
						<div className="container main with-side-bar">
							<Component {...props} />
						</div>
					</React.Fragment>
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};
const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(mapStateToProps)(PrivateRoute);
