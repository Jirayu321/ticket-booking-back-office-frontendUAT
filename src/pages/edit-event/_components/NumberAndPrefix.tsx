import { FC } from "react";

type Props = {
  ticketQtyPerPlan: number;
  ticketNoOption: string;
  startNumber: number;
  setStartNumber: (value: number) => void;
  prefix: string;
  setPrefix: (value: string) => void;
};

const NumberAndPrefix: FC<Props> = ({
  ticketQtyPerPlan,
  ticketNoOption,
  startNumber,
  setStartNumber,
  prefix,
  setPrefix,
}) => {
  return (
    <div className="header-container">
      <h2 style={{ paddingBottom: "15px" }}>{ticketQtyPerPlan} โต๊ะ</h2>
      {(ticketNoOption === "2" ||
        ticketNoOption === "3" ||
        ticketNoOption === "4") && (
        <div className="start-number-container">
          <label htmlFor="startNumber" style={{ fontSize: "20px" }}>
            เริ่มจาก*:{" "}
          </label>
          <input
            type="number"
            value={startNumber ?? ""}
            onChange={(e) => setStartNumber(Number(e.target.value))}
            className="table-input-box"
            placeholder="Enter start number"
          />
        </div>
      )}
      {ticketNoOption === "4" && (
        <div className="prefix-container">
          <label htmlFor="prefix" style={{ fontSize: "20px" }}>
            อักษร*:{" "}
          </label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="table-input-box"
            placeholder="Enter prefix"
          />
        </div>
      )}
    </div>
  );
};

export default NumberAndPrefix;
