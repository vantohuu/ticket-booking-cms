import api from "./axiosInstance"

const BASE_URL = process.env.REACT_APP_API_URL
const USER_SERVICE = process.env.REACT_APP_USER_SERVICE

export const getStaffPagination = (page = 0, size = 10, sort = "id,desc") => {
  return api.get(`${BASE_URL}${USER_SERVICE}/accounts/staff?page=${page}&size=${size}&sort=${sort}`)
}

export const searchStaff = (params) => {
  const { page = 0, size = 10, sort = "id,desc", search = "" } = params || {}
  return api.get(
    `${BASE_URL}${USER_SERVICE}/accounts/staff/search?keyword=${encodeURIComponent(search)}&page=${page}&size=${size}&sort=${sort}`,
  )
}

export const createStaff = (data) => api.post(`${BASE_URL}${USER_SERVICE}/accounts/staff`, data)
export const updateStaff = (username, data) => api.put(`${BASE_URL}${USER_SERVICE}/accounts/staff/${username}`, data)
export const updateStaffPassword = (username, data) =>
  api.put(`${BASE_URL}${USER_SERVICE}/accounts/staff/${username}/password`, data)
export const deleteStaff = (username) => api.delete(`${BASE_URL}${USER_SERVICE}/accounts/staff/${username}`)
