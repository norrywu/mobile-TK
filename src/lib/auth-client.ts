import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { ENV } from "@/configs";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  baseURL: ENV.authBaseUrl,
  plugins: [
    expoClient({
      scheme: ENV.scheme,
      storagePrefix: ENV.storagePrefix,
      storage: SecureStore,
    }),
    // Teruskan ac + roles kustom agar tipe client (mis. role
    // createUser: "admin" | "student") selaras dengan backend.
    adminClient({ ac, roles }),
  ],
});
