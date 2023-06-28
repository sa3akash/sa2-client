import axios from 'axios';

export const baseUrl = `${import.meta.env.VITE_BASE_URL}/api/v1`;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});

// api call

export default api;
