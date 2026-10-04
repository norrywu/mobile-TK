import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLogout } from "@/hooks/use-logout";

/**
 * Layar fallback untuk sesi yang role-nya tidak dikenal
 * (bukan "admin", bukan "student", atau null).
 * Mencegah ping-pong redirect antar guard grup.
 */
export default function NoRoleScreen() {
  const { logout, isLoggingOut } = useLogout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Akun Belum Punya Peran</Text>
      <Text style={styles.subtitle}>
        Akunmu tidak memiliki peran yang valid. Hubungi administrator untuk
        memperbaiki data akunmu, lalu masuk kembali.
      </Text>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#c00",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
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
