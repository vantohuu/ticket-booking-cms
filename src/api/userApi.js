import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const fetchUserProfile = () => api.get(`${BASE_URL}accounts/manager/profile`);
export const updateUserProfile = (data) => api.put(`${BASE_URL}accounts/profile`, data);
