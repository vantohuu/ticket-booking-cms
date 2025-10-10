import api from "./axiosInstance"

const BASE_URL = process.env.REACT_APP_API_URL
const MOVIE_SERVICE = process.env.REACT_APP_MOVIE_SERVICE

export const getShowtimes = () => api.get(`${BASE_URL}${MOVIE_SERVICE}/showtimes/all`)
export const getShowtimesPagination = (page = 0, size = 10, sort = "id,asc") =>
  api.get(`${BASE_URL}${MOVIE_SERVICE}/showtimes?page=${page}&size=${size}&sort=${sort}`)
export const getAvailableSeats = (id) => api.get(`${BASE_URL}${MOVIE_SERVICE}/showtimes/${id}/available-seats`)
export const getShowtimeById = (id) => api.get(`${BASE_URL}${MOVIE_SERVICE}/showtimes/${id}`)
export const getShowtimesByMovie = (movieId) => api.get(`${BASE_URL}${MOVIE_SERVICE}/showtimes/movie/${movieId}`)
export const getShowtimesByDateAndRoom = (data) => api.post(`${BASE_URL}${MOVIE_SERVICE}/showtimes/search-by-date-and-room`, data)
export const getBookedTickets = (id) => api.get(`${BASE_URL}${MOVIE_SERVICE}/showtimes/${id}/booked-tickets`)
export const createShowtime = (data) => api.post(`${BASE_URL}${MOVIE_SERVICE}/showtimes`, data)
export const updateShowtime = (id, data) => api.put(`${BASE_URL}${MOVIE_SERVICE}/showtimes/${id}`, data)
export const deleteShowtime = (id) => api.delete(`${BASE_URL}${MOVIE_SERVICE}/showtimes/${id}`)
