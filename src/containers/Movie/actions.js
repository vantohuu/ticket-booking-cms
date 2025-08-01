import * as types from './constants';

export const fetchMovies = () => ({ type: types.FETCH_MOVIES });
export const fetchActors = () => ({ type: types.FETCH_ACTORS });
export const fetchGenres = () => ({ type: types.FETCH_GENRES });
export const createMovie = (data) => ({ type: types.CREATE_MOVIE, payload: data });
export const updateMovie = (data) => ({ type: types.UPDATE_MOVIE, payload: data });
export const deleteMovie = (id) => ({ type: types.DELETE_MOVIE, payload: id });
export const setMovies = (movies) => ({ type: types.SET_MOVIES, payload: movies });
export const setActors = (actors) => ({ type: types.SET_ACTORS, payload: actors });
export const setGenres = (genres) => ({ type: types.SET_GENRES, payload: genres });
export const showBeginEditModal = () => ({ type: types.SHOW_BEGIN_EDIT_MODAL });
export const showEndEditModal = () => ({ type: types.SHOW_END_EDIT_MODAL });
export const setBeginLoadingStatus = () => ({ type: types.SET_BEGIN_LOADING_STATUS });
export const setEndLoadingStatus = () => ({ type: types.SET_END_LOADING_STATUS });
export const setFailedMessage = (message) => ({ type: types.SET_FAILED_MESSAGE, payload: message });
export const setSuccessMessage = (message) => ({ type: types.SET_SUCCESS_MESSAGE, payload: message });
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES});
