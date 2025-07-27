import * as types from './constants';

export const fetchAvaiableSeatsByShowtime = (showtimeId) => ({ type: types.FETCH_AVAIABLE_SEATS_BY_SHOWTIME, payload: showtimeId });
export const fetchShowtimeById = (showtimeId) => ({ type: types.FETCH_SHOWTIME_BY_ID, payload: showtimeId });
export const fetchInvoice = (invoiceId) => ({ type: types.FETCH_INVOICE, payload: invoiceId });
export const fetchSeatsByRoom = (roomId) => ({ type: types.FETCH_SEATS_BY_ROOM, payload: roomId });
export const fetchUser = (username) => ({ type: types.FETCH_USER, payload: username });
export const fetchBookedTickets = (showtimeId) => ({ type: types.FETCH_BOOKED_TICKETS, payload: showtimeId });
export const setSeats = (seats) => ({ type: types.SET_SEATS, payload: seats });
export const setTickets = (tickets) => ({ type: types.SET_TICKETS, payload: tickets });
export const setInvoice = (invoice) => ({ type: types.SET_INVOICE, payload: invoice });
export const setShowtime = (showtime) => ({ type: types.SET_SHOWTIME, payload: showtime });
export const setUser = (user) => ({ type: types.SET_USER, payload: user });
export const setAvaiableSeats = (seats) => ({ type: types.SET_AVAIABLE_SEATS, payload: seats });
export const showBeginEditModal = () => ({ type: types.SHOW_BEGIN_EDIT_MODAL });
export const showEndEditModal = () => ({ type: types.SHOW_END_EDIT_MODAL });
export const setBeginLoadingStatus = () => ({ type: types.SET_BEGIN_LOADING_STATUS });
export const setEndLoadingStatus = (    ) => ({ type: types.SET_END_LOADING_STATUS });
export const setFailedMessage = (message) => ({ type: types.SET_FAILED_MESSAGE, payload: message });
export const setSuccessMessage = (message) => ({ type: types.SET_SUCCESS_MESSAGE, payload: message });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES});

