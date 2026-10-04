import { authClient } from "@/lib/auth-client";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
}

export const adminService = {
  listUsers: async (): Promise<BackendUser[]> => {
    const { data, error } = await authClient.admin.listUsers({ query: {} });
    if (error) {
      throw new Error(error.message || "Gagal memuat daftar pengguna.");
    }
    return data?.users ?? [];
  },

  getUser: async (id: string): Promise<BackendUser | null> => {
    const { data, error } = await authClient.admin.getUser({
      query: { id },
    });
    if (error) {
      throw new Error(error.message || "Gagal mengambil data pengguna.");
    }
    return data ?? null;
  },
};
