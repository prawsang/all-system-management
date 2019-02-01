import { 
    SET_PAGE, 
    SET_LIMIT
} from "@/common/action-types";

export const setPage = (pageNumber) => ({
	payload: {
		pageNumber: parseInt(pageNumber)
	},
	type: SET_PAGE
});

export const setLimit = (limit) => ({
    payload: {
        limit: parseInt(limit)
    },
    type: SET_LIMIT
});