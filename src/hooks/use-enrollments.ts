import { useQuery } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollment.service";

export const ENROLLMENTS_QUERY_KEY = ["enrollments"];

export function useEnrollments() {
  return useQuery({
    queryKey: ENROLLMENTS_QUERY_KEY,
    queryFn: () => enrollmentService.listEnrollments(),
    staleTime: 1000 * 60 * 2,
  });
}
