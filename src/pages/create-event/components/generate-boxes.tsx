import React, { useState, useEffect } from 'react';
import './generate-boxes.css';

interface GenerateTableProps {
  method: string;
  seatNumber: number;
  zoneName: string;
}

const GenerateBoxes: React.FC<GenerateTableProps> = ({ method, seatNumber, zoneName }) => {
  const [startNumber, setStartNumber] = useState<number | null>(null);
  const [prefix, setPrefix] = useState<string>('');

  useEffect(() => {
    console.log("Method:", method);
    console.log("Zone Name:", zoneName);
    console.log("Seat Number:", seatNumber);
  }, [method, zoneName, seatNumber]);

  const handleStartNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartNumber(Number(e.target.value));
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.target.value);
  };

  const renderBoxes = () => {
    let boxes = [];

    if (method === "1") {
      for (let i = 0; i < seatNumber; i++) {
        boxes.push(
          <input
            key={i}
            type="text"
            placeholder='โปรดระบุ'
            className="table-input-box"
          />
        );
      }
    } else if ((method === "2" || method === "3" || method === "4") && startNumber !== null) {
      for (let i = 0; i < seatNumber; i++) {
        const boxValue = method === "3" ? `${zoneName} ${startNumber + i}` : 
                         method === "4" ? `${prefix}${startNumber + i}` : 
                         `${startNumber + i}`;
        boxes.push(
          <input
            key={i}
            type="text"
            value={boxValue}
            className="table-input-box"
            readOnly
          />
        );
      }
    }
    return boxes;
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