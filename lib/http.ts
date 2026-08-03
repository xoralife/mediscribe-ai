import axios, { AxiosError } from "axios";
import { clearSession, getToken } from "./token";

/* Base URL from env, defaults to the local FastAPI backend. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://mediscribe-ai.fastapicloud.dev/api/v1";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

/* Attach the JWT on every request. */
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* On 401, clear the session and send the user back to the login page.
   On 403 for admin routes, the stored session no longer holds admin rights
   (stale/role-changed token) — same treatment so the dashboard can be recovered. */
http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 ||
      (error.response?.status === 403 && error.config?.url?.includes("/admin/"))
    ) {
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
export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data as { detail?: string; message?: string } | undefined;
    if (detail?.detail) return detail.detail;
    if (detail?.message) return detail.message;
    if (!error.response) {
      return "The contact service is temporarily unavailable. Please try again later.";
    }
    switch (error.response.status) {
      case 404:
        return "The contact service was not found. Please try again later.";
      case 422:
        return "The information you provided could not be processed. Please check your input and try again.";
      case 500:
        return "The server encountered an error. Please try again in a few moments.";
      default:
        return error.message || fallback;
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
