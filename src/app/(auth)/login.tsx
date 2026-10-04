import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";

function toIndonesian(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid email or password")) {
    return "Email atau kata sandi salah.";
  }
  if (lower.includes("email") && lower.includes("not verified")) {
    return "Email belum diverifikasi.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Tidak dapat menghubungi server. Periksa koneksi dan alamat server.";
  }
  return message || "Login gagal. Coba lagi.";
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Isi email dan kata sandi dulu.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(toIndonesian(signInError.message ?? ""));
        return;
      }
      const role = (data?.user as { role?: string | null } | undefined)?.role;
      router.replace(
        role === "admin" ? "/(admin)/dashboard" : "/(student)/dashboard",
      );
    } catch (err) {
      setError(toIndonesian(err instanceof Error ? err.message : ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk</Text>
      <Text style={styles.subtitle}>Aplikasi TK — masuk dengan akunmu</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="nama@contoh.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />

      <Text style={styles.label}>Kata Sandi</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        onSubmitEditing={handleLogin}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Masuk</Text>
        )}
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
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: {
    color: "#c00",
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
