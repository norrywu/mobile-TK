import { StyleSheet, Text, View } from "react-native";

export default function AdminScanStubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR</Text>
      <Text style={styles.subtitle}>
        Layar scanner segera hadir di sini (expo-camera, khusus admin).
      </Text>
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
  },
});
