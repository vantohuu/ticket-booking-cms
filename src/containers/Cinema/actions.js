import * as types from './constants';

export const fetchCinemas = () => ({ type: types.FETCH_CINEMAS });
export const createCinema = (data) => ({ type: types.CREATE_CINEMA, payload: data });
export const updateCinema = (data) => ({ type: types.UPDATE_CINEMA, payload: data });
export const deleteCinema = (id) => ({ type: types.DELETE_CINEMA, payload: id });
export const setCinemas = (cinemas) => ({ type: types.SET_CINEMAS, payload: cinemas });
export const showBeginEditModal = () => ({ type: types.SHOW_BEGIN_EDIT_MODAL });
export const showEndEditModal = () => ({ type: types.SHOW_END_EDIT_MODAL });
export const setBeginLoadingStatus = () => ({ type: types.SET_BEGIN_LOADING_STATUS });
export const setEndLoadingStatus = () => ({ type: types.SET_END_LOADING_STATUS });
export const setFailedMessage = (message) => ({ type: types.SET_FAILED_MESSAGE, payload: message });
export const setSuccessMessage = (message) => ({ type: types.SET_SUCCESS_MESSAGE, payload: message });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES});

