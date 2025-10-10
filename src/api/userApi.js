import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const USER_SERVICE = process.env.REACT_APP_USER_SERVICE;

export const fetchUserProfile = () => api.get(`${BASE_URL}${USER_SERVICE}/manager/profile`);
export const updateUserProfile = (data) => api.put(`${BASE_URL}${USER_SERVICE}/profile`, data);
