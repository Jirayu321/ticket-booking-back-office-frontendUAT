import { FC } from "react";
import { TicketNoOption } from "../type";

type Props = {
  currentPlan: any;
  setTicketOption: (option: TicketNoOption) => void;
  currentOption: TicketNoOption;
  selectedTicketType: string; // Add the selectedTicketType prop
};

const SelectInputMethod: FC<Props> = ({
  currentPlan,
  currentOption,
  setTicketOption,
  selectedTicketType,
}) => {
  return (
    <>
      <label style={{ color: "black" }}>ระบุเลขโต๊ะ/ที่*</label>
      <select
        value={currentOption}
        onChange={(e) => {
          setTicketOption(e.target.value as TicketNoOption);
        }}
        className="table-input-method-select"
      >
        <option value="">เลือกรูปแบบการระบุ</option>
        <option value="1">1.คีย์เลขโต๊ะได้เอง</option>
        <option value="2">2.รันจาก 1 ถึง {currentPlan?.seatCount || 0}</option>
        <option value="3">
          3.นำหน้าด้วย ประเภทบัตร ต่อด้วย รันจาก x ถึง {currentPlan?.seatCount || 0} -
          ({selectedTicketType} 1- {selectedTicketType} {currentPlan?.seatCount || 0})
        </option>
        <option value="4">
          4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง {currentPlan?.seatCount || 0}{" "}
          ([?] 1- [?] {currentPlan?.seatCount || 0})
        </option>
        <option value="5">5.ไม่ระบุเลขโต๊ะ</option>
      </select>
    </>
  );
};

export default SelectInputMethod;
