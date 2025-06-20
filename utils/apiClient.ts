// lib/apiClient.ts
import axios from 'axios';
import { auth } from './firebase';
import { getApiBaseUrl } from './apiBase';

const apiClient = axios.create({
  baseURL: getApiBaseUrl()
});

apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth for specific endpoints
    if (config.url?.includes('/api/user/update/image')) {
      return config;
    }

    const user = auth.currentUser;
    
    if (!user) {
      return config;
    }

    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept ='application/json';
      config.headers['Content-Type'] ='application/json';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      console.log(config)
      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

export default apiClient;