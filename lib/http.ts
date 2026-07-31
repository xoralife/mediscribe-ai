import axios, { AxiosError } from "axios";
import { clearSession, getToken } from "./token";

/* Base URL from env, defaults to the local FastAPI backend. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

/* Attach the JWT on every request. */
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* On 401, clear the session and send the user back to the login page. */
http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* True when the backend is unreachable (network/connection error, not an HTTP error). */
export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

/* Surface a friendly message from an API/network failure. */
export function errorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data as { detail?: string; message?: string } | undefined;
    if (detail?.detail) return detail.detail;
    if (detail?.message) return detail.message;
    if (!error.response) return "Cannot reach the server. Check that the backend is running.";
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
