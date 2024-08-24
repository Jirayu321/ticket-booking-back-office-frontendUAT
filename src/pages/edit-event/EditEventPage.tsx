import { CircularProgress } from "@mui/material";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Container from "../../components/common/container/Container";
import DatePicker from "../../components/common/input/date-picker/DatePicker";
import { STATUS_MAP } from "../../config/constants";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import Header from "../common/header";
import EditZonePriceForm from "./_components/EditZonePriceForm";
import SubHeader from "./_components/SubHeader";
import useEditEventStore from "./_hook/useEditEventStore";
import { useSyncEventInfo } from "./_hook/useSyncEventInfo";

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
    activeTab,
    setActiveTab,
  } = useEditEventStore();

  const { data: event, isPending: isLoadingEvent } = useFetchEventList({
    eventId: Number(eventId),
  });

  const [isDetailCompleted, setIsDetailCompleted] = useState(false);

  const [images, setImages] = useState<Array<string | null>>([
    null,
    null,
    null,
    null,
  ]);

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(parseInt(e.target.value));
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

  const handleImageRemove = (index: number) => () => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  useSyncEventInfo(event);

  if (isLoadingEvent) return <CircularProgress />;

  return (
    <Container>
      <Header title="งานทั้งหมด" />
      {event ? <SubHeader event={event} /> : null}
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
            <DatePicker
              label="วันและเวลาจัดงาน*"
              setter={setEventDateTime}
              dateTimeValue={eventDateTime}
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
      {activeTab === "โซน & ราคา" && (
        <EditZonePriceForm eventId={Number(eventId)} />
      )}
    </Container>
  );
};

export default EditEventPage;
