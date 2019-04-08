import Axios from "axios";

export const setAuthToken = token => {
	Axios.defaults.headers.common["Authorization"] = token;
	localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
	delete Axios.defaults.headers.common["Authorization"];
	localStorage.removeItem("token");
};

export const setCurrentUser = (id, username) => {
	localStorage.setItem("username", username);
	localStorage.setItem("userId", id);
};

export const removeCurrentUser = () => {
	localStorage.removeItem("username");
	localStorage.removeItem("userId");
};
