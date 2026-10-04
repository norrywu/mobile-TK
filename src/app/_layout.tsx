import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout() {
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as { role?: string | null } | undefined)?.role;

  if (isPending) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="(auth)" />
        ) : role === "admin" ? (
          <Stack.Screen name="(admin)" />
        ) : role === "student" ? (
          <Stack.Screen name="(student)" />
        ) : (
          // Role tak dikenal/null: jangan mount grup mana pun (cegah loop
          // antar guard), tampilkan layar fallback sebagai gantinya.
          <Stack.Screen name="no-role" />
        )}
      </Stack>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
