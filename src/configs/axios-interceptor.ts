import { AuthResponse } from "@/store/slices/auth/types";
import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const credentialsCookie = Cookies.get("credentials");
    const credentialsObject = credentialsCookie
      ? (JSON.parse(credentialsCookie) as AuthResponse)
      : null;

    if (credentialsObject) {
      config.headers.Authorization = `Bearer ${credentialsObject.jwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
