import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { authClient } from "@/lib/auth-client";
import type { EditUserSchema } from "@/validations/user-validation";

export const USERS_QUERY_KEY = ["admin", "users"];

export function useUsersList() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => adminService.listUsers(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: EditUserSchema;
    }) => {
      // 1. Nama dan role via update-user.
      await authClient.admin.updateUser({
        userId,
        data: { name: data.name, role: data.role },
      });
      // 2. Password HANYA via set-user-password (aturan server:
      //    update-user menolak field password).
      const trimmed = data.newPassword?.trim();
      if (trimmed && trimmed.length > 0) {
        await authClient.admin.setUserPassword({
          userId,
          newPassword: trimmed,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}
