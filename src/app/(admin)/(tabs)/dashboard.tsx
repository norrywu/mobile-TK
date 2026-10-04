import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useLogout } from "@/hooks/use-logout";

function toIndonesian(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Tidak dapat menghubungi server. Periksa koneksi dan alamat server.";
  }
  if (lower.includes("unauthorized") || lower.includes("forbidden")) {
    return "Sesi berakhir atau bukan admin. Masuk kembali.";
  }
  return message || "Gagal memuat statistik.";
}

export default function AdminDashboardScreen() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    { name?: string | null; email?: string | null } | undefined;

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardStats();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const { logout, isLoggingOut } = useLogout();

  const cards = stats
    ? [
        { label: "Siswa", value: stats.students },
        { label: "Kelas", value: stats.classes },
        { label: "Terdaftar di Kelas", value: stats.enrollments },
      ]
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Halo, {user?.name || user?.email || "Admin"}!
      </Text>
      <Text style={styles.subtitle}>Masuk sebagai Administrator.</Text>

      <Text style={styles.menuTitle}>Ringkasan</Text>
      {isLoading && !stats ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : isError && !stats ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {toIndonesian(error instanceof Error ? error.message : "")}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.cards}>
          {cards.map((card) => (
            <View key={card.label} style={styles.card}>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
          ))}
        </View>
      )}
      {isError && stats ? (
        <Text style={styles.inlineError}>
          {toIndonesian(error instanceof Error ? error.message : "")}
        </Text>
      ) : null}

      <Text style={styles.menuTitle}>Menu Admin</Text>
      <Pressable
        style={styles.menuButton}
        onPress={() => router.push("/(admin)/scan")}
      >
        <Text style={styles.menuButtonText}>Scan QR</Text>
      </Pressable>
      <Pressable
        style={styles.menuButton}
        onPress={() => router.push("/(admin)/users")}
      >
        <Text style={styles.menuButtonText}>Kelola Pengguna</Text>
      </Pressable>

      <Pressable
        style={[styles.logoutButton, isLoggingOut && styles.buttonDisabled]}
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
    padding: 24,
    gap: 8,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  center: {
    alignItems: "center",
    paddingVertical: 24,
  },
  cards: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  cardLabel: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
  errorBox: {
    borderWidth: 1,
    borderColor: "#c00",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  inlineError: {
    color: "#c00",
    fontSize: 12,
  },
  menuButton: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#c00",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
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
