import api from './axiosInstance';
import dayjs from 'dayjs';

const BASE_URL = process.env.REACT_APP_API_URL;
const MOVIE_SERVICE = process.env.REACT_APP_MOVIE_SERVICE;

export const getReport = (reportType, data) => {
  return api.get(`${BASE_URL}${MOVIE_SERVICE}/reports/${reportType}`, {
    params: {
      from: dayjs(data.fromDate).startOf('day').format("YYYY-MM-DDTHH:mm:ss").toString(),
      to: dayjs(data.toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss").toString(),
    },
  });
};