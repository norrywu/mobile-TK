import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Urutan tulis = urutan tumpukan awal: login selalu pertama. */}
      <Stack.Screen name="login" />
      <Stack.Screen name="test" />
    </Stack>
  );
}
