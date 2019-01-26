import { UPDATE_SINGLE_DATA_FROM_FETCH } from "@/common/action-types";

const initialState = {
	data: {}
};

const single = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_SINGLE_DATA_FROM_FETCH:
			return {
				...state,
				data: action.payload.data
			};
		default:
			return state;
	}
};

export default single;
