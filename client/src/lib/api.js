import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to normalize URLs starting with /api
api.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api/')) {
    config.url = config.url.slice(4); // remove '/api'
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return error without hijacking window location.
    // ProtectedRoute handles authorization guards gracefully.
    return Promise.reject(error);
  }
);

export default api;
