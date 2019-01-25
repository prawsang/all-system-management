import { 
    SET_PAGE, 
    UPDATE_DATA_FROM_FETCH,
    SET_LIMIT
} from "@/common/action-types";
import axios from "axios";

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

export const fetchData = url => async dispatch => {
	try {
		const res = await axios.get(url);
		dispatch(updateDataFromFetch(res.data));
	} catch (err) {
		console.log(err);
	}
};

export const updateDataFromFetch = data => ({
	payload: data,
	type: UPDATE_DATA_FROM_FETCH
});
