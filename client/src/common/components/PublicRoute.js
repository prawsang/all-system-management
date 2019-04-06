import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Error from "./Error";

const PublicRoute = props => {
	let { isAuth, path, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props =>
				isAuth ? (
					<Redirect to="/" />
				) : (
					<React.Fragment>
						<Component {...props} />
						<Error />
					</React.Fragment>
				)
			}
		/>
	);
};
const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(mapStateToProps)(PublicRoute);
