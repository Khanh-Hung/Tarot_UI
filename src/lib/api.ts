import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
export const ACCOUNT_API_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const accountApiClient = axios.create({
  baseURL: ACCOUNT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachInterceptors = (client: typeof apiClient) => {
  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("tarot_jwt_token");
      if (token) {
        if (config.headers && typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (error.response?.status === 401 && !isLoginRequest) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("tarot_jwt_token");
          localStorage.removeItem("tarot_user");
        }
      }
      return Promise.reject(error);
    }
  );
};

attachInterceptors(apiClient);
attachInterceptors(accountApiClient);