import { Stack } from "expo-router";
import { RoleGuard } from "@/components/guards/role-guard";

/**
 * Stack grup admin: sub-grup tab + layar detail (users, ...).
 * Layar di luar (tabs) otomatis BUKAN tab — tanpa href: null.
 */
export default function AdminGroupLayout() {
  return (
    <RoleGuard allowedRoles={["admin"]} redirectTo="/(student)/dashboard">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="users" options={{ title: "Kelola Pengguna" }} />
      </Stack>
    </RoleGuard>
  );
}
