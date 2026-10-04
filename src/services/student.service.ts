import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "./endpoints";

export interface StudentProfile {
  id: string;
  qrCode: string | null;
  gender: "laki-laki" | "perempuan" | null;
}

interface StudentProfileResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
}

export const studentService = {
  getMyProfile: async (): Promise<StudentProfile> => {
    const response = await api.get<StudentProfileResponse>(
      API_ENDPOINTS.STUDENTS.ME,
    );
    return response.data.data;
  },
};
