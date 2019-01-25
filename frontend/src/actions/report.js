import { SET_PAGE } from '@/common/action-types';

export const setPage = (pageNumber) => ({
    payload: {
        pageNumber
    },
    type: SET_PAGE
});