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
      try {
        if (eventId !== null) {
          const event = await getEventById(eventId);
          return event;
        } else {
          const data = await getAllEventList();
          return data?.events;
        }
      } catch (error: any) {
        toast.error(error.message);
        return null; // Return null if an error occurs
      }
    },
    refetchOnWindowFocus: false, // ปิดการโหลดใหม่เมื่อกลับมาที่หน้านี้
  });
  return query;
}
