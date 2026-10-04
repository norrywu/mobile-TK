import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BackendUser } from "@/services/admin.service";

interface UserRowProps {
  user: BackendUser;
  onPress: () => void;
}

export function UserRow({ user, onPress }: UserRowProps) {
  const isAdmin = user.role === "admin";
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.identity}>
        <Text style={styles.name}>{user.name || "Tanpa nama"}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <Text style={[styles.badge, isAdmin && styles.badgeAdmin]}>
        {isAdmin ? "Admin" : "Siswa"}
      </Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  email: {
    fontSize: 13,
    opacity: 0.6,
  },
  badge: {
    fontSize: 12,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeAdmin: {
    borderColor: "#208AEF",
    color: "#208AEF",
  },
  chevron: {
    fontSize: 20,
    opacity: 0.4,
  },
});
