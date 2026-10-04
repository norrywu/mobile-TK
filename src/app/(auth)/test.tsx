import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

/**
 * Layar contoh: membuktikan file baru di folder (auth) otomatis jadi rute
 * /(auth)/test tanpa didaftarkan di mana pun. Boleh dihapus kapan saja.
 */
export default function AuthTestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Layar Tes Auth</Text>
      <Text style={styles.subtitle}>
        Rute ini lahir otomatis dari nama file: (auth)/test.tsx
      </Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kembali</Text>
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
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#208AEF",
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
});
