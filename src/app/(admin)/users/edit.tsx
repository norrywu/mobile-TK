import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, type BackendUser } from "@/services/admin.service";
import { ENROLLMENTS_QUERY_KEY, useEnrollments } from "@/hooks/use-enrollments";
import { useClassesList } from "@/hooks/use-classes";
import { enrollmentService } from "@/services/enrollment.service";
import { USERS_QUERY_KEY, useUpdateUser } from "@/hooks/use-users";
import {
  editUserSchema,
  type EditUserSchema,
} from "@/validations/user-validation";
import { applyZodErrors } from "@/utils/zod-errors";
import { UserFormFields } from "@/components/users/user-form-fields";
import { ClassPicker } from "@/components/users/class-picker";

function toIndonesian(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("forbidden") || lower.includes("unauthorized")) {
    return "Sesi berakhir atau bukan admin. Masuk kembali.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Tidak dapat menghubungi server. Periksa koneksi dan alamat server.";
  }
  return message || "Gagal memperbarui pengguna.";
}

function EditForm({ user }: { user: BackendUser }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // null = belum dimuat dari enrollments; string[] = pilihan saat ini.
  const [classIds, setClassIds] = useState<string[] | null>(null);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditUserSchema>({
    defaultValues: {
      name: user.name || "",
      role: (user.role as "admin" | "student") || "student",
      newPassword: "",
    },
  });

  const selectedRole = watch("role");
  const { data: classes = [] } = useClassesList();
  const { data: enrollments = [], isLoading: isEnrollmentsLoading } =
    useEnrollments();

  // Inisialisasi centangan sekali dari keanggotaan saat ini.
  useEffect(() => {
    if (!isEnrollmentsLoading && classIds === null) {
      setClassIds(
        enrollments.filter((e) => e.userId === user.id).map((e) => e.classId),
      );
    }
  }, [enrollments, isEnrollmentsLoading, user.id, classIds]);

  const toggleClass = (classId: string) => {
    setClassIds((prev) =>
      (prev ?? []).includes(classId)
        ? (prev ?? []).filter((id) => id !== classId)
        : [...(prev ?? []), classId],
    );
  };

  const { mutateAsync: updateUserAsync } = useUpdateUser();

  const submit = (values: EditUserSchema) => {
    const parsed = editUserSchema.safeParse(values);
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
        await updateUserAsync({ userId: user.id, data: parsed.data });
        // Tahap 2: sinkronkan kelas (hanya student yang boleh punya kelas;
        // pindah ke admin otomatis mengosongkan).
        const nextClassIds =
          parsed.data.role === "student" ? (classIds ?? []) : [];
        try {
          await enrollmentService.setUserClasses(user.id, nextClassIds);
          await queryClient.invalidateQueries({
            queryKey: ENROLLMENTS_QUERY_KEY,
          });
        } catch (err) {
          setServerError(
            `Data tersimpan, tapi kelas gagal: ${toIndonesian(
              err instanceof Error ? err.message : "",
            )} Coba lagi nanti.`,
          );
          return;
        }
        setSuccess(
          `Data "${parsed.data.name || user.email}" berhasil diperbarui.`,
        );
      } catch (err) {
        setServerError(toIndonesian(err instanceof Error ? err.message : ""));
      }
    })();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Kembali</Text>
      </Pressable>

      <Text style={styles.title}>Edit Pengguna</Text>
      <Text style={styles.subtitle}>{user.email}</Text>

      <UserFormFields
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        mode="edit"
        onSubmitPassword={handleSubmit(submit)}
      />

      {selectedRole === "student" ? (
        <View style={styles.classSection}>
          <Text style={styles.label}>Kelas yang Diikuti</Text>
          {classIds === null ? (
            <ActivityIndicator />
          ) : (
            <ClassPicker
              classes={classes}
              selectedIds={classIds}
              onToggle={toggleClass}
              disabled={isSubmitting}
            />
          )}
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
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
        )}
      </Pressable>
    </View>
  );
}

export default function EditUserScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const queryClient = useQueryClient();

  const cached = queryClient
    .getQueryData<BackendUser[]>(USERS_QUERY_KEY)
    ?.find((u) => u.id === userId);

  const {
    data: fetched,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: () => adminService.getUser(userId ?? ""),
    enabled: !!userId && !cached,
    staleTime: 1000 * 60,
  });

  const target = cached ?? fetched ?? null;

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>ID pengguna tidak ditemukan.</Text>
      </View>
    );
  }

  if (!target) {
    return (
      <View style={styles.center}>
        {isFetching || (!cached && !isError) ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text style={styles.error}>Pengguna tidak ditemukan.</Text>
        )}
      </View>
    );
  }

  return <EditForm key={target.id} user={target} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
    textAlign: "center",
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
