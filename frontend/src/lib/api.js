import axios from 'axios';
import toast from 'react-hot-toast';

// Create an instance of axios with default settings
const api = axios.create({
  // Get the backend URL from our environment variables
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies if ever needed
});

/**
 * Request Interceptor:
 * This runs before every single request is sent from the frontend.
 * Its job is to retrieve the JWT token from localStorage and attach it to the
 * Authorization header, so the backend knows who is making the request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * This runs after every single response is received from the backend.
 * Its primary job is to handle global errors, like a 401 Unauthorized error,
 * which typically means the user's token has expired.
 */
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // --- CRITICAL: Handle expired tokens globally ---
    if (error.response && error.response.status === 401) {
      // We check if the user is not already on the login page to avoid redirect loops
      if (window.location.pathname !== '/login') {
        toast.error('Your session has expired. Please log in again.');
        // Remove the invalid token
        localStorage.removeItem('token');
        // Force a full page reload to clear all state and redirect to login
        window.location.href = '/login';
      }
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);


export default api;
