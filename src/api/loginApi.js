import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const USER_SERVICE = process.env.REACT_APP_USER_SERVICE;

export const login = (data) => api.post(`${BASE_URL}${USER_SERVICE}/auth/login`, data);
export const logout = (data) => api.post(`${BASE_URL}${USER_SERVICE}/auth/logout`, data);
