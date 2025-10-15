import axios from 'axios';
import API_BASE_URL from '../config/api.config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || error.response.data.detail || 'Server error');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server');
    } else {
      // Error in request setup
      throw new Error(error.message);
    }
  }
);

export default apiClient;
