import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  createUserSchema,
  type CreateUserSchema,
} from "@/validations/user-validation";
import { applyZodErrors } from "@/utils/zod-errors";
import { UserFormFields } from "@/components/users/user-form-fields";
import { ClassPicker } from "@/components/users/class-picker";
import { useClassesList } from "@/hooks/use-classes";
import { USERS_QUERY_KEY } from "@/hooks/use-users";
import { ENROLLMENTS_QUERY_KEY } from "@/hooks/use-enrollments";
import { enrollmentService } from "@/services/enrollment.service";

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

export default function CreateUserScreen() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setError: setFieldError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      classIds: [],
    },
  });

  const selectedRole = watch("role");
  const selectedClassIds = watch("classIds") ?? [];
  const { data: classes = [] } = useClassesList();

  const toggleClass = (classId: string) => {
    setValue(
      "classIds",
      selectedClassIds.includes(classId)
        ? selectedClassIds.filter((id) => id !== classId)
        : [...selectedClassIds, classId],
      { shouldDirty: true },
    );
  };

  const submit = (values: CreateUserSchema) => {
    const parsed = createUserSchema.safeParse(values);
    if (!parsed.success) {
      applyZodErrors(parsed.error, setFieldError);
      setServerError(null);
      setSuccess(null);
      return Promise.resolve();
    }
    setServerError(null);
    setSuccess(null);
    return (async () => {
      try {
        const { data, error: createError } = await authClient.admin.createUser({
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password,
          role: parsed.data.role,
        });
        if (createError || !data?.user) {
          setServerError(toIndonesian(createError?.message ?? ""));
          return;
        }
        // Tahap 2 (khusus siswa): masukkan ke kelas terpilih.
        const classIds =
          parsed.data.role === "student" ? (parsed.data.classIds ?? []) : [];
        if (classIds.length > 0) {
          try {
            await enrollmentService.setUserClasses(data.user.id, classIds);
            await queryClient.invalidateQueries({
              queryKey: ENROLLMENTS_QUERY_KEY,
            });
          } catch (err) {
            setServerError(
              `Akun terbuat, tapi kelas gagal: ${toIndonesian(
                err instanceof Error ? err.message : "",
              )} Atur lewat Edit.`,
            );
            reset();
            return;
          }
        }
        const classNote =
          classIds.length > 0 ? ` + ${classIds.length} kelas` : "";
        await queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        setSuccess(
          `Akun ${parsed.data.role === "admin" ? "admin" : "siswa"} "${parsed.data.email}" berhasil dibuat${classNote}.`,
        );
        reset();
      } catch (err) {
        setServerError(toIndonesian(err instanceof Error ? err.message : ""));
      }
    })();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Kembali</Text>
      </Pressable>

      <Text style={styles.title}>Tambah Pengguna</Text>
      <Text style={styles.subtitle}>
        Buat akun baru. Hanya admin yang bisa menambah pengguna.
      </Text>

      <UserFormFields
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        mode="create"
        onSubmitPassword={handleSubmit(submit)}
      />

      {selectedRole === "student" ? (
        <View style={styles.classSection}>
          <Text style={styles.label}>Masukkan ke Kelas (Opsional)</Text>
          <ClassPicker
            classes={classes}
            selectedIds={selectedClassIds}
            onToggle={toggleClass}
            disabled={isSubmitting}
          />
        </View>
      ) : null}

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <Pressable
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(submit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buat Akun</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  classSection: {
    gap: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
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
