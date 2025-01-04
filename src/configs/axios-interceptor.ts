import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BE_URL,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   console.error("Unauthorized, redirecting to login...");
    // }
    return Promise.reject(error);
  }
);

export default apiClient;
