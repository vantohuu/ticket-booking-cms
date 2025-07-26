// api/axiosInstance.js
import axios from 'axios';
import { getAccessToken } from '../utils/tokenUtils';
import { refreshAccessToken } from './authService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/'; 
const API_TIMEOUT = process.env.REACT_APP_API_TIMEOUT || 10000; 


const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT
});
// Gắn access token vào mỗi request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý token hết hạn tự động
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry thì thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry request với token mới
      }
    }

    return Promise.reject(error);
  }
);


// Interceptor cho request
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor cho response
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);


export default api;
