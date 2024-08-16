import toast from "react-hot-toast";
import { createEvent } from "../../../services/event-list.service";
import { useEventStore } from "../form-store";

export function useZonePriceForm() {
  const { title, title2, description, eventDateTime, status } = useEventStore();

  const handleCreateEvent = async () => {
    try {
      if (!eventDateTime || !eventDateTime)
        return toast.error("กรุณาเลือกวันจัดงานก่อนทำการสร้าง event");

      const eventData = {
        Event_Name: title,
        Event_Addr: title2,
        Event_Desc: description,
        Event_Date: eventDateTime.format("YYYY-MM-DD"),
        Event_Time: eventDateTime.toDate().toISOString(),
        Event_Status: status,
        Event_Public: "N",
      };


      await createEvent(eventData);
    } catch (error) {
      throw new Error("ล้มเหลวระหว่างสร้าง event");
    }
  };

  return { handleCreateEvent };
}
