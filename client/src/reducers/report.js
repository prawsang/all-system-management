import { SET_PAGE, SET_LIMIT, SET_SEARCH_TERM, SET_SEARCH_COL } from "@/common/action-types";

const initialState = {
	data: {},
	currentPage: 1,
	currentLimit: 25,
	searchTerm: "",
	searchCol: ""
};

const report = (state = initialState, action) => {
	switch (action.type) {
		case SET_PAGE:
			return {
				...state,
				currentPage: action.payload.pageNumber
			};
		case SET_LIMIT:
			return {
				...state,
				currentLimit: action.payload.limit
			};
		case SET_SEARCH_TERM:
			return {
				...state,
				searchTerm: action.payload.searchTerm
			};
		case SET_SEARCH_COL:
			return {
				...state,
				searchCol: action.payload.searchCol
			};
		default:
			return state;
	}
};

export default report;
