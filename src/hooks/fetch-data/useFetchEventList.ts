import { useQuery } from "@tanstack/react-query";
import {
  getAllEventList,
  getEventById,
} from "../../services/event-list.service";
import toast from "react-hot-toast";

export function useFetchEventList({ eventId }: { eventId: number | null }) {
  const query = useQuery({
    queryKey: ["get event by id", eventId],
    queryFn: async () => {
      let events: any | null = null;
      try {
        if (eventId !== null) {
          const event = await getEventById(eventId);
          events = event;
        } else {
          const data = await getAllEventList();
          events = data.events;
        }
        return events;
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        return events;
      }
    },
  });
  return query;
}
