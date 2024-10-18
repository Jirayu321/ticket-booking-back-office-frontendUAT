import { useQuery } from "@tanstack/react-query";
import {
  getAllEventList,
  getEventById,
} from "../../services/event-list.service";
import { getOrderAll } from "../../services/order-all.service";
import { getEventStock } from "../../services/event-stock.service";
import { getViewTicketList } from "../../services/view-tikcet-list.service";

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

export function useFetchOrdertList({ eventId }: { eventId: number | null }) {
  const query = useQuery({
    queryKey: ["get event by id", eventId],
    queryFn: async () => {
      try {
        if (eventId !== null) {
          const event = await getEventById(eventId);
          return event;
        } else {
          const dataEvent = await getAllEventList();
          const dataOrder = await getOrderAll();
          const data = { dataEvent: dataEvent, dataOrder: dataOrder };
          return data;
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

export function useFetchEventStocktList({
  eventId,
}: {
  eventId: number | null;
}) {
  const query = useQuery({
    queryKey: ["get event by id", eventId],
    queryFn: async () => {
      try {
        if (eventId !== null) {
          const event = await getEventById(eventId);
          return event;
        } else {
          const dataEventStock = await getEventStock();
          const dataEvent = await getAllEventList();
          const data = { dataEvent: dataEvent, dataEventStock: dataEventStock };
          return data;
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

export function useFetchgetTicketList({ eventId }: { eventId: number | null }) {
  const query = useQuery({
    queryKey: ["get event by id", eventId],
    queryFn: async () => {
      try {
        if (eventId !== null) {
          const event = await getEventById(eventId);
          return event;
        } else {
          const dataTicketList = await getViewTicketList();
          const dataEvent = await getAllEventList();
          const data = { dataEvent: dataEvent, dataTicketList: dataTicketList };
          return data;
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
