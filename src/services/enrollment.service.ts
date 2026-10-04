import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "./endpoints";

export interface EnrollmentItem {
  userId: string;
  classId: string;
  className: string | null;
}

interface EnrollmentListResponse {
  success: boolean;
  message: string;
  data: EnrollmentItem[];
}

export const enrollmentService = {
  listEnrollments: async (): Promise<EnrollmentItem[]> => {
    const response = await api.get<EnrollmentListResponse>(
      API_ENDPOINTS.ENROLLMENTS.LIST,
    );
    return response.data?.data ?? [];
  },
};
