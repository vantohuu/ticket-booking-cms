import * as types from "./constants";

const initialState = {
  cinemas: [],
  movies: [],
  showtimes: [],
  rooms: [],
  showEditModal: false,
  loading: false,
  failedMessage: null,
  successMessage: null,
};

const showtimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CINEMAS:
      return { ...state, cinemas: action.payload };
    case types.SET_MOVIES:
      return { ...state, movies: action.payload };
    case types.SET_ROOMS:
      return { ...state, rooms: action.payload };
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

export default showtimeReducer;
