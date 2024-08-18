import dayjs from "dayjs";
import { useEffect } from "react";
import useEditEventStore from "./useEditEventStore";

export function useSyncEventInfo(event: any) {
  const { setTitle, setTitle2, setDescription, setEventDateTime, setStatus } =
    useEditEventStore();
  useEffect(() => {
    if (event) {
      setTitle(event.Event_Name);
      setTitle2(event.Event_Addr);
      setDescription(event.Event_Desc);
      setEventDateTime(dayjs(event.Event_Time));
      setStatus(Number(event.Event_Status));
    }
  }, [event]);
}
