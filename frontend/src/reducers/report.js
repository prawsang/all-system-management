import { 
    SET_PAGE, 
    UPDATE_DATA_FROM_FETCH,
    SET_LIMIT
} from "@/common/action-types";

const initialState = {
    data: {},
    currentPage: 1,
    currentLimit: 25
}

const report = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAGE: 
            return {
                ...state,
                currentPage: action.payload.pageNumber
            }
        case SET_LIMIT:
            return {
                ...state,
                currentLimit: action.payload.limit
            }
        case UPDATE_DATA_FROM_FETCH:
            return {
                ...state,
                data: action.payload.data
            }
        default:
            return state;
    }
}

export default report;