import api from "./axiosInstance"

const BASE_URL = process.env.REACT_APP_API_URL
const CINEMA_SERVICE = process.env.REACT_APP_CINEMA_SERVICE

export const getCinemas = () => api.get(`${BASE_URL}${CINEMA_SERVICE}/cinemas/all`)
export const getCinemasPagination = (page = 0, size = 10, sort = "id,asc") =>
  api.get(`${BASE_URL}${CINEMA_SERVICE}/cinemas?page=${page}&size=${size}&sort=${sort}`)
export const createCinema = (data) => api.post(`${BASE_URL}${CINEMA_SERVICE}/cinemas`, data)
export const updateCinema = (id, data) => api.put(`${BASE_URL}${CINEMA_SERVICE}/cinemas/${id}`, data)
export const deleteCinema = (id) => api.delete(`${BASE_URL}${CINEMA_SERVICE}/cinemas/${id}`)
