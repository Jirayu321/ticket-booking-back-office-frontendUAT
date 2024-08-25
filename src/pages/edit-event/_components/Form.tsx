import { ChangeEvent } from "react";
import toast from "react-hot-toast";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import { STATUS_MAP } from "../../../config/constants";
import useEditEventStore from "../_hook/useEditEventStore";
import ImageInputs from "./ImageInputs";

const Form = () => {
  const {
    title,
    title2,
    eventDateTime,
    status,
    description,
    setTitle,
    setDescription,
    setTitle2,
    setEventDateTime,
    setStatus,
    setActiveTab,
    setIsDetailCompleted,
  } = useEditEventStore();

  function handleSave() {}

  const validateForm = () => {
    if (!title || !title2 || !eventDateTime) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }
    return true;
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(parseInt(e.target.value));
  };

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleNext = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    if (validateForm()) {
      setActiveTab("โซน & ราคา");
      setIsDetailCompleted(true);
    }
  };
  
  return (
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
      <ImageInputs />
      <div className="next-form-section">
        <button className="buttonNext" onClick={handleNext}>
          ถัดไป
        </button>
      </div>
    </form>
  );
};

export default Form;
