import axios from 'axios';

// Create an axios instance with the base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token in requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fat-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
