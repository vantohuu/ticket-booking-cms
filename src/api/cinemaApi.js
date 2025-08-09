import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getCinemas = () => api.get(`${BASE_URL}cinemas/all`);
export const createCinema = (data) => api.post(`${BASE_URL}cinemas`, data);
export const updateCinema = (id, data) => api.put(`${BASE_URL}cinemas/${id}`, data);
export const deleteCinema = (id) => api.delete(`${BASE_URL}cinemas/${id}`);