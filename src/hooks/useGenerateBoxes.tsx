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
  selectedTicketType: string;
  mode: string;
  dataEdit: any;
}) {
  const {
    method,
    totalSeats,
    zoneId,
    setTableValues,
    setStartNumberAndPrefix,
    zones,
    selectedTicketType,
    mode,
    dataEdit,
  } = options;
  const { inputValues, setInputValueStore, startNumber, setStartNumber } =
    useZoneStore();

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
    if (mode === "edit" && Array.isArray(dataEdit?.ticketNoPlanList)) {
      const initialValues = dataEdit.ticketNoPlanList.map((item) => item.Ticket_No);
      setInputValueStore(initialValues);
      setTableValues(zoneId, initialValues);
    } else if (mode === "create") {
      const initialValues = Array(totalSeats).fill(""); // Reset for "create"
      setInputValueStore(initialValues);
      setTableValues(zoneId, initialValues);
    }
  }, [mode, dataEdit, zoneId, totalSeats]);

  const handleInputChange = (index: number, value: string) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValueStore(updatedValues); // Update local store
    setTableValues(zoneId, updatedValues); // Sync with parent component
  };

  const updateTableValues = () => {
    const updatedValues = generateBoxesData();
    setTableValues(zoneId, updatedValues);
    setInputValueStore(updatedValues);
  };

  const generateBoxesData = () => {
    let boxesData: string[] = [];

    if (mode === "edit") {
      // Use dataEdit for "edit" mode
      boxesData = Array.isArray(dataEdit?.ticketNoPlanList)
        ? dataEdit.ticketNoPlanList.map((item) => item.Ticket_No)
        : [];
    } else if (mode === "create") {
      // Generate boxes for "create" mode
      if (method === "1") {
        boxesData = Array.from(
          { length: totalSeats },
          (_, i) => inputValues[i]?.trimEnd() || ""
        );
      } else if (["2", "3", "4"].includes(method) && startNumber !== null) {
        boxesData = Array.from({ length: totalSeats }, (_, i) => {
          const currentNumber = startNumber + i;
          if (method === "3") return `${selectedTicketType} ${currentNumber}`;
          if (method === "4") return `${prefix}${currentNumber}`;
          return `${currentNumber}`;
        });
      } else if (method === "5") {
        boxesData = Array.from({ length: totalSeats }, () => "");
      }
    }

    // Apply user changes from inputValues if present
    if (inputValues?.length > 0) {
      inputValues.forEach((val, idx) => {
        if (val) boxesData[idx] = val;
      });
    }

    console.log("generateBoxesData result:", boxesData);
    return boxesData;
  };

  const renderBoxes = () => {
    const boxesData = generateBoxesData();
    console.log("boxesData in renderBoxes:", boxesData);

    if (!Array.isArray(boxesData)) {
      console.error("boxesData is not an array:", boxesData);
      return null;
    }

    return boxesData.map((value, index) => (
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
          placeholder={method === "1" ? "โปรดระบุ" : ""}
          InputProps={{
            readOnly: method !== "1" && method !== "5",
          }}
          onBlur={() => {
            const hasDuplicate = inputValues.filter((v) => v === value && v).length > 1;
            if (hasDuplicate) {
              SwalError("มีเลขซ้ำกันในโต๊ะ");
              handleInputChange(index, ""); // Clear duplicate values
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(index, e.target.value)
          }
        />
      </Box>
    ));
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
