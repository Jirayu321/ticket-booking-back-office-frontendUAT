import { useQuery } from "@tanstack/react-query";
import { getViewEventStocks } from "../../services/view-event-stock.service";
import toast from "react-hot-toast";

export function useFetchViewEventStocks({ eventId }: { eventId: number }) {
  const query = useQuery({
    queryKey: ["get view event stocks", eventId],
    queryFn: async () => {
      try {
        return await getViewEventStocks({ eventId });
      } catch (error: any) {
        toast.error(error.message);
        return null;
      }
    },
    enabled : Boolean(eventId)
  });
  return query;
}
