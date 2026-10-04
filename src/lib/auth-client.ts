import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { ENV } from "@/configs";

export const authClient = createAuthClient({
  baseURL: ENV.authBaseUrl,
  plugins: [
    expoClient({
      scheme: ENV.scheme,
      storagePrefix: ENV.storagePrefix,
      storage: SecureStore,
    }),
  ],
});
