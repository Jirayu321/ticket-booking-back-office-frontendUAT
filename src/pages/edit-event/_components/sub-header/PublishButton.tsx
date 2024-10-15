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

  console.log("isEventPerformed", isEventPerformed);
  console.log(
    " new Date() >= new Date(formatISOToLocalTime(event.Event_Time))",
    new Date() >= new Date(formatISOToLocalTime(event.Event_Time))
  );
  console.log("!refreshEventInfo", !refreshEventInfo);
  console.log("!isEventDetailValid", !isEventDetailValid);
  console.log("!isEventPerformed", !isEventPerformed);

  async function handlePublish() {
    try {
      if (!refreshEventInfo) {
        console.log("refreshEventInfo is not available");
        return;
      }
      if (!isEventDetailValid) {
        console.log("Event detail is not valid");
        return toast.error("กรุณาเติมข้อมูลให้ครบ");
      }
      if (isEventPerformed) {
        console.log("Event has already been performed");
        return toast.error("ไม่สามารถเผยแพร่งานที่แสดงไปแล้วได้");
      }

      await updateEventById(Number(event.Event_Id), {
        Event_Public: event.Event_Public === "Y" ? "N" : "Y",
        Event_Public_Date: addHours(new Date(), HOURS_DIFF),
        Event_Public_By: DEFAULT_ACTIONER,
      });

      refreshEventInfo();
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error(error.message);
    }
  }

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <p style={{ marginRight: "10px", marginLeft: "-90px" }}>
        {event.Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
      </p>
      <input
        style={{ display: "none" }}
        type="checkbox"
        checked={event.Event_Public === "Y"}
        onChange={() => {
          handlePublish();
        }}
      />
      <span
        className="slider"
        style={{
          width: "50px",
          height: "26px",
          backgroundColor: event.Event_Public === "Y" ? "#4caf50" : "#ccc", // สีพื้นหลังของ toggle
          borderRadius: "34px", // ทำให้เป็นมุมโค้งกลมๆ
          position: "relative",
          transition: "0.4s",
          display: "inline-block",
        }}
        onClick={() => {
          handlePublish();
        }}
      ></span>
    </label>
  );
};

export default PublishButton;
