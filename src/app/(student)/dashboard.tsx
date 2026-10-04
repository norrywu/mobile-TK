import { Pressable, StyleSheet, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useLogout } from "@/hooks/use-logout";

export default function StudentDashboardScreen() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    { name?: string | null; email?: string | null } | undefined;

  const { logout, isLoggingOut } = useLogout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Halo, {user?.name || user?.email || "Siswa"}!
      </Text>
      <Text style={styles.subtitle}>Masuk sebagai Siswa.</Text>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Akun Saya</Text>
        <Text style={styles.menuItem}>• Email: {user?.email ?? "-"}</Text>
        <Text style={styles.menuItem}>• QR siswa (segera hadir)</Text>
      </View>

      <Pressable
        style={[styles.button, isLoggingOut && styles.buttonDisabled]}
        onPress={logout}
        disabled={isLoggingOut}
      >
        <Text style={styles.buttonText}>
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </Text>
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
  buttonDisabled: {
    opacity: 0.6,
  },
});
