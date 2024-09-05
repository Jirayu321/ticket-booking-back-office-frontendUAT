import { ChangeEvent, useEffect, useState } from "react";
import { SwalError } from "../lib/sweetalert";

export function useGenerateBoxes(options: {
  method: string;
  totalSeats: number;
  zoneId: number;
  setTableValues: (zoneId: number, values: string[]) => void;
  setStartNumberAndPrefix: (
    zoneId: number,
    startNumber: number | null,
    prefix: string
  ) => void;
  zones: Record<number, any>;
}) {
  const {
    method,
    totalSeats,
    zoneId,
    setTableValues,
    setStartNumberAndPrefix,
    zones,
  } = options;

  const [startNumber, setStartNumber] = useState<number | null>(
    zones[zoneId]?.startNumber || null
  );

  const [prefix, setPrefix] = useState<string>(zones[zoneId]?.prefix || "");

  const [inputValues, setInputValues] = useState<string[]>([]);

  useEffect(() => {
    const savedStartNumber = zones[zoneId]?.startNumber;
    const savedPrefix = zones[zoneId]?.prefix;

    if (savedStartNumber !== undefined) setStartNumber(savedStartNumber);
    if (savedPrefix !== undefined) setPrefix(savedPrefix);

    const generatedValues = generateBoxesData();

    setTableValues(zoneId, generatedValues);
    setInputValues(generatedValues);
  }, [method, totalSeats, zoneId]);

  useEffect(() => {
    setStartNumberAndPrefix(zoneId, startNumber, prefix);
  }, [startNumber, prefix, zoneId]);

  useEffect(() => {
    const updatedValues = generateBoxesData();
    setInputValues(updatedValues);
    setTableValues(zoneId, updatedValues);
  }, [prefix, totalSeats, method, zoneId]);

  useEffect(() => {
    if (startNumber !== null) {
      const updatedValues = generateBoxesData();
      setInputValues(updatedValues);
      setTableValues(zoneId, updatedValues);
    }
  }, [totalSeats, method, zoneId, startNumber]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    setTableValues(zoneId, newValues);
  };

  const generateBoxesData = () => {
    let boxesData = [];
    if (method === "1") {
      for (let i = 0; i < totalSeats; i++) {
        boxesData.push(inputValues[i] ? inputValues[i].trimEnd() : "");
      }
    } else if (
      (method === "2" || method === "3" || method === "4") &&
      startNumber !== null
    ) {
      for (let i = 0; i < totalSeats; i++) {
        const boxValue =
          method === "3"
            ? `โต๊ะ ${startNumber + i}`
            : method === "4"
            ? `${prefix}${startNumber + i}`
            : `${startNumber + i}`;
        boxesData.push(boxValue);
      }
    } else if (method === "5") {
      for (let i = 0; i < totalSeats; i++) {
        boxesData.push("");
      }
    }
    return boxesData;
  };

  const renderBoxes = () => {
    return generateBoxesData().map((value, index) => {
      return (
        <input
          key={index}
          onFocus={(e) => e.target.select()}
          type="text"
          value={value}
          onBlur={() => {
            const doesValueDuplicate =
              inputValues.filter((v) => v === value && Boolean(v)).length > 1;

            if (doesValueDuplicate) {
              SwalError("มีเลขซ้ำกันในโต๊ะ");
              handleInputChange(index, "");
            }
          }}
          placeholder={method === "1" ? "โปรดระบุ" : ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleInputChange(index, e.target.value);
          }}
          className="table-input-box"
          readOnly={method !== "1" && method !== "5"}
        />
      );
    });
  };
  return {
    startNumber,
    prefix,
    inputValues,
    setStartNumber,
    setPrefix,
    handleInputChange,
    renderBoxes,
  };
}
