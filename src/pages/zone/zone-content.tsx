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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAllPlans,
  createPlan,
  patchPlan,
  deletePlan,
} from "../../services/plan.service";
import { getAllPlanGroups } from "../../services/plan-group.service";
import { getEventStock } from "../../services/event-stock.service";

import Header from "../common/header";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const ZoneContent: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [planGroups, setPlanGroups] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    desc: "",
    pic: "",
    active: "Y",
    planGroupId: "",
  });
  const [editPlan, setEditPlan] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        setPlans(data.plans || []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        });
      }
    };

    const fetchPlanGroups = async () => {
      try {
        const data = await getAllPlanGroups();
        setPlanGroups(data.planGroups || []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        });
      }
    };

    fetchPlans();
    fetchPlanGroups();
  }, []);

  const handleOpen = () => {
    setNewPlan({ name: "", desc: "", pic: "", active: "Y", planGroupId: "" });
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

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setNewPlan((prev) => ({
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
    setEditPlan((prev: any) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };

  // Utility function to check for duplicates
  const isDuplicatePlanName = (
    name: string,
    groupId: number,
    existingPlans: any[]
  ): boolean => {
    return existingPlans.some(
      (plan) =>
        plan.Plan_Name.trim().toLowerCase() === name.trim().toLowerCase() &&
        plan.PlanGroup_id === groupId
    );
  };

  const handleCreate = async () => {
    if (!newPlan.planGroupId) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกผังร้าน",
      });
      return;
    }
  
    const groupId = parseInt(newPlan.planGroupId, 10);
  
    if (isDuplicatePlanName(newPlan.name, groupId, plans)) {
      Swal.fire({
        icon: "error",
        title: "มีแผนที่มีชื่อเดียวกันในกลุ่มนี้แล้ว",
      });
      return;
    }
  
    try {
      await createPlan({
        Plan_Desc: newPlan.desc,
        Plan_Name: newPlan.name,
        Plan_Pic: '',
        Plan_Active: newPlan.active,
        PlanGroup_id: groupId,
      });
      Swal.fire({
        icon: "success",
        title: "สร้างแผนสำเร็จ",
      });
      setNewPlan({ name: "", desc: "", pic: "", active: "", planGroupId: "" });
      setOpen(false);
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการสร้างแผน",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editPlan) return;

    const groupId = editPlan.PlanGroup_id;

    if (isDuplicatePlanName(editPlan.Plan_Name, groupId, plans, editPlan.Plan_id)) {
      Swal.fire({
        icon: "error",
        title: "มีแผนที่มีชื่อเดียวกันในกลุ่มนี้แล้ว",
      });
      return;
    }

    try {
      await patchPlan({
        Plan_id: editPlan.Plan_id,
        Plan_Desc: editPlan.Plan_Desc,
        Plan_Name: editPlan.Plan_Name,
        Plan_Pic: editPlan.Plan_Pic,
        Plan_Active: editPlan.Plan_Active,
        PlanGroup_id: groupId,
      });
      Swal.fire({
        icon: "success",
        title: "อัปเดตแผนสำเร็จ",
      });
      handleEditClose();
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดตแผน",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const eventStocks = await getEventStock();
      const isPlanInUse = eventStocks.some((stock) => stock.Plan_Id === id);

      if (isPlanInUse) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถลบโซนที่กำลังใช้งานอยู่",
        });
        return;
      }

      await deletePlan(id);
      Swal.fire({
        icon: "success",
        title: "ลบโซนสำเร็จ",
      });
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการลบโซน",
      });
    }
  };

  const toggleActiveStatus = async (plan: any) => {
    try {
      const updatedPlan = {
        ...plan,
        Plan_Active: plan.Plan_Active === "Y" ? "N" : "Y",
      };
      await patchPlan(updatedPlan);
      Swal.fire({
        icon: "success",
        title: "อัปเดตสถานะสำเร็จ",
      });
      const data = await getAllPlans();
      setPlans(data.plans);
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


  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const filteredPlans = plans.filter((plan) => {
    return (
      (statusFilter === "ทั้งหมด" || plan.Plan_Active === statusFilter) &&
      plan.Plan_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPlan({ ...newPlan, pic: e.target?.result as string });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleEditImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditPlan({ ...editPlan, Plan_Pic: e.target?.result as string });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div>
      <Header title="โซน" />
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
          <FormControl variant="outlined" style={{ marginRight: "10px", minWidth: 120 }}>
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
            placeholder="ค้นหาโซน"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: "10px",marginTop:"10px" }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent', // Remove the border
                },
                '&:hover fieldset': {
                  borderColor: 'transparent', // Remove the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent', // Remove the border when focused
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
            marginRight: "1220px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          เพิ่มรายการ +
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>ลำดับ</TableCell>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>ชื่อผัง</TableCell>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>ชื่อโซน</TableCell>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>คำอธิบาย</TableCell>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>รูปภาพ</TableCell>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>สถานะ</TableCell>
              <TableCell style={{color:"black",fontSize:"18px",fontWeight:"bold"}}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((plan, index) => (
                <TableRow key={plan.Plan_id}>
                  <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell>{plan.PlanGroup_Name}</TableCell>
                  <TableCell>{plan.Plan_Name}</TableCell>
                  <TableCell>{plan.Plan_Desc}</TableCell>
                  <TableCell>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <img
                      src={plan.Plan_Pic}
                      alt="Plan Image"
                      style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                      onClick={() => handleImageClick(plan.Plan_Pic)}
                    />
                  </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.Plan_Active === "Y"}
                      onChange={() => toggleActiveStatus(plan)}
                      color="primary"
                    />
                    <span>
                      {plan.Plan_Active === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                    </span>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
        <DialogTitle>Create New Plan</DialogTitle>
        <DialogContent>
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
          
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="ชื่อโซน"
            type="text"
            fullWidth
            value={newPlan.name}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent', // Remove the border
                },
                '&:hover fieldset': {
                  borderColor: 'transparent', // Remove the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent', // Remove the border when focused
                },
              },
            }}
          />
          <TextField
            margin="dense"
            name="desc"
            label="คำอธิบาย"
            type="text"
            fullWidth
            value={newPlan.desc}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent', // Remove the border
                },
                '&:hover fieldset': {
                  borderColor: 'transparent', // Remove the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent', // Remove the border when focused
                },
              },
            }}
          />
          <input
            accept="image/*"
            style={{ display: 'block', margin: 'dense' }}
            type="file"
            onChange={handleImageChange}
          />
          {newPlan.pic && (
            <img
              src={newPlan.pic}
              alt="Selected"
              style={{ width: '100px', height: 'auto', cursor: 'pointer', marginTop: '10px' }}
            />
          )}

            <FormControl fullWidth margin="dense">
            <InputLabel id="active-label">Active (Y/N)</InputLabel>
            <Select
              labelId="active-label"
              name="active"
              value={newPlan.active}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent', // Remove the border
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent', // Remove the border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent', // Remove the border when focused
                  },
                },
              }}
            />
            <TextField
              margin="dense"
              name="Plan_Desc"
              label="คำอธิบาย"
              type="text"
              fullWidth
              value={editPlan.Plan_Desc}
              onChange={handleEditChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent', // Remove the border
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent', // Remove the border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent', // Remove the border when focused
                  },
                },
              }}
            />
            <div style={{ margin: 'dense' }}>
              <label htmlFor="upload-image" style={{ display: 'block', marginBottom: '8px' }}>รูปภาพ</label>
              <input
                id="upload-image"
                accept="image/*"
                style={{ display: 'block', marginBottom: '8px' }}
                type="file"
                onChange={handleEditImageChange}
              />
              {editPlan.Plan_Pic && (
                <img
                  src={editPlan.Plan_Pic}
                  alt="Selected"
                  style={{ width: '100px', height: 'auto', cursor: 'pointer', marginTop: '10px' }}
                />
              )}
            </div>
              
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
            <FormControl fullWidth margin="dense">
              <InputLabel id="active-label-edit">Active (Y/N)</InputLabel>
              <Select
                labelId="active-label-edit"
                name="Plan_Active"
                value={editPlan.Plan_Active}
                onChange={handleEditChange}
                fullWidth
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

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Plan"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ZoneContent;
