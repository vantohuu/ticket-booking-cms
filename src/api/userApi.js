import api from "./axiosInstance"

const BASE_URL = process.env.REACT_APP_API_URL
const USER_SERVICE = process.env.REACT_APP_USER_SERVICE

export const fetchUserProfile = () => api.get(`${BASE_URL}${USER_SERVICE}/accounts/manager/profile`)
export const updateUserProfile = (data) => api.put(`${BASE_URL}${USER_SERVICE}/accounts/profile`, data)

export const getUsersPagination = (page = 0, size = 10, sort = "id,desc", search = "") => {
  let url = `${BASE_URL}${USER_SERVICE}/accounts/customers?page=${page}&size=${size}&sort=${sort}`
  return api.get(url)
}

export const searchUsers = (params) => {
  const { page = 0, size = 10, sort = "id,desc", search = "" } = params || {}
  return api.get(`${BASE_URL}${USER_SERVICE}/accounts/customers/search?keyword=${encodeURIComponent(search)}&page=${page}&size=${size}&sort=${sort}`)
}

export const createUser = (data) => api.post(`${BASE_URL}${USER_SERVICE}/accounts/customers`, data)
export const updateUser = (username, data) => api.put(`${BASE_URL}${USER_SERVICE}/accounts/customers/${username}`, data)
export const updateUserPassword = (username, data) =>
  api.put(`${BASE_URL}${USER_SERVICE}/accounts/customers/${username}/password`, data)
export const deleteUser = (username) => api.delete(`${BASE_URL}${USER_SERVICE}/accounts/customers/${username}`)
