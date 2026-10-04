import { useQuery } from "@tanstack/react-query";
import { classService } from "@/services/class.service";

export const CLASSES_QUERY_KEY = ["classes"];

export function useClassesList() {
  return useQuery({
    queryKey: CLASSES_QUERY_KEY,
    queryFn: () => classService.listClasses(),
    staleTime: 1000 * 60 * 5,
  });
}
