import axios from 'axios';
import { API_BASE_URL } from '../context/AuthContext';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const storedUser = sessionStorage.getItem('hireverse_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        // Ignore JSON parse error
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
