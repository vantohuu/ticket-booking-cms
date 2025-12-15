import * as types from "./constants"

export const fetchStaff = (paginationParams) => ({ type: types.FETCH_STAFF, payload: paginationParams })
export const searchStaff = (paginationParams) => ({ type: types.SEARCH_STAFF, payload: paginationParams })
export const createStaff = (data) => ({ type: types.CREATE_STAFF, payload: data })
export const updateStaff = (username, data, currentPage) => ({
  type: types.UPDATE_STAFF,
  payload: { username, data },
  currentPage,
})
export const updateStaffPassword = (username, password, currentPage) => ({
  type: types.UPDATE_STAFF_PASSWORD,
  payload: { username, password },
  currentPage,
})
export const deleteStaff = (username, currentPage) => ({ type: types.DELETE_STAFF, payload: username, currentPage })

export const setStaff = (staff) => ({ type: types.SET_STAFF, payload: staff })
export const setPagination = (pagination) => ({ type: types.SET_PAGINATION, payload: pagination })

export const showBeginEditModal = () => ({ type: types.SHOW_BEGIN_EDIT_MODAL })
export const showEndEditModal = () => ({ type: types.SHOW_END_EDIT_MODAL })
export const showBeginPasswordModal = () => ({ type: types.SHOW_BEGIN_PASSWORD_MODAL })
export const showEndPasswordModal = () => ({ type: types.SHOW_END_PASSWORD_MODAL })

export const setBeginLoadingStatus = () => ({ type: types.SET_BEGIN_LOADING_STATUS })
export const setEndLoadingStatus = () => ({ type: types.SET_END_LOADING_STATUS })

export const setSuccessMessage = (message) => ({ type: types.SET_SUCCESS_MESSAGE, payload: message })
export const setFailedMessage = (message) => ({ type: types.SET_FAILED_MESSAGE, payload: message })
export const clearMessages = () => ({ type: types.CLEAR_MESSAGES })
export const setIsSearching = (isSearching) => ({ type: types.SET_IS_SEARCHING, payload: isSearching })
