import { useCallback, useState } from "react";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

/**
 * Satu-satunya tempat logika logout. Layar mana pun yang butuh
 * tombol Keluar memakai hook ini — jangan tulis ulang signOut manual.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      // Buang cache milik user lama agar tidak bocor ke user berikutnya
      // yang login di HP yang sama.
      queryClient.clear();
    } finally {
      router.replace("/(auth)/login");
    }
  }, [queryClient, isLoggingOut]);

  return { logout, isLoggingOut };
}
