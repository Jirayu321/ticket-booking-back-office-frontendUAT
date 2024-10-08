import React, { useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useGenerateBoxes } from "../../../hooks/useGenerateBoxes";
import { useZoneStore } from "../form-store"; // Import Zustand store
import "./generate-boxes.css";

interface GenerateTableProps {
  method: string;
  totalSeats: number;
  zoneId: number;
  selectedTicketType: string;
  // mode: string;
  // dataEdit: any;
}

const GenerateBoxes: React.FC<GenerateTableProps> = ({
  method,
  totalSeats,
  zoneId,
  selectedTicketType,
  // mode,
  // dataEdit,
}) => {
  const { setStartNumberAndPrefix, setTableValues, zones, setStartNumber, startNumber } =
    useZoneStore();

  const { prefix, setPrefix, renderBoxes } = useGenerateBoxes({
    method,
    totalSeats,
    zoneId,
    setTableValues,
    setStartNumberAndPrefix,
    zones,
    selectedTicketType,
  });

  useEffect(() => {
    console.log("Props:", { method, totalSeats, zoneId, selectedTicketType });
    console.log("Store values:", { startNumber, zones });
    console.log("Generated values:", { prefix });
  }, [method, totalSeats, zoneId, selectedTicketType, startNumber, zones, prefix]);

  return method === "5" ? null : (
    <Box>
      <Box
        sx={{
          display: "flex",
          marginTop: "7px",
        }}
      >
        <Box>
          {totalSeats && (
            <Typography
              variant="h5"
              sx={{
                marginBottom: "10px",
                backgroundColor: "#f0f0f0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              {totalSeats} {selectedTicketType}
            </Typography>
          )}
        </Box>
        {(method === "2" || method === "3" || method === "4") && (
          <Box sx={{ marginLeft: "10px", marginRight: "10px" }}>
            <TextField
              sx={{
                width: "80px",
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                    textAlign: "center",
                  },
                },
              }}
              onFocus={(e) => e.target.select()}
              id="startNumber"
              type="number"
              value={startNumber}
              onChange={(e) => {
                setStartNumber(Number(e.target.value));
              }}
              label="เริ่มจาก*"
            />
          </Box>
        )}
        {method === "4" && (
          <Box>
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
              id="prefix"
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              label="อักษร*"
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "11px",
        }}
      >
        {renderBoxes()}
      </Box>
    </Box>
  );
};

export default GenerateBoxes;