import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getActors = () => api.get(`${BASE_URL}actors`);
export const getActorById = (id) => api.get(`${BASE_URL}actors/${id}`);