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

type RoleChoice = "student" | "admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(
  name: string,
  email: string,
  password: string,
): string | null {
  if (name.trim().length < 3) return "Nama minimal 3 karakter.";
  if (!EMAIL_RE.test(email.trim())) return "Format email tidak valid.";
  if (password.length < 8) return "Kata sandi minimal 8 karakter.";
  return null;
}

function toIndonesian(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already exists") || lower.includes("duplicate")) {
    return "Email sudah terdaftar. Pakai email lain.";
  }
  if (lower.includes("forbidden") || lower.includes("unauthorized")) {
    return "Sesi berakhir atau bukan admin. Masuk kembali.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Tidak dapat menghubungi server. Periksa koneksi dan alamat server.";
  }
  return message || "Gagal membuat pengguna.";
}

export default function AdminUsersScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleChoice>("student");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    const invalid = validate(name, email, password);
    if (invalid) {
      setError(invalid);
      setSuccess(null);
      return;
    }
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const { error: createError } = await authClient.admin.createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      if (createError) {
        setError(toIndonesian(createError.message ?? ""));
        return;
      }
      setSuccess(
        `Akun ${role === "admin" ? "admin" : "siswa"} "${email.trim()}" berhasil dibuat.`,
      );
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
    } catch (err) {
      setError(toIndonesian(err instanceof Error ? err.message : ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Kembali</Text>
      </Pressable>

      <Text style={styles.title}>Tambah Pengguna</Text>
      <Text style={styles.subtitle}>
        Buat akun baru. Hanya admin yang bisa menambah pengguna.
      </Text>

      <Text style={styles.label}>Nama Lengkap</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        autoCapitalize="words"
        autoComplete="name"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />

      <Text style={styles.label}>Alamat Email</Text>
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
        placeholder="Minimal 8 karakter"
        secureTextEntry
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        onSubmitEditing={handleCreate}
      />

      <Text style={styles.label}>Peran</Text>
      <View style={styles.roles}>
        {(["student", "admin"] as RoleChoice[]).map((choice) => (
          <Pressable
            key={choice}
            style={[
              styles.roleButton,
              role === choice && styles.roleButtonActive,
            ]}
            onPress={() => setRole(choice)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.roleText,
                role === choice && styles.roleTextActive,
              ]}
            >
              {choice === "student" ? "Siswa" : "Admin"}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleCreate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buat Akun</Text>
        )}
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
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: "#208AEF",
    fontWeight: "600",
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
  roles: {
    flexDirection: "row",
    gap: 8,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  roleButtonActive: {
    borderColor: "#208AEF",
    backgroundColor: "#208AEF22",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#208AEF",
  },
  error: {
    color: "#c00",
    fontSize: 14,
    marginTop: 8,
  },
  success: {
    color: "#0a7d2c",
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
