import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter"),
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
  role: z.enum(["student", "admin"]),
  /** ID kelas yang diikuti — hanya dipakai bila role = student. */
  classIds: z.array(z.string()).default([]),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const editUserSchema = z
  .object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter"),
    role: z.enum(["student", "admin"]),
    newPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword.trim().length > 0) {
      if (data.newPassword.trim().length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: "Kata sandi baru minimal 8 karakter",
        });
      }
    }
  });

export type EditUserSchema = z.infer<typeof editUserSchema>;
