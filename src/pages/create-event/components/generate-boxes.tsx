import React, { useState, useEffect } from 'react';
import './generate-boxes.css';
import { useZoneStore } from '../form-store'; // Import Zustand store

interface GenerateTableProps {
  method: string;
  seatNumber: number;
  zoneId: number; // Pass zoneId to associate with specific zone
}

const GenerateBoxes: React.FC<GenerateTableProps> = ({ method, seatNumber, zoneId }) => {
  const [startNumber, setStartNumber] = useState<number | null>(null);
  const [prefix, setPrefix] = useState<string>('');
  const { setZoneData } = useZoneStore(); // Zustand store action to update the zone data

  useEffect(() => {
    const generatedTables = generateBoxesData();
    setZoneData(zoneId, { generatedTables });
  }, [method, seatNumber, startNumber, prefix]);

  const handleStartNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartNumber(Number(e.target.value));
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.target.value);
  };

  const generateBoxesData = () => {
    let boxesData: string[] = [];

    if (method === "1") {
      for (let i = 0; i < seatNumber; i++) {
        boxesData.push(`Table ${i + 1}`);
      }
    } else if ((method === "2" || method === "3" || method === "4") && startNumber !== null) {
      for (let i = 0; i < seatNumber; i++) {
        const boxValue = method === "3" ? `โต๊ะ ${startNumber + i}` :
          method === "4" ? `${prefix}${startNumber + i}` :
          `${startNumber + i}`;
        boxesData.push(boxValue);
      }
    }
    return boxesData;
  };

  const renderBoxes = () => {
    const boxesData = generateBoxesData();
    return boxesData.map((box, i) => (
      <input
        key={i}
        type="text"
        value={box}
        className="table-input-box"
        readOnly
      />
    ));
  };

  return (
    <div className="generate-boxes-container">
      <div className="header-container">
        <h2 style={{ paddingBottom: "15px" }}>{seatNumber} โต๊ะ</h2>
        {(method === "2" || method === "3" || method === "4") && (
          <div className="start-number-container">
            <label htmlFor="startNumber" style={{ fontSize: "20px" }}>เริ่มจาก*: </label>
            <input
              id="startNumber"
              type="number"
              value={startNumber ?? ''}
              onChange={handleStartNumberChange}
              className="table-input-box"
              placeholder="Enter start number"
            />
          </div>
        )}
        {method === "4" && (
          <div className="prefix-container">
            <label htmlFor="prefix" style={{ fontSize: "20px" }}>อักษร*: </label>
            <input
              id="prefix"
              type="text"
              value={prefix}
              onChange={handlePrefixChange}
              className="table-input-box"
              placeholder="Enter prefix"
            />
          </div>
        )}
      </div>
      <div className="table-input-box-container">
        {renderBoxes()}
      </div>
    </div>
  );
};

export default GenerateBoxes;
