import { useQuery } from "@tanstack/react-query";
import { getAllEventList } from "../../services/event-list.service";
import toast from "react-hot-toast";

export function useFetchEventList() {
  const query = useQuery({
    queryKey: ["get all event list"],
    queryFn: async () => {
      try {
        const { events } = await getAllEventList();
        return events || [];
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
  });
  return query;
}
