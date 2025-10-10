import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const BOOKING_SERVICE = process.env.REACT_APP_BOOKING_SERVICE;

export const getInvoice = (id) => api.get(`${BASE_URL}${BOOKING_SERVICE}/bookings/${id}`);
