import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import { STATUS_MAP } from "../../../config/constants";
import { useWarnChangePage } from "../../../hooks/useWarnChangePage";
import { convertLocalTimeToISO } from "../../../lib/util";
import { createEvent } from "../../../services/event-list.service";
import Header from "../../common/header";
import { useEventStore } from "../form-store"; // Zustand store
import "./create-event-form.css";
import ZonePriceForm from "./zone-price-form";
import BackIcon from "/back.svg";
import { SwalError } from "../../../lib/sweetalert";

const MINIMUM_EVENT_IMAGES = 1;

const CreateEventForm = () => {
  const navigate = useNavigate();
  const {
    title,
    title2,
    description,
    eventDateTime,
    status,
    images, // Fetch images from Zustand store
    setTitle,
    setTitle2,
    setDescription,
    setEventDateTime,
    setStatus,
    setImages, // Zustand action to set images
  } = useEventStore();

  useWarnChangePage();

  const [publish, setPublish] = useState(false);
  const isPublishAvailable = false;
  const [activeTab, setActiveTab] = useState("รายละเอียด");
  const [isDetailCompleted, setIsDetailCompleted] = useState(false);

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(parseInt(e.target.value));
  };

  const handleImageUpload =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string;
          setImages(index, base64Image); // Set image in Zustand store
        };
        reader.readAsDataURL(file);
      }
    };

  const handleImageRemove = (index: number) => () => {
    setImages(index, null); // Remove image from Zustand store
  };

  async function handleCreateEvent() {
    try {
      toast.loading("กำลังสร้าง event ใหม่");

      const eventData = {
        Event_Name: title,
        Event_Addr: title2,
        Event_Desc: description,
        Event_Date: convertLocalTimeToISO(eventDateTime),
        Event_Time: convertLocalTimeToISO(eventDateTime),
        Event_Status: status,
        Event_Public: "N",
        Event_Pic_1: images[0], // Send images from Zustand store
        Event_Pic_2: images[1],
        Event_Pic_3: images[2],
        Event_Pic_4: images[3],
      };

      const { eventId } = await createEvent(eventData);

      if (!eventId) throw new Error("สร้าง event ล้มเหลว");

      toast.dismiss();
      Swal.fire({
        icon: "success",
        title: "สร้าง event สำเร็จ",
      });
      navigate("/all-events");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }

  const handleNext = (e: any) => {
    e.preventDefault();

    const isDetailCompleted = Boolean(
      title && title2 && eventDateTime && status
    );

    if (!isDetailCompleted) {
      SwalError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const haveImagesBeenUploaded =
      images.filter((image) => image !== null).length >= MINIMUM_EVENT_IMAGES;

    if (!haveImagesBeenUploaded) {
      SwalError(`กรุณาอัปโหลดภาพ event อย่างน้อย ${MINIMUM_EVENT_IMAGES} รูป`);
      return;
    }

    setIsDetailCompleted(true);
    setActiveTab("โซน & ราคา");
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

  const handleCancel = () => {
    const userConfirmed = window.confirm(
      "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมด โปรดบันทึกข้อมูลไว้ก่อน"
    );
    if (userConfirmed) {
      navigate("/all-events");
    }
  };

  return (
    <div className="create-new-event">
      <Header title="งานทั้งหมด" />
      <div className="sub-header">
        <button className="back-button">
          <img src={BackIcon} alt="Back Icon" onClick={handleBackClick} />
        </button>
        <h2 className="title">สร้างงานใหม่</h2>
        <div className="toggle-container">
          <button className="btn-cancel" onClick={handleCancel}>
            ยกเลิก
          </button>
          <button className="btn-save" onClick={handleCreateEvent}>
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
          className={`right-box ${activeTab === "โซน & ราคา" ? "active" : ""}`}
        >
          <img src="/check-off.svg" alt="Check Off Icon" className="icon" />
          โซน & ราคา
        </div>
      </div>
      {activeTab === "รายละเอียด" && (
        <form onSubmit={handleCreateEvent}>
          <h3 style={{ color: "black", marginLeft: "15px" }}>1. ข้อมูลงาน</h3>
          <div className="form-section">
            <label>ชื่องาน*</label>
            <input
              onFocus={(e) => e.target.select()}
              type="text"
              value={title}
              onChange={handleInputChange(setTitle)}
              placeholder="บรรทัดที่ 1 (เช่น This is my first event)"
            />
            <input
              onFocus={(e) => e.target.select()}
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
              onFocus={(e) => e.target.select()}
              type="text"
              value={description}
              onChange={handleInputChange(setDescription)}
            />
          </div>
          <hr className="custom-hr" />
          <div className="form-section">
            <DatePicker
              label="วันและเวลาจัดงาน*"
              dateTimeValue={eventDateTime}
              setter={setEventDateTime}
            />
          </div>
          <div className="form-section">
            <label>สถานะ*</label>
            <select
              className="large-select"
              value={status.toString()} // Convert to string for select element
              onChange={handleStatusChange}
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
                          <span className="image-upload-link">เปลี่ยนภาพ</span>
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
  );
};

export default CreateEventForm;
