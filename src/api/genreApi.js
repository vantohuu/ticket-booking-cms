import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getGenres = () => api.get(`${BASE_URL}genres`);
export const getGenreById = (id) => api.get(`${BASE_URL}genres/${id}`);
