import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event so AuthContext immediately clears user state
      window.dispatchEvent(new Event('auth:unauthorized'));
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/courses')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
