import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from "@mui/material";
import { SketchPicker } from "react-color";
import Swal from "sweetalert2";
import {
  createPlan,
  patchPlan,
} from "../../services/plan.service";
import GenerateBoxes from "../create-event/components/generate-boxes";


const PlanDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  editPlan: any | null;
  refreshPlans: () => Promise<void>;
}> = ({ open, onClose, mode, editPlan, refreshPlans }) => {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    pic: "",
    active: "Y",
    planGroupId: "",
    selectedTicketType: "",
    zone: "",
    seats: "",
    Plan_Colour_Code: "#fff",
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit" && editPlan) {
      setFormData({
        name: editPlan.Plan_Name,
        desc: editPlan.Plan_Desc,
        pic: editPlan.Plan_Pic,
        active: editPlan.Plan_Active,
        planGroupId: editPlan.PlanGroup_id,
        selectedTicketType: editPlan.Plan_Ticket_Type_Id,
        zone: editPlan.Plan_Ticket_Qty,
        seats: editPlan.Plan_Ticket_Qty_Per,
        Plan_Colour_Code: editPlan.Plan_Colour_Code || "#fff",
      });
    } else {
      setFormData({
        name: "",
        desc: "",
        pic: "",
        active: "Y",
        planGroupId: "",
        selectedTicketType: "",
        zone: "",
        seats: "",
        Plan_Colour_Code: "#fff",
      });
    }
  }, [mode, editPlan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { value: any; name: string }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (color: any) => {
    setFormData((prev) => ({
      ...prev,
      Plan_Colour_Code: color.hex,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          pic: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      if (mode === "create") {
        await createPlan({
          Plan_Desc: formData.desc,
          Plan_Name: formData.name,
          Plan_Pic: formData.pic || null,
          Plan_Active: formData.active,
          PlanGroup_id: parseInt(formData.planGroupId, 10),
          Plan_Ticket_Type_Id: formData.selectedTicketType,
          Plan_Ticket_Qty: formData.zone,
          Plan_Ticket_Qty_Per: formData.seats,
          Plan_Colour_Code: formData.Plan_Colour_Code,
        });
        Swal.fire("สำเร็จ", "สร้างโซนสำเร็จ", "success");
      } else {
        await patchPlan({
          Plan_id: editPlan.Plan_id,
          Plan_Desc: formData.desc,
          Plan_Name: formData.name,
          Plan_Pic: formData.pic || null,
          Plan_Active: formData.active,
          PlanGroup_id: parseInt(formData.planGroupId, 10),
          Plan_Ticket_Type_Id: formData.selectedTicketType,
          Plan_Ticket_Qty: formData.zone,
          Plan_Ticket_Qty_Per: formData.seats,
          Plan_Colour_Code: formData.Plan_Colour_Code,
        });
        Swal.fire("สำเร็จ", "อัปเดตโซนสำเร็จ", "success");
      }
      await refreshPlans();
      onClose();
    } catch (error) {
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล", "error");
      console.error("Save Error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === "create" ? "สร้างโซนใหม่" : "แก้ไขโซน"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel id="plan-group-label">ผังร้าน</InputLabel>
          <Select
            labelId="plan-group-label"
            name="planGroupId"
            value={formData.planGroupId}
            onChange={handleChange}
          >
            {/* Replace this with dynamic options */}
            <MenuItem value="1">ผังร้าน 1</MenuItem>
            <MenuItem value="2">ผังร้าน 2</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="name"
          label="ชื่อโซน"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="desc"
          label="คำอธิบาย"
          value={formData.desc}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <Box sx={{ marginY: 2 }}>
          <Typography>สีโซน</Typography>
          <Box
            sx={{
              backgroundColor: formData.Plan_Colour_Code,
              width: 50,
              height: 50,
              cursor: "pointer",
              border: "1px solid #ccc",
            }}
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
          />
          {colorPickerOpen && (
            <SketchPicker
              color={formData.Plan_Colour_Code}
              onChangeComplete={handleColorChange}
            />
          )}
        </Box>
        <TextField
          type="file"
          onChange={handleImageChange}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        {formData.pic && (
          <Box
            component="img"
            src={formData.pic}
            alt="Preview"
            sx={{ width: "100%", maxHeight: 200, objectFit: "contain", marginY: 2 }}
          />
        )}
        <GenerateBoxes
          method="1"
          totalSeats={formData.zone}
          zoneId={1}
          selectedTicketType="ประเภทตั๋ว"
          letter=""
          mode={mode}
          dataEdit={editPlan}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ปิด</Button>
        <Button onClick={handleSave} color="primary">
          {mode === "create" ? "บันทึก" : "อัปเดต"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanDialog;
