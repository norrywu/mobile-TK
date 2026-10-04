import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";

export type UserFormMode = "create" | "edit";

interface UserFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  isSubmitting: boolean;
  mode: UserFormMode;
  onSubmitPassword: () => void;
}

const ROLE_CHOICES = [
  { value: "student", label: "Siswa" },
  { value: "admin", label: "Admin" },
] as const;

function fieldMessage(errors: FieldErrors, name: string): string | undefined {
  const entry = (errors as Record<string, { message?: unknown }>)[name];
  return typeof entry?.message === "string" ? entry.message : undefined;
}

/**
 * Field nama + email + password + picker peran untuk form pengguna.
 * Mode create: email wajib + password wajib. Mode edit: tanpa email,
 * password opsional (label menyesuaikan).
 */
export function UserFormFields<T extends FieldValues>({
  control,
  errors,
  isSubmitting,
  mode,
  onSubmitPassword,
}: UserFormFieldsProps<T>) {
  const passwordName = (
    mode === "create" ? "password" : "newPassword"
  ) as Path<T>;
  const err = (name: string) => {
    const message = fieldMessage(errors, name);
    return message ? <Text style={styles.fieldError}>{message}</Text> : null;
  };

  return (
    <View style={styles.fields}>
      <Text style={styles.label}>Nama Lengkap</Text>
      <Controller
        control={control}
        name={"name" as Path<T>}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder="Nama lengkap"
            autoCapitalize="words"
            autoComplete="name"
            value={(field.value as string | undefined) ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            editable={!isSubmitting}
          />
        )}
      />
      {err("name")}

      {mode === "create" ? (
        <>
          <Text style={styles.label}>Alamat Email</Text>
          <Controller
            control={control}
            name={"email" as Path<T>}
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="nama@contoh.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                value={(field.value as string | undefined) ?? ""}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                editable={!isSubmitting}
              />
            )}
          />
          {err("email")}
        </>
      ) : null}

      <Text style={styles.label}>
        {mode === "create" ? "Kata Sandi" : "Kata Sandi Baru (Opsional)"}
      </Text>
      <Controller
        control={control}
        name={passwordName}
        render={({ field }) => (
          <TextInput
            style={styles.input}
            placeholder={
              mode === "create"
                ? "Minimal 8 karakter"
                : "Kosongkan bila tidak diubah"
            }
            secureTextEntry
            autoComplete="new-password"
            value={(field.value as string | undefined) ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            editable={!isSubmitting}
            onSubmitEditing={onSubmitPassword}
          />
        )}
      />
      {err(mode === "create" ? "password" : "newPassword")}

      <Text style={styles.label}>Peran</Text>
      <Controller
        control={control}
        name={"role" as Path<T>}
        render={({ field }) => (
          <View style={styles.roles}>
            {ROLE_CHOICES.map((choice) => (
              <Pressable
                key={choice.value}
                style={[
                  styles.roleButton,
                  field.value === choice.value && styles.roleButtonActive,
                ]}
                onPress={() => field.onChange(choice.value)}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.roleText,
                    field.value === choice.value && styles.roleTextActive,
                  ]}
                >
                  {choice.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 8,
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
  fieldError: {
    color: "#c00",
    fontSize: 12,
    marginTop: 2,
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
});
