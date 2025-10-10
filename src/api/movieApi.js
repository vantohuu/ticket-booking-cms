import api from "./axiosInstance"

const BASE_URL = process.env.REACT_APP_API_URL
const MOVIE_SERVICE = process.env.REACT_APP_MOVIE_SERVICE

export const getMovies = () => api.get(`${BASE_URL}${MOVIE_SERVICE}/movies/all`)
export const getMoviesPagination = (page = 0, size = 10, sort = "id,asc") =>
  api.get(`${BASE_URL}${MOVIE_SERVICE}/movies?page=${page}&size=${size}&sort=${sort}`)
export const createMovie = (data) => api.post(`${BASE_URL}${MOVIE_SERVICE}/movies`, data)
export const updateMovie = (id, data) => api.put(`${BASE_URL}${MOVIE_SERVICE}/movies/${id}`, data)
export const deleteMovie = (id) => api.delete(`${BASE_URL}${MOVIE_SERVICE}/movies/${id}`)
