import React from "react";
import { useGenerateBoxes } from "../../../hooks/useGenerateBoxes";
import { useZoneStore } from "../form-store"; // Import Zustand store
import "./generate-boxes.css";

interface GenerateTableProps {
  method: string;
  totalSeats: number;
  zoneId: number;
}

const GenerateBoxes: React.FC<GenerateTableProps> = ({
  method,
  totalSeats,
  zoneId,
}) => {
  const { setStartNumberAndPrefix, setTableValues, zones } = useZoneStore();

  const { prefix, startNumber, setPrefix, setStartNumber, renderBoxes } =
    useGenerateBoxes({
      method,
      totalSeats,
      zoneId,
      setTableValues,
      setStartNumberAndPrefix,
      zones,
    });
  
  return (
    <div className="generate-boxes-container">
      <div className="header-container">
        <h2 style={{ paddingBottom: "15px" }}>{totalSeats} โต๊ะ</h2>
        {(method === "2" || method === "3" || method === "4") && (
          <div className="start-number-container">
            <label htmlFor="startNumber" style={{ fontSize: "20px" }}>
              เริ่มจาก*:{" "}
            </label>
            <input
              id="startNumber"
              type="number"
              value={startNumber ?? ""}
              onChange={(e) => setStartNumber(Number(e.target.value))}
              className="table-input-box"
              placeholder="Enter start number"
            />
          </div>
        )}
        {method === "4" && (
          <div className="prefix-container">
            <label htmlFor="prefix" style={{ fontSize: "20px" }}>
              อักษร*:{" "}
            </label>
            <input
              id="prefix"
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="table-input-box"
              placeholder="Enter prefix"
            />
          </div>
        )}
      </div>
      <div className="table-input-box-container">{renderBoxes()}</div>
    </div>
  );
};

export default GenerateBoxes;
