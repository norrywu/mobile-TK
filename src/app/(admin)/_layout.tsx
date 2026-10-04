import { Stack } from "expo-router";

/**
 * Stack grup admin: sub-grup tab + layar detail (users, ...).
 * Layar di luar (tabs) otomatis BUKAN tab — tanpa href: null.
 * Guard role TIDAK dipasang di sini (sengaja): gate akar (_layout.tsx)
 * sudah otoritatif memilih grup dari sesi yang sama. Guard ganda dengan
 * target lintas grup menyebabkan loop "Maximum update depth exceeded"
 * saat state sesi transien (login/logout) tidak sepakat antar render.
 */
export default function AdminGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="users" options={{ title: "Kelola Pengguna" }} />
    </Stack>
  );
}
