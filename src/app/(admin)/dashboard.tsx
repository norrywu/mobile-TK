import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardScreen() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string | null; email?: string | null }
    | undefined;

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Halo, {user?.name || user?.email || "Admin"}!
      </Text>
      <Text style={styles.subtitle}>Masuk sebagai Administrator.</Text>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Menu Admin</Text>
        <Text style={styles.menuItem}>• Scan QR (segera hadir)</Text>
        <Text style={styles.menuItem}>• Kelola (segera hadir)</Text>
      </View>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Keluar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  menu: {
    gap: 4,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  menuItem: {
    fontSize: 14,
  },
  button: {
    backgroundColor: "#c00",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
