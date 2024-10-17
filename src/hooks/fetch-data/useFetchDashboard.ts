import { useQuery } from "@tanstack/react-query";
import {
  getAllEventList,
  getEventById,
} from "../../services/event-list.service";
import { getOrderAll } from "../../services/order-all.service";

import toast from "react-hot-toast";

export function useFetchDashboard({ eventId }: { eventId: number | null }) {
  const query = useQuery({
    queryKey: ["get event by id", eventId],
    queryFn: async () => {
      try {
        if (eventId !== null) {
          const event = await getEventById(eventId);
          if (!event) {
            throw new Error("ไม่พบข้อมูลของ event ที่เลือก");
          }
          return event;
        } else {
          const [dataAllEvent, dataAllOrder] = await Promise.all([
            getAllEventList(),
            getOrderAll(),
          ]);

          if (!dataAllEvent || !dataAllOrder) {
            throw new Error("ไม่สามารถดึงข้อมูลทั้งหมดได้");
          }

          let Data = [
            {
              dataAllEvent: dataAllEvent,
              dataAllOrder: dataAllOrder,
            },
          ];

          return Data;
        }
      } catch (error: any) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
  return query;
}
