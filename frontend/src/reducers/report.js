import { SET_PAGE } from '@/common/action-types';

const initialState = {
    data: {},
    currentPage: 1
}

const report = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAGE: 
            return {
                ...state,
                currentPage: action.payload.pageNumber
            }
        default:
            return state;
    }
}

export default report;