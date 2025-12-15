import * as types from "./constants"

const initialState = {
  users: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  isSearching: false,
  showEditModal: false,
  showPasswordModal: false,
  loading: false,
  failedMessage: null,
  successMessage: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USERS:
      return { ...state, users: action.payload }
    case types.SET_PAGINATION:
      return { ...state, pagination: action.payload }
    case types.SHOW_BEGIN_EDIT_MODAL:
      return { ...state, showEditModal: true }
    case types.SHOW_END_EDIT_MODAL:
      return { ...state, showEditModal: false }
    case types.SHOW_BEGIN_PASSWORD_MODAL:
      return { ...state, showPasswordModal: true }
    case types.SHOW_END_PASSWORD_MODAL:
      return { ...state, showPasswordModal: false }
    case types.SET_BEGIN_LOADING_STATUS:
      return { ...state, loading: true }
    case types.SET_END_LOADING_STATUS:
      return { ...state, loading: false }
    case types.SET_FAILED_MESSAGE:
      return { ...state, failedMessage: action.payload }
    case types.SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload }
    case types.CLEAR_MESSAGES:
      return {
        ...state,
        successMessage: null,
        failedMessage: null,
      }
    case types.SEARCH_USERS:
      return { ...state, isSearching: true }
    case types.FETCH_USERS:
      return { ...state, isSearching: false }
    default:
      return state
  }
}

export default userReducer
