import React from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  IconButton,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PlanTable: React.FC<{
  plans: any[];
  onDelete: (id: number) => void;
  onEdit: (plan: any) => void;
  onViewImage: (image: string) => void;
  onToggleStatus: (plan: any) => void;
  onCreate: () => void;
}> = ({ plans, onDelete, onEdit, onViewImage, onToggleStatus, onCreate }) => {
  return (
    <TableContainer component={Paper} style={{ height: "90vh", width: "70vw" }}>
      <Table>
        <TableHead style={{ background: "#000" }}>
          <TableRow>
            <TableCell style={{ color: "#ffff" }}>#</TableCell>
            <TableCell style={{ color: "#ffff" }}>ชื่อผังร้าน</TableCell>
            <TableCell style={{ color: "#ffff" }}>ชื่อโซน</TableCell>
            <TableCell style={{ color: "#ffff" }}>คำอธิบาย</TableCell>
            <TableCell style={{ color: "#ffff" }}>รูปภาพ</TableCell>
            <TableCell style={{ color: "#ffff" }}>สีโซน</TableCell>
            <TableCell style={{ color: "#ffff" }}>สถานะ</TableCell>
            <TableCell style={{ color: "#ffff" }}>จัดการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan, index) => (
            <TableRow key={plan.Plan_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{plan.PlanGroup_Name}</TableCell>
              <TableCell>{plan.Plan_Name}</TableCell>
              <TableCell>{plan.Plan_Desc}</TableCell>
              <TableCell>
                <img
                  src={plan.Plan_Pic}
                  alt="Plan"
                  style={{ cursor: "pointer", width: 100 }}
                  onClick={() => onViewImage(plan.Plan_Pic)}
                />
              </TableCell>
              <TableCell>
                <div
                  title={`Color Code: ${plan?.Plan_Colour_Code || "Default (#fff)"}`}
                  style={{
                    backgroundColor: plan?.Plan_Colour_Code || "#f0f0f0",
                    width: "100px",
                    height: "40px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                  aria-label={`Zone color: ${plan?.Plan_Colour_Code || "default color"}`}
                ></div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={plan.Plan_Active === "Y"}
                  onChange={() => onToggleStatus(plan)} // เพิ่ม onChange เพื่อเรียกฟังก์ชัน
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => onEdit(plan)}>แก้ไข</Button>
                <IconButton onClick={() => onDelete(plan.Plan_id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlanTable;
