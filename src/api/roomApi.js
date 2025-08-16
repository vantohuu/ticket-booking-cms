import api from "./axiosInstance"

const BASE_URL = process.env.REACT_APP_API_URL

export const getRooms = () => api.get(`${BASE_URL}rooms/all`)
export const getRoomsPagination = (page = 0, size = 10, sort = "id,asc") =>
  api.get(`${BASE_URL}rooms?page=${page}&size=${size}&sort=${sort}`)
export const getRoomsByCinema = (cinemaId) => api.get(`${BASE_URL}rooms/cinema/${cinemaId}`)
export const createRoom = (data) => api.post(`${BASE_URL}rooms`, data)
export const updateRoom = (id, data) => api.put(`${BASE_URL}rooms/${id}`, data)
export const deleteRoom = (id) => api.delete(`${BASE_URL}rooms/${id}`)
