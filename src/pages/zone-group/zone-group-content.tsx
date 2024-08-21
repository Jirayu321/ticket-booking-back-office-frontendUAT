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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
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
  const [editOpen, setEditOpen] = useState(false);
  const [newPlanGroup, setNewPlanGroup] = useState({
    name: "",
    active: "N",
  });
  const [editPlanGroup, setEditPlanGroup] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด"); // Default status filter
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

  const calculatePlanCount = (planGroupId: number) => {
    return plans.filter((plan) => plan.PlanGroup_id === planGroupId).length;
  };

  const handleOpen = () => {
    setNewPlanGroup({ name: "", active: "N" });
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

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setNewPlanGroup((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleEditChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setEditPlanGroup((prev: any) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setStatusFilter(event.target.value as string);
  };

  const handleCreate = async () => {
    try {
      await createPlanGroup({
        PlanGroup_Name: newPlanGroup.name,
        PlanGroup_Active: newPlanGroup.active,
        Created_By: "Admin",
      });
      toast.success("สร้างผังร้านสำเร็จ");
      setNewPlanGroup({ name: "", active: "N" });
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

  const filteredPlanGroups = planGroups.filter((group) => {
    return (
      (statusFilter === "ทั้งหมด" || group.PlanGroup_Active === statusFilter) &&
      group.PlanGroup_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlanGroups.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPlanGroups.length / itemsPerPage);

  return (
    <div>
      <Header title="ผังร้าน" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          marginTop: "30px",
          marginLeft: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <FormControl
            variant="outlined"
            style={{ marginRight: "10px", minWidth: 120 }}
          >
            <InputLabel id="status-filter-label">สถานะ</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="สถานะ"
            >
              <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
              <MenuItem value="Y">เผยแพร่</MenuItem>
              <MenuItem value="N">ไม่เผยแพร่</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: "10px" }}
          />
        </div>
        <Button
          onClick={handleOpen}
          style={{
            backgroundColor: "#0B8600",
            color: "white",
            marginRight: "1300px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          เพิ่มผังร้าน +
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
              >
                ลำดับ
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
              >
                รหัสผัง
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
              >
                ชื่อผังร้าน
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
              >
                จำนวนโซน
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
              >
                สถานะ
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: "bold", fontSize: "18px" }}
              >
                จัดการ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((planGroup, index) => (
                <TableRow key={planGroup.PlanGroup_id}>
                  <TableCell style={{ color: "black", fontSize: "14px" }}>
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell style={{ color: "black", fontSize: "14px" }}>
                    {planGroup.PlanGroup_id}
                  </TableCell>
                  <TableCell style={{ color: "black", fontSize: "14px" }}>
                    {planGroup.PlanGroup_Name}
                  </TableCell>
                  <TableCell align="left" style={{ paddingLeft: "50px" }}>
                    {calculatePlanCount(planGroup.PlanGroup_id)}
                  </TableCell>
                  <TableCell align="left">
                    <Switch
                      checked={planGroup.PlanGroup_Active === "Y"}
                      onChange={() => toggleActiveStatus(planGroup)}
                      color="primary"
                    />
                    {planGroup.PlanGroup_Active === "Y"
                      ? "เผยแพร่"
                      : "ไม่เผยแพร่"}
                  </TableCell>
                  <TableCell align="left">
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{ color: "black" }}
                >
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handleClick(page)}
          color="primary"
        />
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
