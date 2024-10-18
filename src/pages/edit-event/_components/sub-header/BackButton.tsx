import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useEditEventStore from "../../_hook/useEditEventStore";
import styles from "../../edit-event-form.module.css";
import BackIcon from "/back.svg";

const BackButton = () => {
  const { activeTab, setActiveTab } = useEditEventStore();

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (activeTab === "โซน & ราคา") {
      // const userConfirmed = window.confirm(
      //   "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมด"
      // );
      // if (userConfirmed) {
      setActiveTab("รายละเอียด");
      // }
    } else {
      navigate("/all-events");
    }
  };
  return (
    <div className={styles.backButtonContainer}>
      <button
        onClick={handleBackClick}
        style={{
          background: "none",
          border: "none",
        }}
      >
        <img src={BackIcon} alt="Back Icon" />
      </button>
      <h2 className={styles.title} style={{ paddingLeft: "20px" }}>
        แก้ไขข้อมูลงาน
      </h2>
    </div>
  );
};

export default BackButton;
