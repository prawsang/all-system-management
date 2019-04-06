import Axios from "axios";

export const setAuthToken = token => {
	Axios.defaults.headers.common["Authorization"] = token;
	localStorage.setItem("token", token);
};

export const removeAuthToken = token => {
	delete Axios.defaults.headers.common["Authorization"];
	localStorage.removeItem("token");
};
