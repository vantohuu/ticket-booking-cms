import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getShowtimes = () => api.get(`${BASE_URL}showtimes`);
export const getAvailableSeats = (id) => api.get(`${BASE_URL}showtimes/${id}/available-seats`);
export const getShowtimeById = (id) => api.get(`${BASE_URL}showtimes/${id}`);
export const getBookedTickets = (id) => api.get(`${BASE_URL}showtimes/${id}/booked-tickets`);
export const createShowtime = (data) => api.post(`${BASE_URL}showtimes`, data);
export const updateShowtime = (id, data) => api.put(`${BASE_URL}showtimes/${id}`, data);
export const deleteShowtime = (id) => api.delete(`${BASE_URL}showtimes/${id}`);