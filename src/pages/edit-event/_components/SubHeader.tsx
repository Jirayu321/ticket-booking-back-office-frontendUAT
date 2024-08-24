import { useNavigate } from "react-router-dom";
import styles from "../edit-event-form.module.css";
import useEditEventStore from "../_hook/useEditEventStore";
import {
  addHours,
  convertLocalTimeToISO,
  formatISOToLocalTime,
} from "../../../lib/util";
import { FC } from "react";
import toast from "react-hot-toast";
import { updateEventById } from "../../../services/event-list.service";
import { FaChevronLeft } from "react-icons/fa";

const DEFAULT_ACTIONER = "admin";
const HOURS_DIFF = 7;

type SubHeaderProp = {
  event: any;
};

const SubHeader: FC<SubHeaderProp> = ({ event }) => {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    title,
    title2,
    eventDateTime,
    description,
    status,
  } = useEditEventStore();

  const isEventDetailValid = title && title2 && eventDateTime !== null;

  const isEventPerformed = event
    ? new Date() >= new Date(formatISOToLocalTime(event.Event_Time))
    : false;

  const handleBackClick = () => {
    if (activeTab === "โซน & ราคา") {
      const userConfirmed = window.confirm(
        "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมด"
      );
      if (userConfirmed) {
        setActiveTab("รายละเอียด");
      }
    } else {
      navigate("/all-events");
    }
  };

  async function handlePublish() {
    try {
      if (!isEventDetailValid) return toast.error("กรุณาเติมข้อมูลให้ครบ");
      if (isEventPerformed)
        return toast.error("ไม่สามารถเผยแพร่งานที่แสดงไปแล้วได้");
      await updateEventById(Number(event.Event_Id), {
        Event_Public: event.Event_Public === "Y" ? "N" : "Y",
        Event_Public_Date: addHours(new Date(), HOURS_DIFF),
        Event_Public_By: DEFAULT_ACTIONER,
      });

      toast.success("เปลี่ยนสถานะเผยแพร่งานสำเร็จ");

      navigate(0);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleUpdateEvent() {
    try {
      toast.loading("กำลังอัพเดทข้อมูลงาน");
      if (!event.Event_Id) throw new Error("ไม่พบ ID ของงาน");
      await updateEventById(Number(event.Event_Id), {
        Event_Name: title,
        Event_Addr: title2,
        Event_Desc: description,
        Event_Time: convertLocalTimeToISO(eventDateTime),
        Event_Status: status,
      });
      toast.dismiss();
      toast.success("อัพเดทข้อมูลงานสำเร็จ");

      setTimeout(() => {
        navigate(0);
      }, 1500);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }

  const handleCancle = () => {
    const userConfirmed = window.confirm(
      "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมดโปรดบันทึกข้อมูลไว้ก่อน"
    );
    if (userConfirmed) {
      navigate("/all-events");
    }
  };

  return (
    <div className={styles.subHeader}>
      <div className={styles.backButtonContainer}>
        <button onClick={handleBackClick}>
          <FaChevronLeft />
        </button>
        <h2 className={styles.title}>แก้ไขข้อมูลงาน</h2>
      </div>
      <div className="toggle-container">
        <label>
          <input
            className="slider"
            type="checkbox"
            checked={event.Event_Public === "Y"}
            onChange={(_) => {
              handlePublish();
            }}
          />
          <span className="slider" />
        </label>
        <span className="toggle-text">
          {event.Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
        </span>
        <button className="btn-cancel" onClick={handleCancle}>
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
