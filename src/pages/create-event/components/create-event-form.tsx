import { Dayjs } from "dayjs";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import Header from "../../common/header";
import { useEventStore } from "../form-store"; // Import the Zustand store
import "./create-event-form.css";
import { handleSave } from "./save-form"; // Import the save function
import ZonePriceForm from "./zone-price-form";
import BackIcon from "/back.svg";

const statusMap: Record<number, string> = {
  1: "รอเริ่มงาน",
  2: "เริ่มงาน",
  3: "ปิดงาน",
  13: "ยกเลิก",
};

const CreateEventForm = () => {
  const navigate = useNavigate();

  const {
    title,
    title2,
    description,
    eventDateTime,
    status,
    setTitle,
    setTitle2,
    setDescription,
    setEventDateTime,
    setStatus,
  } = useEventStore();

  const [publish, setPublish] = useState(false);
  const [images, setImages] = useState<Array<string | null>>([
    null,
    null,
    null,
    null,
  ]);
  const [activeTab, setActiveTab] = useState("รายละเอียด");
  const [isDetailCompleted, setIsDetailCompleted] = useState(false);

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(parseInt(e.target.value));
  };

  const handleEventDateTimeChange = (date: Dayjs | null) => {
    setEventDateTime(date);
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

  const handleImageRemove = (index: number) => () => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const validateForm = () => {
    if (!title || !title2 || !eventDateTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validateForm()) {
      setActiveTab("โซน & ราคา");
      setIsDetailCompleted(true);
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

  const handleCancle = () => {
    const userConfirmed = window.confirm(
      "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมดโปรดบันทึกข้อมูลไว้ก่อน"
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
          <label>
            <input
              className="slider"
              type="checkbox"
              checked={publish}
              readOnly
            />
            <span className="slider" />
          </label>
          <span className="toggle-text">
            {publish ? "เผยแพร่" : "ไม่เผยแพร่"}
          </span>
          <button className="btn-cancel" onClick={handleCancle}>
            ยกเลิก
          </button>
          <button className="btn-save" onClick={handleSave}>
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
            <DateTimePickerComponent
              controlledValue={eventDateTime}
              onChange={handleEventDateTimeChange}
              label="Select Date & Time"
            />
          </div>
          <div className="form-section">
            <label>สถานะ*</label>
            <select
              className="large-select"
              value={status.toString()} // Convert to string for select element
              onChange={handleStatusChange} // Use the new handler
            >
              {Object.entries(statusMap).map(([value, label]) => (
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
      {activeTab === "โซน & ราคา" && <ZonePriceForm handleSave={handleNext} />}
    </div>
  );
};

export default CreateEventForm;
