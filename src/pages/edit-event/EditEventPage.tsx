import { CircularProgress } from "@mui/material";
import { ChangeEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../components/common/Container";
import { STATUS_MAP } from "../../config/constants";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import { convertLocalTimeToISO, formatISOToLocalTime } from "../../lib/util";
import { updateEventById } from "../../services/event-list.service";
import Header from "../common/header";
import ZonePriceForm from "../create-event/components/zone-price-form";
import useEditEventStore from "./_hook/useEditEventStore";
import { useSyncEventInfo } from "./_hook/useSyncEvetInfo";
import "./edit-event-form.module.css";
import BackIcon from "/back.svg";

const TIME_DIFFERENCE = 7 * 60 * 60 * 1000; // 7 hours

const EditEventPage = () => {
  const { eventId } = useParams();
  const {
    setStatus,
    setEventDateTime,
    title,
    title2,
    eventDateTime,
    setTitle,
    setTitle2,
    description,
    setDescription,
    status,
    isPublic,
  } = useEditEventStore();

  const [activeTab, setActiveTab] = useState("รายละเอียด");
  const { data: event, isPending: isLoadingEvent } = useFetchEventList({
    eventId: Number(eventId),
  });
  const navigate = useNavigate();
  const [isDetailCompleted, setIsDetailCompleted] = useState(false);
  const [images, setImages] = useState<Array<string | null>>([
    null,
    null,
    null,
    null,
  ]);

  const isEventDetailValid = title && title2 && eventDateTime !== null;

  const isEventPerformed = event
    ? new Date() >= new Date(formatISOToLocalTime(event.Event_Time))
    : false;

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(parseInt(e.target.value));
  };

  const handleCancle = () => {
    const userConfirmed = window.confirm(
      "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมดโปรดบันทึกข้อมูลไว้ก่อน"
    );
    if (userConfirmed) {
      navigate("/all-events");
    }
  };

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

  const validateForm = () => {
    if (!title || !title2 || !eventDateTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }
    return true;
  };

  function handleSave() {}

  const handleNext = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    if (validateForm()) {
      setActiveTab("โซน & ราคา");
      setIsDetailCompleted(true);
    }
  };

  const handleImageUpload =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          const newImages = [...images];
          newImages[index] = base64Image;
          setImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };

  async function handlePublish() {
    try {
      if (!isEventDetailValid) return toast.error("กรุณาเติมข้อมูลให้ครบ");
      if (isEventPerformed)
        return toast.error("ไม่สามารถเผยแพร่งานที่แสดงไปแล้วได้");
      await updateEventById(Number(eventId), {
        Event_Public: event.Event_Public === "Y" ? "N" : "Y",
      });

      toast.success("เปลี่ยนสถานะเผยแพร่งานสำเร็จ");

      navigate(0);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleImageRemove = (index: number) => () => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  async function handleUpdateEvent() {
    try {
      toast.loading("กำลังอัพเดทข้อมูลงาน");
      if (!eventId) throw "ไม่พบ ID ของงาน";
      await updateEventById(Number(eventId), {
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

  useSyncEventInfo(event);

  if (isLoadingEvent) return <CircularProgress />;

  return (
    <Container>
      <div className="create-new-event">
        <Header title="งานทั้งหมด" />
        <div className="sub-header">
          <button className="back-button">
            <img src={BackIcon} alt="Back Icon" onClick={handleBackClick} />
          </button>
          <h2 className="title">แก้ไขข้อมูลงาน</h2>
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
        <div className="nav-menu">
          <div
            className={`left-box ${activeTab === "รายละเอียด" ? "active" : ""}`}
          >
            <img
              src={isDetailCompleted ? "/check-on.svg" : "/check-off.svg"}
              alt="Check Icon"
              className="icon"
            />
            รายละเอียด
          </div>
          <div
            className={`right-box ${
              activeTab === "โซน & ราคา" ? "active" : ""
            }`}
          >
            <img src="/check-off.svg" alt="Check Off Icon" className="icon" />
            โซน & ราคา
          </div>
        </div>
        {activeTab === "รายละเอียด" && (
          <form onSubmit={handleSave}>
            <h3 style={{ color: "black", marginLeft: "15px" }}>1. ข้อมูลงาน</h3>
            <div className="form-section">
              <label>ชื่องาน*</label>
              <input
                type="text"
                value={title}
                onChange={handleInputChange(setTitle)}
                placeholder="บรรทัดที่ 1 (เช่น This is my first event)"
              />
              <input
                type="text"
                value={title2}
                onChange={handleInputChange(setTitle2)}
                className="second-input"
                placeholder="บรรทัดที่ 2 (เช่น at deedclub)"
              />
            </div>
            <div className="form-section">
              <label>ข้อมูลงาน (ถ้ามี)</label>
              <input
                type="text"
                value={description}
                onChange={handleInputChange(setDescription)}
              />
            </div>
            <hr className="custom-hr" />
            <div className="form-section form-section-inline event-form-date-picker-container">
              <label>วันและเวลาจัดงาน*</label>
              <input
                type="datetime-local"
                value={formatISOToLocalTime(eventDateTime)}
                onChange={(e: any) => {
                  const date = new Date(e.target.value);
                  const localTime = new Date(
                    date.getTime() -
                      date.getTimezoneOffset() * 60000 +
                      TIME_DIFFERENCE
                  ) // 7 hours
                    .toISOString()
                    .slice(0, 16);

                  setEventDateTime(localTime);
                }}
              />
            </div>
            <div className="form-section">
              <label>สถานะ*</label>
              <select
                className="large-select"
                value={status} // Convert to string for select element
                onChange={handleStatusChange} // Use the new handler
              >
                {Object.entries(STATUS_MAP).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <hr className="custom-hr" />
            <div className="form-section">
              <label>ภาพประกอบ</label>
              <div className="image-grid">
                {[
                  "ภาพปก*",
                  "ภาพประกอบ 1 (ไม่บังคับ)",
                  "ภาพประกอบ 2 (ไม่บังคับ)",
                  "ภาพประกอบ 3 (ไม่บังคับ)",
                ].map((title, index) => (
                  <div key={index} className="image-upload-container">
                    <span className="image-upload-title">{title}</span>
                    <div className="image-upload-box">
                      {images[index] && (
                        <img src={images[index]} alt={`Upload ${index}`} />
                      )}
                    </div>
                    <div className="upload-link-container">
                      {images[index] ? (
                        <>
                          <label className="image-upload-label">
                            <span className="image-upload-link">
                              เปลี่ยนภาพ
                            </span>
                            <input
                              type="file"
                              onChange={handleImageUpload(index)}
                              className="image-upload-input"
                            />
                          </label>
                          <span
                            className="image-remove-button"
                            onClick={handleImageRemove(index)}
                          >
                            ลบ
                          </span>
                        </>
                      ) : (
                        <label className="image-upload-label">
                          <span className="image-upload-link">+ อัปโหลด</span>
                          <input
                            type="file"
                            onChange={handleImageUpload(index)}
                            className="image-upload-input"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="next-form-section">
              <button className="buttonNext" onClick={handleNext}>
                ถัดไป
              </button>
            </div>
          </form>
        )}
        {activeTab === "โซน & ราคา" && <ZonePriceForm />}
      </div>
    </Container>
  );
};

export default EditEventPage;
