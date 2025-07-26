import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getSeats = () => api.get(`${BASE_URL}seats`);
export const getSeatsByRoom = (roomId) => api.get(`${BASE_URL}seats/room/${roomId}`);
