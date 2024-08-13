import React, { useState, useEffect } from 'react';
import './generate-boxes.css';
import { useZoneStore } from '../form-store'; // Import Zustand store

interface GenerateTableProps {
  method: string;
  seatNumber: number;
  zoneName: string;
  zoneId: number; // Assuming you pass the zoneId to associate with a specific zone
}

const GenerateBoxes: React.FC<GenerateTableProps> = ({ method, seatNumber, zoneName, zoneId }) => {
  const { setStartNumberAndPrefix, setTableValues, zones } = useZoneStore(); // Zustand store actions
  const [startNumber, setStartNumber] = useState<number | null>(zones[zoneId]?.startNumber || null);
  const [prefix, setPrefix] = useState<string>(zones[zoneId]?.prefix || '');
  const [inputValues, setInputValues] = useState<string[]>([]);

  useEffect(() => {
    const savedStartNumber = zones[zoneId]?.startNumber;
    const savedPrefix = zones[zoneId]?.prefix;

    if (savedStartNumber !== undefined) setStartNumber(savedStartNumber);
    if (savedPrefix !== undefined) setPrefix(savedPrefix);

    if (zones[zoneId]?.tableValues) {
      setInputValues(zones[zoneId].tableValues);
    } else {
      const generatedValues = generateBoxesData();
      setTableValues(zoneId, generatedValues); // Save the generated values
      setInputValues(generatedValues);
    }
  }, [method, seatNumber, zoneId]);

  useEffect(() => {
    setStartNumberAndPrefix(zoneId, startNumber, prefix);
  }, [startNumber, prefix, zoneId]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    setTableValues(zoneId, newValues); // Save the input values
  };

  const generateBoxesData = () => {
    let boxesData = [];
    if (method === "1") {
      for (let i = 0; i < seatNumber; i++) {
        boxesData.push(inputValues[i] || '');
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
    return generateBoxesData().map((value, index) => (
      <input
        key={index}
        type="text"
        value={value}
        placeholder={method === "1" ? 'โปรดระบุ' : ''}
        onChange={(e) => handleInputChange(index, e.target.value)}
        className="table-input-box"
        readOnly={method !== "1"} // Only allow editing if method is "1"
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
              onChange={(e) => setStartNumber(Number(e.target.value))}
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
              onChange={(e) => setPrefix(e.target.value)}
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