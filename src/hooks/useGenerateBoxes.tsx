import { ChangeEvent, useEffect, useState } from "react";
import { SwalError } from "../lib/sweetalert";
import { Box, TextField } from "@mui/material";
import { useZoneStore } from "../pages/create-event/form-store"; 

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
  selectedTicketType: string; // Add selectedTicketType to the options
}) {
  const {
    method,
    totalSeats,
    zoneId,
    setTableValues,
    setStartNumberAndPrefix,
    zones,
    selectedTicketType,
  } = options;

  const { inputValues, setInputValueStore, startNumber, setStartNumber } = useZoneStore();

  const [prefix, setPrefix] = useState<string>(zones[zoneId]?.prefix || "");

  useEffect(() => {
    const savedStartNumber = zones[zoneId]?.startNumber;
    const savedPrefix = zones[zoneId]?.prefix;

    if (savedStartNumber !== undefined) setStartNumber(savedStartNumber);
    if (savedPrefix !== undefined) setPrefix(savedPrefix);

    updateTableValues();
  }, [method, totalSeats, zoneId]);

  useEffect(() => {
    setStartNumberAndPrefix(zoneId, startNumber, prefix);
  }, [startNumber, prefix, zoneId]);

  useEffect(() => {
    updateTableValues();
  }, [prefix, totalSeats, method, zoneId]);

  useEffect(() => {
    if (startNumber !== null) {
      updateTableValues();
    }
  }, [totalSeats, method, zoneId, startNumber]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setTableValues(zoneId, newValues);
    setInputValueStore(newValues);
  };

  const updateTableValues = () => {
    const updatedValues = generateBoxesData();
    setTableValues(zoneId, updatedValues);
    setInputValueStore(updatedValues);
  };

  const generateBoxesData = () => {
    let boxesData: string[] = [];
    if (method === "1") {
      boxesData = Array.from({ length: totalSeats }, (_, i) => inputValues[i]?.trimEnd() || "");
    } else if (["2", "3", "4"].includes(method) && startNumber !== null) {
      for (let i = 0; i < totalSeats; i++) {
        const boxValue =
          method === "3" ? `${selectedTicketType} ${startNumber + i}` :
          method === "4" ? `${prefix}${startNumber + i}` :
          `${startNumber + i}`;
        boxesData.push(boxValue);
      }
    } else if (method === "5") {
      boxesData = Array.from({ length: totalSeats }, () => "");
    }
    return boxesData;
  };

  const renderBoxes = () => {
    return generateBoxesData().map((value, index) => {
      console.log('generateBoxesData value =>', value); 
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          <TextField
            sx={{
              width: "70px",
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none",
                  transform: "translateY(5px)",
                  textAlign: "center",
                },
              },
            }}
            onFocus={(e) => e.target.select()}
            type="text"
            value={value}
            onBlur={() => {
              const doesValueDuplicate = inputValues.filter(v => v === value && Boolean(v)).length > 1;
    
              if (doesValueDuplicate) {
                SwalError("มีเลขซ้ำกันในโต๊ะ");
                handleInputChange(index, "");
              }
            }}
            placeholder={method === "1" ? "โปรดระบุ" : ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleInputChange(index, e.target.value);
            }}
            InputProps={{
              readOnly: method !== "1" && method !== "5",
            }}
          />
        </Box>
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
