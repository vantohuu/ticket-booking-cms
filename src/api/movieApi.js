import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getMovies = () => api.get(`${BASE_URL}movies`);
export const createMovie = (data) => api.post(`${BASE_URL}movies`, data);
export const updateMovie = (id, data) => api.put(`${BASE_URL}movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`${BASE_URL}movies/${id}`);