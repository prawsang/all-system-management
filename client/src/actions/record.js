import {
	SET_SELECTED_CUSTOMER,
	SET_SELECTED_BRANCHES,
	SET_SELECTED_PO
} from "@/common/action-types";

export const setSelectedCustomer = customer => ({
	payload: {
		customer
	},
	type: SET_SELECTED_CUSTOMER
});

export const setSelectedBranches = branches => ({
	payload: {
		branches
	},
	type: SET_SELECTED_BRANCHES
});

export const setSelectedPO = po => ({
	payload: {
		po
	},
	type: SET_SELECTED_PO
});
