import axios from 'axios';
import { tokenStorage } from '@/storage/tokenStorage';

const BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
     'x-client-type': 'mobile', 
  },
});

// Attach access token to every request
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh when access token expires
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        await tokenStorage.clear();
        return Promise.reject(error);
      }

      // Call refresh endpoint
      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      // Save new access token
      await tokenStorage.saveTokens(data.data.accessToken, refreshToken); // ← data.data
      
      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`; // ← data.data
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;