import { FC } from "react";
import useEditEventStore from "../_hook/useEditEventStore";

const Steps = () => {
  const { activeTab, isDetailCompleted } = useEditEventStore();
  return (
    <div className="nav-menu">
      <div className={`left-box ${activeTab === "รายละเอียด" ? "active" : ""}`}>
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
  );
};

export default Steps;
