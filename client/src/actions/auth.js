import { SET_AUTH } from "../common/action-types";
import { setAuthToken, removeAuthToken } from "../common/auth";
import Axios from "axios";

export const logIn = (credentials, history) => async dispatch => {
	try {
		const {
			data: {
				user: { token }
			}
		} = await Axios.post("/user/login", credentials);
		setAuthToken(token);
		dispatch(setAuth(true));
		history.push("/");
	} catch (error) {
		console.log(error);
		dispatch(setAuth(false));
	}
};

export const logOut = history => dispatch => {
	dispatch(setAuth(false));
	removeAuthToken();
	history.push("/login");
};

export const setAuth = bool => {
	return {
		type: SET_AUTH,
		payload: bool
	};
};
