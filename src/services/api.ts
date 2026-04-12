import axios from 'axios';
import { auth } from '../lib/firebase';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.error('Unauthorized access - 401');
    }
    return Promise.reject(error);
  }
);

export default api;
