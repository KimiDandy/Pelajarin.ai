// d:/Portofolio/Project/pelajarin.ai/frontend/services/api.ts

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in requests
api.interceptors.request.use(
  (config) => {
    // Check if window is defined (to ensure it runs only on the client-side)
    if (typeof window !== 'undefined') {
      // Use 'access_token' as the consistent key
      const token = localStorage.getItem('access_token');
      if (token) {
        // The token is a raw string, no need to parse JSON
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here, e.g., for 401 Unauthorized
    const message = error.response?.data?.detail || error.message || 'An unknown error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
