import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { tokenStorage } from "@/storage/tokenStorage";

const BASE_URL = "http://10.0.2.2:5000/api";

interface RetryRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "mobile",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken =
      await tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const requestUrl =
      originalRequest.url || "";

    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes(
        "/auth/refresh-token"
      )
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken =
      await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      await tokenStorage.clear();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/refresh-token`,
        {
          refreshToken,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
            "x-client-type": "mobile",
          },
        }
      );

      const newAccessToken =
        response.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "New access token was not returned"
        );
      }

      await tokenStorage.saveTokens(
        newAccessToken,
        refreshToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      await tokenStorage.clear();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;