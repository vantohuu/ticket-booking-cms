import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getTickets = () => api.get(`${BASE_URL}tickets`);
export const getTicketById = (id) => api.get(`${BASE_URL}tickets/${id}`);
export const scanTicket = (data) => api.post(`${BASE_URL}tickets/scan`, data);
export const createTicket = (data) => api.post(`${BASE_URL}tickets`, data);
export const updateTicket = (id, data) => api.put(`${BASE_URL}tickets/${id}`, data);
export const deleteTicket = (id) => api.delete(`${BASE_URL}tickets/${id}`);