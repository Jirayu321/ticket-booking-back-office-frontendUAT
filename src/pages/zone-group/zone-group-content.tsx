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
import { getEventStock } from "../../services/event-stock.service";
import Header from "../common/header";
import Swal from "sweetalert2";

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
        console.error("Failed to fetch plan groups and plans", error);
      }
    };

    fetchPlanGroupsAndPlans();
  }, []);

  const calculatePlanCount = (planGroupId: number) => {
    return plans.filter((plan) => plan.PlanGroup_id === planGroupId).length;
  };

  const handleOpen = () => {
    setNewPlanGroup({ name: "", active: "Y" });
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

  const isDuplicateName = (name: string, id?: number) => {
    return planGroups.some(
      (group) =>
        group.PlanGroup_Name.trim().toLowerCase() ===
          name.trim().toLowerCase() && group.PlanGroup_id !== id
    );
  };

  const handleCreate = async () => {
    if (isDuplicateName(newPlanGroup.name)) {
      window.alert("ชื่อผังร้านซ้ำกัน");
      return;
    }

    try {
      await createPlanGroup({
        PlanGroup_Name: newPlanGroup.name.trim(),
        PlanGroup_Active: newPlanGroup.active,
        Created_By: "Admin",
      });
      Swal.fire({
        icon: "success",
        title: "สร้างผังร้านสำเร็จ",
      });
      setNewPlanGroup({ name: "", active: "Y" });
      setOpen(false);
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      window.alert("ล้มเหลวในการสร้างผังร้าน");
    }
  };

  const handleSaveEdit = async () => {
    if (!editPlanGroup) return;

    if (
      isDuplicateName(editPlanGroup.PlanGroup_Name, editPlanGroup.PlanGroup_id)
    ) {
      window.alert("ชื่อผังร้านซ้ำกัน");
      return;
    }

    try {
      await updatePlanGroup({
        PlanGroup_id: editPlanGroup.PlanGroup_id,
        PlanGroup_Name: editPlanGroup.PlanGroup_Name.trim(),
        PlanGroup_Active: editPlanGroup.PlanGroup_Active,
      });
      Swal.fire({
        icon: "success",
        title: "อัปเดตผังร้านสำเร็จ",
      });
      handleEditClose();
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดตผังร้าน",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const planCount = calculatePlanCount(id); // Check how many zones are in this plan group
      if (planCount > 0) {
        Swal.fire({
          icon: "error",
          title: "ลบผังร้านไม่ได้",
          text: "ผังร้านนี้ถูกใช้ในโซนแล้ว",
        });
        return; // Don't proceed with the deletion
      }

      const eventStocks = await getEventStock();
      if (!eventStocks || eventStocks.length === 0) {
        await deletePlanGroup(id);
        Swal.fire({
          icon: "success",
          title: "ลบผังร้านสำเร็จ",
        });
        const data = await getAllPlanGroups();
        setPlanGroups(data.planGroups);
        return;
      }

      const isUsedInEventStock = eventStocks.some(
        (stock) => stock.PlanGroup_Id === id
      );

      if (isUsedInEventStock) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถลบผังร้านที่ถูกใช้งานแล้วได้",
        });
        return;
      }

      await deletePlanGroup(id);
      Swal.fire({
        icon: "success",
        title: "ลบผังร้านสำเร็จ",
      });
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการลบผังร้าน",
      });
    }
  };

  const toggleActiveStatus = async (planGroup: any) => {
    try {
      const updatedPlanGroup = {
        ...planGroup,
        PlanGroup_Active: planGroup.PlanGroup_Active === "Y" ? "N" : "Y",
      };
      await updatePlanGroup(updatedPlanGroup);
      Swal.fire({
        icon: "success",
        title: "อัปเดตสถานะสำเร็จ",
      });
      const data = await getAllPlanGroups();
      setPlanGroups(data.planGroups);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดตสถานะ",
      });
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
    <div
      style={{
        backgroundColor: "#f7f7f7",
        height: "100vh",
      }}
    >
      <Header title="ผังร้าน" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          marginTop: "25px",
          marginLeft: "20px",
          marginRight: "20px",
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
              style={{ backgroundColor: "white" }}
            >
              <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
              <MenuItem value="Y">เผยแพร่</MenuItem>
              <MenuItem value="N">ไม่เผยแพร่</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            placeholder="ชื่อผังร้าน"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              marginRight: "10px",
              height: "50px",
              backgroundColor: "white",
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
          />
        </div>
        <Button
          onClick={handleOpen}
          style={{
            backgroundColor: "#0B8600",
            color: "white",
            marginLeft: "auto%",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          + เพิ่มผังร้าน
        </Button>
      </div>
      <TableContainer component={Paper} sx={{ borderRadius: "0" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            {" "}
            <TableRow>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                ลำดับ
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "200px",
                }}
              >
                ชื่อผังร้าน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "200px",
                }}
              >
                จำนวนโซน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "200px",
                }}
              >
                สถานะ
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "300px",
                }}
              >
                จัดการ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((planGroup, index) => (
                <TableRow key={planGroup.PlanGroup_id}>
                  <TableCell sx={{ textAlign: "center", color: "black", fontWeight: 'bold' }}>
                    {indexOfFirstItem + index + 1}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {planGroup.PlanGroup_Name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {calculatePlanCount(planGroup.PlanGroup_id)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Switch
                      checked={planGroup.PlanGroup_Active === "Y"}
                      onChange={() => toggleActiveStatus(planGroup)}
                      color="primary"
                    />
                    {planGroup.PlanGroup_Active === "Y"
                      ? "เผยแพร่"
                      : "ไม่เผยแพร่"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(planGroup)}
                      sx={{ marginRight: "5px" }}
                    >
                      รายละเอียด
                    </Button>
                    <IconButton
                      onClick={() => handleDelete(planGroup.PlanGroup_id)}
                      style={{
                        color: "gray",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
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
          <Button onClick={handleClose} color="primary">
            ปิด
          </Button>
          <Button onClick={handleCreate} color="primary">
            บันทึก
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none", // Remove the inner border
                    transform: "translateY(5px)",
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              ปิด
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ZoneGroupContent;
