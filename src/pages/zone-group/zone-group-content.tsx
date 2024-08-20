import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllPlanGroups,
  createPlanGroup,
  updatePlanGroup,
  deletePlanGroup,
} from "../../services/plan-group.service";
import { getPlansList } from "../../services/plan-list.service";
import Header from "../common/header"; 
import toast from "react-hot-toast";

const ZoneGroupContent: React.FC = () => {
  const [planGroups, setPlanGroups] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // For edit dialog
  const [newPlanGroup, setNewPlanGroup] = useState({
    name: "",
    active: "N", // Default to inactive
  });
  const [editPlanGroup, setEditPlanGroup] = useState<any>(null); // For editing
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlanGroupsAndPlans = async () => {
      try {
        const planGroupsData = await getAllPlanGroups();
        const plansData = await getPlansList();

        if (planGroupsData && planGroupsData.planGroups) {
          setPlanGroups(planGroupsData.planGroups);
        } else {
          setPlanGroups([]);
        }

        if (plansData && plansData.plans) {
          setPlans(plansData.plans);
        } else {
          setPlans([]);
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };

    fetchPlanGroupsAndPlans();
  }, []);

  // Calculate plan count for each group
  const calculatePlanCount = (planGroupId: number) => {
    return plans.filter((plan) => plan.PlanGroup_id === planGroupId).length;
  };

  const handleOpen = () => {
    setNewPlanGroup({ name: "", active: "N" }); // Reset form values
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (planGroup: any) => {
    setEditPlanGroup(planGroup);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditPlanGroup(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNewPlanGroup((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setEditPlanGroup((prev: any) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      await createPlanGroup({
        PlanGroup_Name: newPlanGroup.name,
        PlanGroup_Active: newPlanGroup.active,
        Created_By: "Admin", 
      });
      toast.success("สร้างผังร้านสำเร็จ");
      setNewPlanGroup({ name: "", active: "N" }); // Reset form after creation
      setOpen(false);
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      toast.error("Failed to create plan group");
    }
  };

  const handleSaveEdit = async () => {
    if (!editPlanGroup) return;

    try {
      await updatePlanGroup({
        PlanGroup_id: editPlanGroup.PlanGroup_id,
        PlanGroup_Name: editPlanGroup.PlanGroup_Name,
        PlanGroup_Active: editPlanGroup.PlanGroup_Active,
      });
      toast.success("อัพเดทผังร้านสำเร็จ");
      handleEditClose();
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      toast.error("ล้มเหลวระหว่างอัปเดตผังร้าน");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePlanGroup(id);
      toast.success("ลบผังร้านสำเร็จ");
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      toast.error("Failed to delete plan group");
    }
  };

  const toggleActiveStatus = async (planGroup: any) => {
    try {
      const updatedPlanGroup = {
        ...planGroup,
        PlanGroup_Active: planGroup.PlanGroup_Active === "Y" ? "N" : "Y",
      };
      await updatePlanGroup(updatedPlanGroup);
      toast.success("อัพเดทสถานะสำเร็จ");
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      toast.error("ล้มเหลวระหว่างอัปเดตสถานะ");
    }
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = planGroups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(planGroups.length / itemsPerPage);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Header title="ผังร้าน" />
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
          เพิ่มผังร้าน +
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
          <div style={{ flex: 1, color: "black" }}>รหัสผัง</div>
          <div style={{ flex: 2, color: "black" }}>ชื่อผังร้าน</div>
          <div style={{ flex: 1, color: "black" }}>จำนวนโซน</div>
          <div style={{ flex: 1, color: "black" }}>สถานะ</div>
          <div style={{ flex: 1, color: "black" }}>จัดการ</div>
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((planGroup, index) => (
            <div
              key={planGroup.PlanGroup_id}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ flex: 1, color: "black" }}>
                {indexOfFirstItem + index + 1}
              </div>
              <div style={{ flex: 1, color: "black" }}>
                {planGroup.PlanGroup_id}
              </div>
              <div style={{ flex: 2, color: "black" }}>
                {planGroup.PlanGroup_Name}
              </div>
              <div style={{ flex: 1, color: "black", textAlign: "center" }}>
                {calculatePlanCount(planGroup.PlanGroup_id)}
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Switch
                  checked={planGroup.PlanGroup_Active === "Y"}
                  onChange={() => toggleActiveStatus(planGroup)}
                  color="primary"
                />
                <span style={{ color: "black" }}>
                  {planGroup.PlanGroup_Active === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                </span>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditOpen(planGroup)}
                >
                  รายละเอียด
                </Button>
                <IconButton
                  onClick={() => handleDelete(planGroup.PlanGroup_id)}
                  style={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "10px 20px", color: "black" }}>
            ไม่พบข้อมูล
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
        <DialogTitle>สร้างผังร้านใหม่</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="ชื่อผังร้าน"
            type="text"
            fullWidth
            value={newPlanGroup.name}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="active-label">Active (Y/N)</InputLabel>
            <Select
              labelId="active-label"
              name="active"
              value={newPlanGroup.active}
              onChange={handleChange}
              label="Active (Y/N)"
            >
              <MenuItem value="Y">Yes</MenuItem>
              <MenuItem value="N">No</MenuItem>
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
      {editPlanGroup && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>แก้ไขผังร้าน</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="PlanGroup_Name"
              label="ชื่อผังร้าน"
              type="text"
              fullWidth
              value={editPlanGroup.PlanGroup_Name}
              onChange={handleEditChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="active-label-edit">Active (Y/N)</InputLabel>
              <Select
                labelId="active-label-edit"
                name="PlanGroup_Active"
                value={editPlanGroup.PlanGroup_Active}
                onChange={handleEditChange}
                label="Active (Y/N)"
              >
                <MenuItem value="Y">Yes</MenuItem>
                <MenuItem value="N">No</MenuItem>
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

export default ZoneGroupContent;
