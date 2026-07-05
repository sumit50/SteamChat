import axios from "axios";
import type { RegisterData, LoginData, AuthResponse } from "../types/auth";
import { authStorage } from "../auth/authUtils";

// Dynamically resolve the backend host to support local network testing
const backendHost = typeof window !== "undefined" ? window.location.hostname : "localhost";

// Create configured Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${backendHost}:5000/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/users/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/users/login", data);
  return response.data;
};

// Simple profile test endpoint
export const getUserProfile = async () => {
  const response = await API.get("/users/profile");
  return response.data;
};

export default API;
