import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "./endpoints";

export interface ClassItem {
  id: string;
  name: string;
}

interface ClassListResponse {
  success: boolean;
  message: string;
  data: ClassItem[];
}

export const classService = {
  listClasses: async (): Promise<ClassItem[]> => {
    const response = await api.get<ClassListResponse>(API_ENDPOINTS.CLASS.LIST);
    return response.data?.data ?? [];
  },
};
