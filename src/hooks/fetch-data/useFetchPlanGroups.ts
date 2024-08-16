import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllPlanGroups } from "../../services/plan-group.service";

export function useFetchPlanGroups() {
  const query = useQuery({
    queryKey: ["get all plan groups"],
    queryFn: async () => {
      try {
        const { planGroups } = await getAllPlanGroups();
        return planGroups || [];
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
  });
  return query;
}
