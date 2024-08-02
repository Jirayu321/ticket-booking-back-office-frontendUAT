import { useState, useEffect, ChangeEvent } from "react";
import "./create-event-form.css";
import ZonePriceForm from "./zone-price-form";
import BackIcon from "../../../public/back.svg";
import CarbonEvent from "../../../public/carbon-event.svg";

const CreateEventForm = () => {
  const [title, setTitle] = useState(localStorage.getItem("title") || "");
  const [title2, setTitle2] = useState(localStorage.getItem("title2") || "");
  const [description, setDescription] = useState(
    localStorage.getItem("description") || ""
  );
  const [date, setDate] = useState(localStorage.getItem("date") || "");
  const [time, setTime] = useState(localStorage.getItem("time") || "");
  const [status, setStatus] = useState(
    localStorage.getItem("status") || "รอจัดงาน"
  );
  const [publish, setPublish] = useState(false);
  const [images, setImages] = useState<Array<string | null>>([
    null,
    null,
    null,
    null,
  ]);
  const [activeTab, setActiveTab] = useState("รายละเอียด");
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "โซนสีแดง",
      description:
        "LOREM IPSUM DOLOR SIT AMET CONSECTETUR. SIT NEC VEL VULPUTATE AC LOREM CRAS.",
    },
    {
      id: 2,
      name: "โซนสีเขียว",
      description:
        "LOREM IPSUM DOLOR SIT AMET CONSECTETUR. SIT NEC VEL VULPUTATE AC LOREM CRAS.",
    },
  ]);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("images") || "[]");
    setImages(savedImages);
  }, []);

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
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
          localStorage.setItem("images", JSON.stringify(newImages));
        };
        reader.readAsDataURL(file);
      }
    };

  const handleSave = () => {
    localStorage.setItem("title", title);
    localStorage.setItem("title2", title2);
    localStorage.setItem("description", description);
    localStorage.setItem("date", date);
    localStorage.setItem("time", time);
    localStorage.setItem("status", status);
    localStorage.setItem("images", JSON.stringify(images));
    alert("Data saved locally");
  };

  const handleNext = () => {
    handleSave();
    setActiveTab("โซน & ราคา");
  };

  const handleBackClick = () => {
    if (activeTab === "โซน & ราคา") {
      setActiveTab("รายละเอียด");
    }
    console.log("Back button clicked");
  };

  

  return (
    <div className="create-new-event">
      <div className="header">
        <img src={CarbonEvent} alt="Carbon Event" style={{ width: '40px', height: '25px',marginTop:"-5px"}} />
        <h1>งานทั้งหมด</h1>
      </div>
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
          <span className="toggle-text">ไม่เผยแพร่</span>
          <button className="btn-cancel">ยกเลิก</button>
          <button className="btn-save" onClick={handleSave}>
            บันทึก
          </button>
        </div>
      </div>
      <div className="nav-menu">
        <div
          className={`left-box ${activeTab === "รายละเอียด" ? "active" : ""}`}
        >
          รายละเอียด
        </div>
        <div
          className={`right-box ${activeTab === "โซน & ราคา" ? "active" : ""}`}
        >
          โซน & ราคา
        </div>
      </div>
      {activeTab === "รายละเอียด" && (
        <form>
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
          <div className="form-section form-section-inline">
            <label>วันจัดงาน*</label>
            <input
              type="date"
              value={date}
              onChange={handleInputChange(setDate)}
            />
            <label>เวลาจัดงาน</label>
            <input
              type="time"
              value={time}
              onChange={handleInputChange(setTime)}
            />
          </div>
          <div className="form-section">
            <label>สถานะ*</label>
            <select
              className="large-select"
              value={status}
              onChange={handleInputChange(setStatus)}
            >
              <option value="รอจัดงาน">รอจัดงาน</option>
              <option value="จัดงานสำเร็จ">จัดงานสำเร็จ</option>
            </select>
          </div>
          <div className="form-section">
            <label>ภาพประกอบ</label>
            <div className="image-grid">
              {[ "ภาพปก*", "ภาพประกอบ 1 (ไม่บังคับ)", "ภาพประกอบ 2 (ไม่บังคับ)", "ภาพประกอบ 3 (ไม่บังคับ)", ].map((title, index) => (
                <div key={index} className="image-upload-container">
                  <span className="image-upload-title">{title}</span>
                  <div className="image-upload-box">
                    {images[index] && (
                      <img src={images[index]} alt={`Upload ${index}`} />
                    )}
                  </div>
                  <div className="upload-link-container">
                    <label className="image-upload-label">
                      <span className="image-upload-link">+ อัปโหลด</span>
                      <input
                        type="file"
                        onChange={handleImageUpload(index)}
                        className="image-upload-input"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="next-form-section">
            <button type="button" onClick={handleNext}>
              ต่อไป
            </button>
          </div>
        </form>
      )}
      {activeTab === "โซน & ราคา" && (
        <ZonePriceForm zones={zones} handleSave={handleSave} />
      )}
    </div>
  );
};

export default CreateEventForm;
