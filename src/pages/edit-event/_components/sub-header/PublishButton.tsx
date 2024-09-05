import { FC } from "react";
import toast from "react-hot-toast";
import { formatISOToLocalTime, addHours } from "../../../../lib/util";
import { updateEventById } from "../../../../services/event-list.service";
import useEditEventStore from "../../_hook/useEditEventStore";

const DEFAULT_ACTIONER = "admin";
const HOURS_DIFF = 7;

type PublishButtonProps = {
  event: any;
};

const PublishButton: FC<PublishButtonProps> = ({ event }) => {
  const { title, title2, eventDateTime, refreshEventInfo } =
    useEditEventStore();

  const isEventDetailValid = title && title2 && eventDateTime !== null;

  const isEventPerformed = event
    ? new Date() >= new Date(formatISOToLocalTime(event.Event_Time))
    : false;

  async function handlePublish() {
    try {
      if (!refreshEventInfo) return;
      if (!isEventDetailValid) return toast.error("กรุณาเติมข้อมูลให้ครบ");
      if (isEventPerformed)
        return toast.error("ไม่สามารถเผยแพร่งานที่แสดงไปแล้วได้");

      await updateEventById(Number(event.Event_Id), {
        Event_Public: event.Event_Public === "Y" ? "N" : "Y",
        Event_Public_Date: addHours(new Date(), HOURS_DIFF),
        Event_Public_By: DEFAULT_ACTIONER,
      });

      refreshEventInfo();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center' }}>
      <p style={{ marginRight: '20px' }}>
        {event.Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
      </p>
      <input
        style={{ marginRight: '10px' }}
        type="checkbox"
        checked={event.Event_Public === "Y"}
        onChange={(_) => {
          handlePublish();
        }}
      />
      <span className="slider" />
    </label>
  );
};

export default PublishButton;
