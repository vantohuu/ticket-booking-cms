import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getRooms = () => api.get(`${BASE_URL}rooms`);
export const getRoomsByCinema = (cinemaId) => api.get(`${BASE_URL}rooms/cinema/${cinemaId}`);
export const createRoom = (data) => api.post(`${BASE_URL}rooms`, data);
export const updateRoom = (id, data) => api.put(`${BASE_URL}rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`${BASE_URL}rooms/${id}`);