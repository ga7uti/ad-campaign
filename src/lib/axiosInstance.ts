import { paths } from '@/paths';
import axios from 'axios';
import path from 'path';

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
        const authEndpoints = [paths.auth.signIn, paths.auth.signUp,paths.auth.resetPassword];
        if (token && !authEndpoints.some(endpoint => config.url?.includes(endpoint))) {
        config.headers.Authorization = `Bearer ${token}`;
        }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;