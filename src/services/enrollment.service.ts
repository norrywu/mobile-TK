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

  setUserClasses: async (
    userId: string,
    classIds: string[],
  ): Promise<EnrollmentItem[]> => {
    const response = await api.put<EnrollmentListResponse>(
      API_ENDPOINTS.ENROLLMENTS.SET_USER_CLASSES(userId),
      { classIds },
    );
    return response.data?.data ?? [];
  },
};
