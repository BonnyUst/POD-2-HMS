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
        config.headers = config.headers || {};  // ← fix
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

            const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
                refreshToken,
            }, {
                headers: {
                    'x-client-type': 'mobile',
                },
            });

            const newAccessToken = data.data.accessToken;  // ← store in variable

            await tokenStorage.saveTokens(newAccessToken, refreshToken);

            originalRequest.headers = originalRequest.headers || {};  // ← fix
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default apiClient;