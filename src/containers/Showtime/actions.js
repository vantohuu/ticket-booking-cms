import * as types from './constants';

export const fetchShowtimes = () => ({ type: types.FETCH_SHOWTIMES });
export const fetchCinemas = () => ({ type: types.FETCH_CINEMAS });
export const fetchRooms = () => ({ type: types.FETCH_ROOMS });
export const fetchRoomsByCinema = (cinemaId) => ({type: types.FETCH_ROOMS_BY_CINEMA, payload : cinemaId})
export const fetchMovies = () => ({ type: types.FETCH_MOVIES});
export const createShowtime = (data) => ({ type: types.CREATE_SHOWTIME, payload: data });
export const updateShowtime = (data) => ({ type: types.UPDATE_SHOWTIME, payload: data });
export const deleteShowtime= (id) => ({ type: types.DELETE_SHOWTIME, payload: id });
export const setShowtimes = (showtimes) => ({ type: types.SET_SHOWTIMES, payload: showtimes });
export const setMovies = (movies) => ({ type: types.SET_MOVIES, payload: movies });
export const setCinemas = (cinames) => ({ type: types.SET_CINEMAS, payload: cinames });
export const setRooms = (rooms) => ({ type: types.SET_ROOMS, payload: rooms });
export const showBeginEditModal = () => ({ type: types.SHOW_BEGIN_EDIT_MODAL });
export const showEndEditModal = () => ({ type: types.SHOW_END_EDIT_MODAL });
export const setBeginLoadingStatus = () => ({ type: types.SET_BEGIN_LOADING_STATUS });
export const setEndLoadingStatus = () => ({ type: types.SET_END_LOADING_STATUS });
export const setFailedMessage = (message) => ({ type: types.SET_FAILED_MESSAGE, payload: message });
export const setSuccessMessage = (message) => ({ type: types.SET_SUCCESS_MESSAGE, payload: message });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES});

