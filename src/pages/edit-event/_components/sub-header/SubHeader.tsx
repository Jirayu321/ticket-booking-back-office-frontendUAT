import { FC } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { convertLocalTimeToISO } from "../../../../lib/util";
import { updateEventById } from "../../../../services/event-list.service";
import useEditEventStore from "../../_hook/useEditEventStore";
import styles from "../../edit-event-form.module.css";
import BackButton from "./BackButton";
import PublishButton from "./PublishButton";

type SubHeaderProp = {
  event: any;
};

const SubHeader: FC<SubHeaderProp> = ({ event }) => {
  const navigate = useNavigate();

  const {
    title,
    title2,
    eventDateTime,
    description,
    status,
    refreshEventInfo,
    images, // Getting images from Zustand store
  } = useEditEventStore();

  async function handleUpdateEvent() {
    try {
      if (!refreshEventInfo) return;
      toast.loading("กำลังอัพเดทข้อมูลงาน");

      if (!event.Event_Id) throw new Error("ไม่พบ ID ของงาน");

      // Add 7 hours to the eventDateTime before converting to ISO
      const adjustedEventDateTime = dayjs(eventDateTime)
        .add(7, "hour")
        .toISOString();

      // Make sure images are passed to the API call
      await updateEventById(Number(event.Event_Id), {
        Event_Name: title,
        Event_Addr: title2,
        Event_Desc: description,
        Event_Date: convertLocalTimeToISO(adjustedEventDateTime),
        Event_Time: convertLocalTimeToISO(adjustedEventDateTime),
        Event_Status: status,
        Event_Pic_1: images[0], // First image
        Event_Pic_2: images[1], // Second image
        Event_Pic_3: images[2], // Third image
        Event_Pic_4: images[3], // Fourth image
      });

      toast.dismiss();

      toast.success("อัพเดทข้อมูลงานสำเร็จ");

      refreshEventInfo();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }

  const handleCancel = () => {
    const userConfirmed = window.confirm(
      "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมดโปรดบันทึกข้อมูลไว้ก่อน"
    );
    if (userConfirmed) {
      navigate("/all-events");
    }
  };

  function handleCopyEventLink(eventId: number) {
    const eventLink = `https://deedclub.appsystemyou.com/CheckIn/${eventId}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("คัดลอกลิงก์งานสำเร็จ");
  }

  return (
    <div className={styles.subHeader}>
      <BackButton />
      <div className="toggle-container">
        <button
          className=""
          style={{
            marginRight: 100,
            color: "#ffd700",
            padding: 20,
            display: "flex",
            background: "transparent",
            border: "none",
          }}
          onClick={() => handleCopyEventLink(event.Event_Id)}
        >
          <p
            style={{
              fontFamily: "'Noto Sans Thai', sans-serif",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            คัดลอกลิงก์ตรวจสอบตั๋วงาน
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
            style={{
              color: "#ffd700",
              width: 40,
              height: 40,
            }}
          >
            <path
              fillRule="evenodd"
              d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z"
              clipRule="evenodd"
            />
            <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
            <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
          </svg>
        </button>
        <PublishButton event={event} />
        <button className="btn-cancel" onClick={handleCancel}>
          ยกเลิก
        </button>
        <button className="btn-save" onClick={handleUpdateEvent}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default SubHeader;
