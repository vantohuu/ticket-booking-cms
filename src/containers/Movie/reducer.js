import * as types from './constants';

const initialState = {
  movies: [],
  showtimes: [],
  showEditModal: false,
  loading: false
};

const movieReducer = (state = initialState, action) => {
switch (action.type) {
    case types.SET_MOVIES:
      return { ...state, movies: action.payload };
    case types.SET_ACTORS:
      return { ...state, actors: action.payload };
    case types.SET_GENRES:
      return { ...state, genres: action.payload };
    case types.SET_SHOWTIMES:
      return { ...state, showtimes: action.payload };
    case types.SHOW_BEGIN_EDIT_MODAL:
      return { ...state, showEditModal: true };
    case types.SHOW_END_EDIT_MODAL:
      return { ...state, showEditModal: false };
    case types.SET_BEGIN_LOADING_STATUS:
      return { ...state, loading: true };
    case types.SET_END_LOADING_STATUS:
      return { ...state, loading: false };
    case types.SET_FAILED_MESSAGE:
      return { ...state, failedMessage: action.payload };
    case types.SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    case types.CLEAR_MESSAGES:
      return {
        ...state,
        successMessage: null,
        failedMessage: null,
      };
    default:
      return state;
  }
};

export default movieReducer;
