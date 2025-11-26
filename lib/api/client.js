import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://api.gardenhub.ae/api',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add locale to headers if needed
      const locale = localStorage.getItem('locale') || 'en';
      config.headers['Accept-Language'] = locale;
    }

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
    // Handle errors globally
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
