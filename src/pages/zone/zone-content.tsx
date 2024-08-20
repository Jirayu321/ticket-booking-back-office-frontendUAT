import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllPlans, createPlan, patchPlan, deletePlan } from "../../services/plan.service";
import { getAllPlanGroups } from "../../services/plan-group.service";
import Header from "../common/header";
import { toast } from "react-hot-toast";

const ZoneContent: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [planGroups, setPlanGroups] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // For edit dialog
  const [newPlan, setNewPlan] = useState({
    name: "",
    desc: "",
    pic: "",
    active: "N", // Default to "N" (Inactive)
    planGroupId: "",
  });
  const [editPlan, setEditPlan] = useState<any>(null); // For editing
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        if (data && data.plans && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          setPlans([]);
        }
      } catch (error) {
        toast.error("Failed to fetch plans");
      }
    };

    const fetchPlanGroups = async () => {
      try {
        const data = await getAllPlanGroups();
        if (data && data.planGroups && Array.isArray(data.planGroups)) {
          setPlanGroups(data.planGroups);
        } else {
          setPlanGroups([]);
        }
      } catch (error) {
        toast.error("Failed to fetch plan groups");
      }
    };

    fetchPlans();
    fetchPlanGroups();
  }, []);

  const handleOpen = () => {
    setNewPlan({ name: "", desc: "", pic: "", active: "N", planGroupId: "" }); // Reset form values
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (plan: any) => {
    setEditPlan(plan);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditPlan(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNewPlan((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setEditPlan((prev: any) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleCreate = async () => {
    if (!newPlan.planGroupId) {
      toast.error("กรุณาเลือกกลุ่มแผน");
      return;
    }

    try {
      await createPlan({
        Plan_Desc: newPlan.desc,
        Plan_Name: newPlan.name,
        Plan_Pic: newPlan.pic,
        Plan_Active: newPlan.active,
        PlanGroup_id: parseInt(newPlan.planGroupId, 10),
      });
      toast.success("สร้างแผนสำเร็จ");
      setNewPlan({ name: "", desc: "", pic: "", active: "N", planGroupId: "" }); // Reset form after creation
      setOpen(false);
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      toast.error("ไม่สามารถสร้างแผนได้");
    }
  };

  const handleSaveEdit = async () => {
    if (!editPlan) return;

    try {
      await patchPlan({
        Plan_id: editPlan.Plan_id,
        Plan_Desc: editPlan.Plan_Desc,
        Plan_Name: editPlan.Plan_Name,
        Plan_Pic: editPlan.Plan_Pic,
        Plan_Active: editPlan.Plan_Active,
        PlanGroup_id: editPlan.PlanGroup_id,
      });
      toast.success("อัพเดทแผนสำเร็จ");
      handleEditClose();
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      toast.error("ล้มเหลวระหว่างอัปเดตแผน");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePlan(id);
      toast.success("ลบแผนสำเร็จ");
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const toggleActiveStatus = async (plan: any) => {
    try {
      const updatedPlan = {
        ...plan,
        Plan_Active: plan.Plan_Active === "Y" ? "N" : "Y",
      };
      await patchPlan(updatedPlan);
      toast.success("อัพเดทสถานะสำเร็จ");
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      toast.error("ล้มเหลวระหว่างอัปเดตสถานะ");
    }
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(plans.length / itemsPerPage);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Header title="โซน" />
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 20,
          paddingLeft: 20,
        }}
      >
        <Button
          onClick={handleOpen}
          style={{
            backgroundColor: "#0B8600",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          เพิ่มรายการ +
        </Button>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#f5f5f5",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          <div style={{ flex: 1, color: "black" }}>ลำดับ</div>
          <div style={{ flex: 1, color: "black" }}>ชื่อโซน</div>
          <div style={{ flex: 2, color: "black" }}>คำอธิบาย</div>
          <div style={{ flex: 1, color: "black" }}>สถานะ</div>
          <div style={{ flex: 1, color: "black" }}>จัดการ</div>
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((plan, index) => (
            <div
              key={plan.Plan_id}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ flex: 1, color: "black" }}>
                {indexOfFirstItem + index + 1}
              </div>
              <div style={{ flex: 1, color: "black" }}>{plan.Plan_Name}</div>
              <div style={{ flex: 2, color: "black" }}>{plan.Plan_Desc}</div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Switch
                  checked={plan.Plan_Active === "Y"}
                  onChange={() => toggleActiveStatus(plan)}
                  color="primary"
                />
                <span style={{ color: "black" }}>
                  {plan.Plan_Active === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditOpen(plan)}
                >
                  รายละเอียด
                </Button>
                <IconButton
                  onClick={() => handleDelete(plan.Plan_id)}
                  style={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "10px 20px", color: "black" }}>
            No plans available
          </div>
        )}
      </div>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            backgroundColor: "#ddd",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              cursor: "pointer",
              backgroundColor: currentPage === index + 1 ? "#007bff" : "#ddd",
              color: currentPage === index + 1 ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            backgroundColor: "#ddd",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          &gt;
        </button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Plan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="ชื่อโซน"
            type="text"
            fullWidth
            value={newPlan.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="desc"
            label="คำอธิบาย"
            type="text"
            fullWidth
            value={newPlan.desc}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="pic"
            label="รูปภาพ"
            type="text"
            fullWidth
            value={newPlan.pic}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="plan-group-label">ผังร้าน</InputLabel>
            <Select
              labelId="plan-group-label"
              name="planGroupId"
              value={newPlan.planGroupId}
              onChange={handleChange}
              fullWidth
            >
              {planGroups.map((group) => (
                <MenuItem key={group.PlanGroup_id} value={group.PlanGroup_id}>
                  {group.PlanGroup_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      {editPlan && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>แก้ไขโซน</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="Plan_Name"
              label="ชื่อโซน"
              type="text"
              fullWidth
              value={editPlan.Plan_Name}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="Plan_Desc"
              label="คำอธิบาย"
              type="text"
              fullWidth
              value={editPlan.Plan_Desc}
              onChange={handleEditChange}
            />
            <TextField
              margin="dense"
              name="Plan_Pic"
              label="รูปภาพ"
              type="text"
              fullWidth
              value={editPlan.Plan_Pic}
              onChange={handleEditChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="plan-group-label-edit">ผังร้าน</InputLabel>
              <Select
                labelId="plan-group-label-edit"
                name="PlanGroup_id"
                value={editPlan.PlanGroup_id}
                onChange={handleEditChange}
                fullWidth
              >
                {planGroups.map((group) => (
                  <MenuItem key={group.PlanGroup_id} value={group.PlanGroup_id}>
                    {group.PlanGroup_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ZoneContent;
