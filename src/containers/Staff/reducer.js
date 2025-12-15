import * as types from "./constants"

const initialState = {
  staff: [],
  pagination: {},
  isShowEditModal: false,
  isShowPasswordModal: false,
  isLoading: false,
  successMessage: "",
  failedMessage: "",
  isSearching: false,
}

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_STAFF:
      return { ...state, staff: action.payload }

    case types.SET_PAGINATION:
      return { ...state, pagination: action.payload }

    case types.SHOW_BEGIN_EDIT_MODAL:
      return { ...state, isShowEditModal: true }

    case types.SHOW_END_EDIT_MODAL:
      return { ...state, isShowEditModal: false }

    case types.SHOW_BEGIN_PASSWORD_MODAL:
      return { ...state, isShowPasswordModal: true }

    case types.SHOW_END_PASSWORD_MODAL:
      return { ...state, isShowPasswordModal: false }

    case types.SET_BEGIN_LOADING_STATUS:
      return { ...state, isLoading: true }

    case types.SET_END_LOADING_STATUS:
      return { ...state, isLoading: false }

    case types.SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload }

    case types.SET_FAILED_MESSAGE:
      return { ...state, failedMessage: action.payload }

    case types.CLEAR_MESSAGES:
      return { ...state, successMessage: "", failedMessage: "" }

    case types.SEARCH_STAFF:
      return { ...state, isSearching: true }

    case types.FETCH_STAFF:
      return { ...state, isSearching: false }

    default:
      return state
  }
}

export default staffReducer
