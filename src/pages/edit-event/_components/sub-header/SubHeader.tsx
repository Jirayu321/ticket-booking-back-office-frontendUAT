import { FC } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
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
      const adjustedEventDateTime = dayjs(eventDateTime).add(7, 'hour').toISOString();

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

  return (
    <div className={styles.subHeader}>
      <BackButton />
      <div className="toggle-container">
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