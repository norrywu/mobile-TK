import { StyleSheet, Text, View } from "react-native";

export default function StudentQrStubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Saya</Text>
      <Text style={styles.subtitle}>QR identitasmu segera hadir di sini.</Text>
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
