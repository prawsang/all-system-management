import {
    UPDATE_SINGLE_DATA_FROM_FETCH
} from '@/common/action-types';
import axios from 'axios';

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
	type: UPDATE_SINGLE_DATA_FROM_FETCH
});