import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const MOVIE_SERVICE = process.env.REACT_APP_MOVIE_SERVICE;

export const getActors = () => api.get(`${BASE_URL}${MOVIE_SERVICE}/actors`);
export const getActorById = (id) => api.get(`${BASE_URL}${MOVIE_SERVICE}/actors/${id}`);