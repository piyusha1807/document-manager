import axios from "axios";

import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    toast.error(error.message);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // if (error.response.status === 401) {
      //   localStorage.removeItem("user");
      //   window.location.href = "/login"; // Redirect to login page
      // }

      if (error.response.status === 404) {
        toast.error(error.message);
      } else {
        toast.error(error.response.data.message);
      }
    } else if (error.request) {
      // Timeout or other network errors
      toast.error(error.request);
    } else {
      // axios instance error
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
