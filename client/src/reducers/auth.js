import { SET_AUTH } from "../common/action-types";

const initialState = {
	isAuth: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	if (type === SET_AUTH) {
		return {
			...state,
			isAuth: payload
		};
	}
	return state;
};
