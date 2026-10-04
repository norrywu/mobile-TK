import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useUsersList } from "@/hooks/use-users";
import { UserRow } from "@/components/users/user-row";

function toIndonesian(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Tidak dapat menghubungi server. Periksa koneksi dan alamat server.";
  }
  if (lower.includes("unauthorized") || lower.includes("forbidden")) {
    return "Sesi berakhir atau bukan admin. Masuk kembali.";
  }
  return message || "Gagal memuat daftar pengguna.";
}

export default function UsersIndexScreen() {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useUsersList();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {toIndonesian(error instanceof Error ? error.message : "")}
        </Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengguna</Text>
      <Text style={styles.subtitle}>
        Total: {users.length} akun terdaftar. Ketuk baris untuk mengedit.
      </Text>
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/(admin)/users/create")}
      >
        <Text style={styles.addButtonText}>+ Tambah Pengguna</Text>
      </Pressable>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
          />
        }
        renderItem={({ item }) => (
          <UserRow
            user={item}
            onPress={() =>
              router.push({
                pathname: "/(admin)/users/edit",
                params: { userId: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada pengguna terdaftar.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  addButton: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  list: {
    gap: 8,
    paddingBottom: 16,
  },
  empty: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 32,
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
});
