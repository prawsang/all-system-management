import Axios from "axios";
import store from "./store";
import { setError } from "../actions/error";
import { removeAuthToken } from "./auth";
import { setAuth } from "../actions/auth";

export default () => {
	Axios.defaults.baseURL = "http://localhost:3000";
	Axios.defaults.headers.post["Content-Type"] = "application/json";
	Axios.interceptors.response.use(null, function(err) {
		store.dispatch(setError(err.response));
		console.warn(err.response);
		if (err.response.status === 403) {
			removeAuthToken();
			store.dispatch(setAuth(false));
		}
		return Promise.reject(err);
	});
};
