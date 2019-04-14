import { SET_AUTH } from "../common/action-types";
import { setAuthToken, removeAuthToken, setCurrentUser, removeCurrentUser } from "../common/auth";
import Axios from "axios";

export const logIn = (credentials, history) => async dispatch => {
	try {
		const {
			data: { user }
		} = await Axios.post("/user/login", credentials);
		setAuthToken(user.token);
		setCurrentUser(user.id, user.username);
		dispatch(setAuth(true));
		history.push("/");
	} catch (error) {
		dispatch(setAuth(null));
	}
};

export const logOut = history => dispatch => {
	dispatch(setAuth(null));
	removeAuthToken();
	removeCurrentUser();
	history.push("/login");
};

export const setAuth = user => {
	if (user) {
		return {
			type: SET_AUTH,
			payload: {
				isAuth: true
			}
		};
	}
	return {
		type: SET_AUTH,
		payload: {
			isAuth: false
		}
	};
};
