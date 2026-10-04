/**
 * Satu-satunya tempat konfigurasi environment mobile.
 *
 * Aturan Expo: hanya variabel berawalan `EXPO_PUBLIC_` yang terbaca
 * di aplikasi — dan nilainya TERTANAM di bundle JS saat build.
 * Artinya: file ini hanya untuk config PUBLIK (URL, scheme, prefix).
 * API key / secret (Gemini, dsb.) JANGAN taruh di sini — simpan di
 * backend, mobile memanggil backend yang meneruskannya.
 *
 * Cara pakai lokal: salin `.env.example` menjadi `.env.local`
 * (sudah di-gitignore) lalu sesuaikan IP LAN laptop.
 */

const DEFAULT_API_URL = "http://192.168.11.157:3001";

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

const apiUrl = normalizeUrl(process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL);

export const ENV = {
  /** Base URL backend, tanpa trailing slash. */
  apiUrl,
  /** Path auth better-auth di backend. */
  authPath: "/api/auth",
  /** Full URL untuk authClient. */
  authBaseUrl: `${apiUrl}/api/auth`,
  /** Harus sama dengan `scheme` di app.json. */
  scheme: "mobile",
  /** Awalan kunci SecureStore agar tidak tabrakan. */
  storagePrefix: "mobile",
} as const;

/** Base URL backend — dipakai axios instance dkk. */
export const API_BASE_URL = ENV.apiUrl;
