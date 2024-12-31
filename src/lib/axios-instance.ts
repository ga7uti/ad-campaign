import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const authEndpoints = ['/token', '/reset-password', '/register'];
      if (token && !authEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error:Error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;