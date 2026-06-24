import axios from "axios";

import { tokenStorage } from "@/storage/tokenStorage";

/*
 

 * Android emulator:
 * http://10.0.2.2:5000/api
 
 
 */
const BASE_URL ="http://10.0.2.2:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;