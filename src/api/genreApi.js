import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const MOVIE_SERVICE = process.env.REACT_APP_MOVIE_SERVICE;

export const getGenres = () => api.get(`${BASE_URL}${MOVIE_SERVICE}/genres`);
export const getGenreById = (id) => api.get(`${BASE_URL}${MOVIE_SERVICE}/genres/${id}`);
