import { create } from "axios";
import { authClient } from "./auth-client";
import { API_BASE_URL } from "@/configs";

export const api = create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Tempel cookie sesi dari SecureStore ke setiap request.
// RN tidak punya cookie jar seperti browser, jadi ini pengganti
// `withCredentials: true` di frontend web.
api.interceptors.request.use(async (config) => {
  // getCookie() sinkron (baca cache memori) — tanpa await.
  const cookies = authClient.getCookie();
  if (cookies) {
    config.headers.set("Cookie", cookies);
  }
  return config;
});

// Normalisasi error: selalu tolak dengan Error(message backend).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customErrorMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      "Terjadi kesalahan saat menghubungi server.";
    return Promise.reject(new Error(customErrorMessage));
  },
);

export default api;
