import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

/**
 * Alamat backend. HP fisik tidak bisa memakai `localhost`,
 * jadi gunakan IP LAN laptop. Bisa dioverride lewat env:
 * EXPO_PUBLIC_API_URL=http://192.168.x.x:3001
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.11.157:3001";

/** Base URL backend tanpa path auth — dipakai wrapper API data. */
export const API_BASE_URL = API_URL;

export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
  plugins: [
    expoClient({
      scheme: "mobile",
      storagePrefix: "mobile",
      storage: SecureStore,
    }),
  ],
});
