import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
});

// Request interceptor for token
axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      // Refresh token logic : TODO
    }
    return Promise.reject(error);
  }
);