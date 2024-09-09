import { useEffect } from "react";
import dayjs from 'dayjs';
import useEditEventStore from "./useEditEventStore";

export function useSyncEventInfo(event: any) {
  const {
    setTitle,
    setTitle2,
    setDescription,
    setEventDateTime,
    setStatus,
    setIsPublic,
    setImages, // Access the setImages function from Zustand
  } = useEditEventStore();

  useEffect(() => {
    if (event) {
      setTitle(event.Event_Name);
      setTitle2(event.Event_Addr);
      setDescription(event.Event_Desc);
      // Decrease 7 hours from the Event_Time before setting it
      const adjustedEventTime = dayjs(event.Event_Time).subtract(7, 'hour').toISOString();
      setEventDateTime(adjustedEventTime);
      setStatus(Number(event.Event_Status));
      setIsPublic(event.Event_Public === "Y");

      // Sync the images if they exist in the event object
      setImages(0, event.Event_Pic_1 || null);
      setImages(1, event.Event_Pic_2 || null);
      setImages(2, event.Event_Pic_3 || null);
      setImages(3, event.Event_Pic_4 || null);
    }
  }, [event]);
}