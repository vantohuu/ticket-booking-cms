import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const login = (data) => api.post(`${BASE_URL}auth/login`, data);
