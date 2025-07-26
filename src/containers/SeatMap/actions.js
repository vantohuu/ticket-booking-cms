import * as types from './constants';

export const fetchSeats = () => ({ type: types.FETCH_SEATS });
export const fetchSeatsByRoom = (roomId) => ({ type: types.FETCH_SEATS_BY_ROOM, payload: roomId });
export const setSeats = (seats) => ({ type: types.SET_SEATS, payload: seats });
export const showBeginEditModal = () => ({ type: types.SHOW_BEGIN_EDIT_MODAL });
export const showEndEditModal = () => ({ type: types.SHOW_END_EDIT_MODAL });
export const setBeginLoadingStatus = () => ({ type: types.SET_BEGIN_LOADING_STATUS });
export const setEndLoadingStatus = () => ({ type: types.SET_END_LOADING_STATUS });
export const setFailedMessage = (message) => ({ type: types.SET_FAILED_MESSAGE, payload: message });
export const setSuccessMessage = (message) => ({ type: types.SET_SUCCESS_MESSAGE, payload: message });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES});

