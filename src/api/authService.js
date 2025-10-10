import axios from 'axios';
import { getRefreshToken, setTokens, clearTokens } from '../utils/tokenUtils';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';
const USER_SERVICE = process.env.REACT_APP_USER_SERVICE || 'user-service';

const api = axios.create({
  baseURL: BASE_URL,
});

export const refreshAccessToken = async () => {
  try {

    const response = await api.post(`${USER_SERVICE}/auth/refresh`, {
      refresh_token: getRefreshToken(),
    });

    const { access_token, refresh_token } = response.data.result;

    setTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    return access_token;
  } catch (err) {
    clearTokens();
    console.error('Refresh token failed:', err);
    window.location.href = `${USER_SERVICE}/login`;
    return null;
  }
};
