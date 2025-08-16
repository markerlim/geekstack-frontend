// lib/apiClient.ts
import axios from 'axios';
import { auth } from './firebase';
import { getApiBaseUrl } from './apiBase';

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true // Add this line
});

apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth for specific endpoints
    if (config.url?.includes('/api/user/update/image')) {
      return config;
    }

    // Wait for auth to initialize on refresh
    await auth.authStateReady(); // <-- Key addition
    
    const user = auth.currentUser;
    if (!user) return config;

    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      console.error('Token error:', error);
      return config; // Continue request without token rather than failing
    }
  },
  (error) => Promise.reject(error)
);

export default apiClient;