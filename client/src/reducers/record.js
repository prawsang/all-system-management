import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCHES,
	SET_SELECTED_PO,
	FETCH_JOBS
} from "@/common/action-types";

const initialState = {
	selectedCustomer: null,
	selectedBranches: [],
	selectedPO: null,
	jobs: []
};

const record = (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_CUSTOMER:
			return {
				...state,
				selectedCustomer: action.payload.customer
			};
		case SET_SELECTED_BRANCHES:
			return {
				...state,
				selectedBranches: action.payload.branches
			};
		case SET_SELECTED_PO:
			return {
				...state,
				selectedPO: action.payload.po
			};
		case FETCH_JOBS:
			return {
				...state,
				jobs: action.payload.jobs
			};
		default:
			return state;
	}
};

export default record;
