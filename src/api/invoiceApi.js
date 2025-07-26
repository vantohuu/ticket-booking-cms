import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getInvoice = (id) => api.get(`${BASE_URL}bookings/${id}`);
