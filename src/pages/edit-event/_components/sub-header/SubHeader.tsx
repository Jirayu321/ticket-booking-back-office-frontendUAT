import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { convertLocalTimeToISO } from "../../../../lib/util";
import { updateEventById, updatePublicEventById } from "../../../../services/event-list.service";
import useEditEventStore from "../../_hook/useEditEventStore";
import styles from "../../edit-event-form.module.css";
import BackButton from "./BackButton";
import PublishButton from "./PublishButton";

type SubHeaderProp = {
  event: any;
};

const SubHeader: FC<SubHeaderProp> = ({ event }) => {
  const navigate = useNavigate();

  const [isPublic, setIsPublic] = useState(false);

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
      // if (!refreshEventInfo) return;
      // toast.loading("กำลังอัพเดทข้อมูลงาน");

      // if (!event.Event_Id) throw new Error("ไม่พบ ID ของงาน");

      // // Add 7 hours to the eventDateTime before converting to ISO
      // const adjustedEventDateTime = dayjs(eventDateTime)
      //   .add(7, "hour")
      //   .toISOString();

      // // Make sure images are passed to the API call
      // await updateEventById(Number(event.Event_Id), {
      //   Event_Name: title,
      //   Event_Addr: title2,
      //   Event_Desc: description,
      //   Event_Date: convertLocalTimeToISO(adjustedEventDateTime),
      //   Event_Time: convertLocalTimeToISO(adjustedEventDateTime),
      //   Event_Status: status,
      //   Event_Pic_1: images[0], // First image
      //   Event_Pic_2: images[1], // Second image
      //   Event_Pic_3: images[2], // Third image
      //   Event_Pic_4: images[3], // Fourth image
      // });

      // toast.dismiss();

      // toast.success("อัพเดทข้อมูลงานสำเร็จ");

      // refreshEventInfo();

      updatePublicEventById(Number(window.location.pathname.split('/edit-event/')[1]), isPublic);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    } finally {
      window.location.replace('/all-events');
      toast.success("เผยแพร่งานสำเร็จ");
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
    <div className={styles.subHeader} style={{ marginTop: "-10px" }}>
      <BackButton />
      <div className="toggle-container">
        <PublishButton event={event} isPublic={isPublic} setIsPublic={setIsPublic} />
        <button
          className=""
          style={{
            color: "#ffffff",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#28a745", // สีเขียว
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => handleCopyEventLink(event.Event_Id)}
          onMouseOver={(e) => (e.currentTarget.style.background = "#218838")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#28a745")}
        >
          <p
            style={{
              fontFamily: "'Noto Sans Thai', sans-serif",
              fontSize: 14,
              fontWeight: "bold",
              margin: 0,
            }}
          >
            คัดลอกลิงก์ตรวจสอบตั๋วงาน
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
            style={{ width: 16, height: 16, marginLeft: 8 }}
          >
            <path
              fillRule="evenodd"
              d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

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
