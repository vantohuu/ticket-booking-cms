import api from './axiosInstance';

const BASE_URL = process.env.REACT_APP_API_URL;
const CINEMA_SERVICE = process.env.REACT_APP_CINEMA_SERVICE;

export const getSeats = () => api.get(`${BASE_URL}${CINEMA_SERVICE}/seats`);
export const getSeatsByRoom = (roomId) => api.get(`${BASE_URL}${CINEMA_SERVICE}/seats/room/${roomId}`);
