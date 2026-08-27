import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lostlink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Network error';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Health check
export const checkHealth = () => api.get('/health');

export default api;