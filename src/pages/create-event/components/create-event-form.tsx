import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import { STATUS_MAP } from "../../../config/constants";
import { useWarnChangePage } from "../../../hooks/useWarnChangePage";
import { SwalError, SwalSuccess } from "../../../lib/sweetalert";
import Header from "../../common/header";
import { useEventStore, useZoneStore } from "../form-store"; // Zustand store
import "./create-event-form.css";
import ZonePriceForm from "./zone-price-form";
import { useZonePriceForm } from "./zone-price-form.hooks";
import BackIcon from "/back.svg";
import EditZonePriceForm from "../../edit-event/_components/EditZonePriceForm";
import { handleSave } from "./save-form";

const MINIMUM_EVENT_IMAGES = 1;

const CreateEventForm = () => {
  const navigate = useNavigate();
  const {
    title,
    title2,
    description,
    eventDateTime,
    status,
    images,
    setTitle,
    setTitle2,
    setDescription,
    setEventDateTime,
    setStatus,
    setImages,
  } = useEventStore();

  const {
    handleSaveEventStock,
    handleSaveLogEventPrice,
    handleSaveTicketNumbers,
    handleCreateEvent,
    isFormValid,
  } = useZonePriceForm();

  useWarnChangePage();

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
          setImages(index, base64Image);
        };
        reader.readAsDataURL(file);
      }
    };

  const handleImageRemove = (index: number) => () => {
    setImages(index, null);
  };

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

  const { zones } = useZoneStore();
  async function handleSaveEvent() {
    try {
      toast.loading("กำลังบันทึกข้อมูล Event");

      console.log("handleSaveEvent 55555", zones);

      const { isValid, message } = isFormValid();

      if (!isValid) throw new Error(message);

      const eventId = await handleCreateEvent();

      if (!eventId) {
        toast.dismiss();
        throw new Error("ล้มเหลวระหว่างสร้าง event");
      }

      await handleSaveEventStock(eventId);

      await handleSaveLogEventPrice(eventId);

      await handleSaveTicketNumbers(eventId);

      toast.dismiss();

      SwalSuccess("บันทึกข้อมูล Event สำเร็จ");

      navigate("/all-events");
    } catch (error: any) {
      toast.dismiss();
      SwalError(error.message);
    }
  }

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
      <div
        className="sub-header"
        style={{
          display: "grid",
          gridTemplateColumns: "230px auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "65px auto",
            alignItems: "center",
          }}
        >
          <button className="back-button">
            <img src={BackIcon} alt="Back Icon" onClick={handleBackClick} />
          </button>
          <h2 className="title" style={{ margin: 0 }}>
            สร้างงานใหม่
          </h2>
        </div>
        <div className="toggle-container">
          <button className="btn-cancel" onClick={handleCancel}>
            ยกเลิก
          </button>
          <button
            disabled={activeTab === "รายละเอียด"}
            className="btn-save"
            onClick={handleSaveEvent}
          >
            บันทึก
          </button>
        </div>
      </div>
      <div className="nav-menu" style={{ position: "relative", zIndex: 0 }}>
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
        <div>
          <form
            onSubmit={handleCreateEvent}
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
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
                dateTimeValue={eventDateTime} // Ensure Dayjs object
                setter={setEventDateTime} // Pass setter function for Dayjs object
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
                  "ภาพปก* ขนาดภาพแบบ1:1",
                  "ภาพประกอบ 1 (ไม่บังคับ) ขนาดภาพแบบ1:1",
                  "ภาพประกอบ 2 (ไม่บังคับ) ขนาดภาพแบบ1:1",
                  "ภาพประกอบ 3 (ไม่บังคับ) ขนาดภาพแบบ1:1",
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
          </form>
          <div className="next-form-section" style={{ marginTop: " 5vh" }}>
            <button className="buttonNext" onClick={handleNext}>
              ถัดไป
            </button>
          </div>
        </div>
      )}
      {activeTab === "โซน & ราคา" && (
        <ZonePriceForm onSaveEvent={handleSaveEvent} />
        // <EditZonePriceForm eventId={Number(eventId)} />
      )}
    </div>
  );
};

export default CreateEventForm;
