import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "./endpoints";

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
}

interface ListUsersResponse {
  users?: BackendUser[];
}

export const adminService = {
  listUsers: async (): Promise<BackendUser[]> => {
    const response = await api.get<ListUsersResponse | BackendUser[]>(
      API_ENDPOINTS.ADMIN.LIST_USERS,
    );
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.users ?? [];
  },
};
