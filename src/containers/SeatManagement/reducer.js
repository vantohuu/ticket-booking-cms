import * as types from "./constants";

const initialState = {
  seats: [],
  tickets : [],
  avaiableSeats: [],
  showtime: null,
  invoice : null,
  user : null,
  showEditModal: false,
  loading: false,
  failedMessage: null,
  successMessage: null,
};

const seatManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SEATS:
      return { ...state, seats: action.payload };
    case types.SET_SHOWTIME:
      return { ...state, showtime: action.payload };
    case types.SET_TICKETS:
      return { ...state, tickets: action.payload };
    case types.SET_INVOICE:
      return { ...state, invoice: action.payload };
    case types.SET_USER:
      return { ...state, user: action.payload };
    case types.SET_AVAIABLE_SEATS:
      return { ...state, avaiableSeats: action.payload };
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

export default seatManagementReducer;
