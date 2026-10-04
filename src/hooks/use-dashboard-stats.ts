import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { classService } from "@/services/class.service";
import { enrollmentService } from "@/services/enrollment.service";

export interface DashboardStats {
  students: number;
  classes: number;
  enrollments: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const [users, classes, enrollments] = await Promise.all([
        adminService.listUsers(),
        classService.listClasses(),
        enrollmentService.listEnrollments(),
      ]);
      return {
        students: users.filter((u) => u.role === "student").length,
        classes: classes.length,
        enrollments: enrollments.length,
      };
    },
  });
}
