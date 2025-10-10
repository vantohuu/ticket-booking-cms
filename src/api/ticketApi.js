import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const BOOKING_SERVICE = process.env.REACT_APP_BOOKING_SERVICE;

export const getTickets = () => api.get(`${BASE_URL}${BOOKING_SERVICE}/tickets`);
export const getTicketById = (id) => api.get(`${BASE_URL}${BOOKING_SERVICE}/tickets/${id}`);
export const scanTicket = (data) => api.post(`${BASE_URL}${BOOKING_SERVICE}/tickets/scan`, data);
export const createTicket = (data) => api.post(`${BASE_URL}${BOOKING_SERVICE}/tickets`, data);
export const updateTicket = (id, data) => api.put(`${BASE_URL}${BOOKING_SERVICE}/tickets/${id}`, data);
export const deleteTicket = (id) => api.delete(`${BASE_URL}${BOOKING_SERVICE}/tickets/${id}`);