import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  //   Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAllEmp,
  getAllPosition,
  createEmployee,
  patchEmployee,
  deleteEmp,
} from "../../services/emp.service";
import { getAllPlanGroups } from "../../services/plan-group.service";
import Header from "../common/header";
import Swal from "sweetalert2";
import { useFetchTicketTypes } from "../../hooks/fetch-data/useFetchTicketTypes";
import { useZoneStore } from "../create-event/form-store";
import Plan from "../edit-event/_components/Plan";
import {
  createTicketNoPerPlan,
  getAllTicketNoPerPlanByEventId,
} from "../../services/ticket-no-per-plan.service";
interface Plan {
  name: string;
  desc: string;
  pic: string;
  active: string;
  planGroupId: string;
  selectedTicketType: string;
  zone: string;
  seats: string;
}
const AllContent: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planGroups, setPlanGroups] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    Emp_Code: "",
    Emp_Prefix: "",
    Emp_Name: "",
    Emp_Dept: 0,
    Emp_Position: 0,
    Emp_Position_Detail: "",
    Emp_StartDate: null,
    Emp_Tel: "",
    Emp_Status: "Y",
    Emp_UUser: "",
    Emp_PPass: "",
  });

  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [letter, setTetter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ทั้งหมด");
  const [selectTableModal, setSelectTableModal] = useState<sting>("");
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [selectedTicketTypeName, setSelectedTicketTypeName] =
    useState<string>("");

  const [zone, setZone] = useState<string>("");
  const [seats, setSeats] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<string>(1);
  const [ticketNoPerPlan, setTicketNoPerPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { zones, inputValues, setInputValueStore, setStartNumber } =
    useZoneStore();
  const { data: ticketTypes } = useFetchTicketTypes();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllEmp();
        if (data && data.employees) {
          setPlans(data.employees);
        } else {
          console.warn("No plans found.");
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    const fetchPlanGroups = async () => {
      try {
        const data = await getAllPlanGroups();
        if (data && data.planGroups) {
          const activePlanGroups = data.planGroups.filter(
            (group) => group.PlanGroup_Active === "Y"
          );
          setPlanGroups(activePlanGroups);
        } else {
          console.warn("No plan groups found.");
          setPlanGroups([]);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          customClass: {
            title: "swal2-title",
            content: "swal2-content",
          },
        });
        console.error("Failed to fetch plan groups:", error);
      }
    };

    fetchPlans();
    fetchPlanGroups();
  }, []);

  const handleOpen = () => {
    const lastEmpCode = plans[plans.length - 1]?.Emp_Code || "";
    const nextEmpCode = lastEmpCode.replace(/\d+$/, (num) =>
      String(parseInt(num, 10) + 1).padStart(3, "0")
    );
    setNewEmployee({
      Emp_Code: nextEmpCode,
      Emp_Prefix: "",
      Emp_Name: "",
      Emp_Dept: 0,
      Emp_Position: 0,
      Emp_Position_Detail: "",
      Emp_StartDate: null,
      Emp_Tel: "",
      Emp_Status: "Y",
      Emp_UUser: "",
      Emp_PPass: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setNewEmployee({
      Emp_Code: "",
      Emp_Prefix: "",
      Emp_Name: "",
      Emp_Dept: 0,
      Emp_Position: 0,
      Emp_Position_Detail: "",
      Emp_StartDate: null,
      Emp_Tel: "",
      Emp_Status: "Y",
      Emp_UUser: "",
      Emp_PPass: "",
    });
    setSelectedTicketType("");
    setZone("");
    setSeats("");
    setSelectedTable("");
    setSelectedTicketTypeName("");
    setOpen(false);
  };

  const handleEditOpen = async (plan: any) => {
    setSelectTableModal(plan.Ticket_No_Option);
    const Position = await getAllPosition();
    let AllPosition = Position?.Comp;
    const planDataMerge = {
      ...plan,
      AllPosition,
    };

    console.log("planDataMerge =>", planDataMerge);

    setEditPlan(planDataMerge);
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

    setNewEmployee((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    Emp_Id: number
  ) => {
    const { name, value } = event.target;
    if (!name) {
      console.error("Event target name is undefined");
      return;
    }

    setEditPlan((prev: any) => ({
      ...prev,
      [name]: value,
      [Emp_Id]: Emp_Id,
    }));

    if (name === "selectTableModal") {
      setSelectTableModal(value);
      setStartNumber(1);
    } else if (name === "Plan_Ticket_Type_Id") {
      const typeName = ticketTypes.find(
        (type) => type.Ticket_Type_Id === value
      );
      setSelectedTicketTypeName(typeName?.Ticket_Type_Name || "");
    }
  };

  // const handleEditChangePosition = (
  //   event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  //   Emp_Id: number
  // ) => {
  //   const { name, value } = event.target;

  //   if (!name) {
  //     console.error("Event target name is undefined");
  //     return;
  //   }
  //   console.log("value");
  //   setEditPlan((prev: any) => ({
  //     ...prev,
  //     [name]: value,
  //     [Emp_Id]: Emp_Id,
  //   }));
  // };

  const handleCreate = async () => {
    console.log("newEmployee", newEmployee);
    try {
      const res = await createEmployee({
        Emp_Code: newEmployee.Emp_Code,
        Emp_Prefix: newEmployee.Emp_Prefix,
        Emp_Name: newEmployee.Emp_Name,
        Emp_Dept: 1,
        Emp_Position: newEmployee.Emp_Position || 2,
        Emp_Position_Detail: newEmployee.Emp_Position_Detail,
        Emp_StartDate: newEmployee.Emp_StartDate || null,
        Emp_Tel: newEmployee.Emp_Tel,
        Emp_Status: newEmployee.Emp_Status || "Y",
        Emp_UUser: newEmployee.Emp_UUser,
        Emp_PPass: newEmployee.Emp_PPass,
      });

      console.log("Response from create", res);
      //   if (typeof res.CompId === "number") {

      Swal.fire({
        icon: "success",
        title: "สร้างสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });

      //   }
      setOpen(false);
      const data = await getAllEmp();
      if (data && data.employees) {
        setPlans(data.employees);
      }
    } catch (error: any) {
      console.error("Error creating :", error);
      Swal.fire({
        title: "ล้มเหลวในการสร้าง",
        icon: "error",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editPlan) return;

    try {
      const payload = {
        Emp_Id: editPlan.Emp_Id,
        Emp_Code: editPlan.Emp_Code,
        Emp_Prefix: editPlan.Emp_Prefix,
        Emp_Name: editPlan.Emp_Name,
        Emp_Dept: editPlan.Emp_Dept,
        Emp_Position: editPlan.Emp_Position,
        Emp_Position_Detail: editPlan.Emp_Position_Detail,
        Emp_StartDate: editPlan.Emp_StartDate,
        Emp_Tel: editPlan.Emp_Tel,
        Emp_Status: editPlan.Emp_Status,
        Emp_UUser: editPlan.Emp_UUser,
        Emp_PPass: editPlan.Emp_PPass,
        Emp_PIN: editPlan.Emp_PIN,
        Gold_SO: editPlan.Gold_SO,
        Comp_Id: editPlan.Comp_Id,
      };

      console.log("payload =>", payload);
      await patchEmployee(payload);

      Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });

      handleEditClose();
      const data = await getAllEmp();
      setPlans(data.employees);
    } catch (error: any) {
      console.error("Error updating :", error.message);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดต",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการลบโซนนี้จริงหรือ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ไม่, ยกเลิก",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
          confirmButton: "swal2-confirm",
          cancelButton: "swal2-cancel",
        },
      });

      if (!result.isConfirmed) {
        return;
      }

      await deleteEmp(id);
      Swal.fire({
        icon: "success",
        title: "ลบโซนสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });

      const data = await getAllEmp();
      setPlans(data.employees);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการลบโซน",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const filteredPlans = plans;
  const currentItems = filteredPlans;

  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        height: "100vh",
      }}
    >
      <Header title="ตั้งค่าพนักงาน" />
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
        <div style={{ display: "flex", alignItems: "center" }}></div>
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
          + เพิ่มรายการ
        </Button>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "0" }}
          style={{ maxHeight: "85vh", overflowY: "auto", width: "1030px" }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#11131A", height: "60px" }}>
              <TableRow>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                    width: " 145px",
                    paddingLeft: "10px",
                  }}
                >
                  รหัสอ้างอิงพนักงาน
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                    width: " 200px",
                  }}
                >
                  ชื่อ
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  เบอร์โทร
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                    width: " 140px",
                  }}
                >
                  ตำแหน่ง
                </TableCell>
                {/* <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  ชื่อผู้ใช้
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  รหัสผู้ใช้
                </TableCell> */}
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  จัดการ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((plan, index) => (
                  <TableRow key={plan.Emp_Id}>
                    <TableCell sx={{}}>{plan.Emp_Code}</TableCell>
                    <TableCell sx={{}}>{plan.Emp_Name}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.Emp_Tel}
                    </TableCell>{" "}
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.Emp_Position_Detail}
                    </TableCell>
                    {/* <TableCell sx={{ textAlign: "center" }}>
                      {plan.Emp_UUser}
                    </TableCell>{" "}
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.Emp_PPass}
                    </TableCell>{" "} */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditOpen(plan)}
                        sx={{ marginRight: "5px" }}
                      >
                        รายละเอียด
                      </Button>
                      <IconButton
                        onClick={() => handleDelete(plan.Emp_Id)}
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
                  <TableCell colSpan={7} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      ></div>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "700px", maxWidth: "none" } }}
      >
        <DialogTitle>สร้างพนักงาน</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "6px",
              marginRight: "6px",
            }}
          >
            <Box sx={{ marginRight: "6px" }}>
              <TextField
                autoFocus
                margin="dense"
                name="Emp_Name"
                label="ชื่อ"
                type="text"
                fullWidth
                value={newEmployee.Emp_Name}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                    },
                  },
                }}
              />
              <TextField
                margin="dense"
                name="Emp_Tel"
                label="เบอร์โทร"
                type="text"
                fullWidth
                value={newEmployee.Emp_Tel}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                    },
                  },
                }}
              />

              {/* <FormControl fullWidth margin="dense">
                  <InputLabel id="plan-group-label-edit">ตำแหน่ง</InputLabel>
                  <Select
                    labelId="plan-group-label-edit"
                    name="PlanGroup_id"
                    value={editPlan.Emp_Position_Detail}
                    onChange={(e) =>
                      handleEditChangePosition(e, editPlan.Emp_Id)
                    }
                    fullWidth
                  >
                    {editPlan.AllPosition.map((group) => (
                      <MenuItem key={group.PST_Id} value={group.PST_Id}>
                        {group.PST_Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              <TextField
                margin="dense"
                name="Emp_Position_Detail"
                label="ตำแหน่ง"
                type="text"
                fullWidth
                value={newEmployee.Emp_Position_Detail}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                    },
                  },
                }}
              />
              <TextField
                margin="dense"
                name="Emp_UUser"
                label="ชื่อผู้ใช้"
                type="text"
                fullWidth
                value={newEmployee.Emp_UUser}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                    },
                  },
                }}
              />
              <TextField
                margin="dense"
                name="Emp_PPass"
                label="รหัสผู้ใช้"
                type="text"
                fullWidth
                value={newEmployee.Emp_PPass}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                    },
                  },
                }}
              />
            </Box>
          </Box>
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

      {editPlan && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>แก้ไขข้อมูลพนักงาน</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "6px",
                marginRight: "6px",
              }}
            >
              <Box sx={{ marginRight: "6px" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="Emp_Name"
                  label="ชื่อ"
                  type="text"
                  fullWidth
                  value={editPlan.Emp_Name}
                  onChange={(e) => handleEditChange(e, editPlan.Emp_Id)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                      },
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  name="Emp_Tel"
                  label="เบอร์โทร"
                  type="text"
                  fullWidth
                  value={editPlan.Emp_Tel}
                  onChange={(e) => handleEditChange(e, editPlan.Emp_Id)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                      },
                    },
                  }}
                />

                {/* <FormControl fullWidth margin="dense">
                  <InputLabel id="plan-group-label-edit">ตำแหน่ง</InputLabel>
                  <Select
                    labelId="plan-group-label-edit"
                    name="PlanGroup_id"
                    value={editPlan.Emp_Position_Detail}
                    onChange={(e) =>
                      handleEditChangePosition(e, editPlan.Emp_Id)
                    }
                    fullWidth
                  >
                    {editPlan.AllPosition.map((group) => (
                      <MenuItem key={group.PST_Id} value={group.PST_Id}>
                        {group.PST_Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <TextField
                  margin="dense"
                  name="Emp_Position_Detail"
                  label="ตำแหน่ง"
                  type="text"
                  fullWidth
                  value={editPlan.Emp_Position_Detail}
                  onChange={(e) => handleEditChange(e, editPlan.Emp_Id)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                      },
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  name="Emp_UUser"
                  label="ชื่อผู้ใช้"
                  type="text"
                  fullWidth
                  value={editPlan.Emp_UUser}
                  onChange={(e) => handleEditChange(e, editPlan.Emp_Id)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                      },
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  name="Emp_PPass"
                  label="รหัสผู้ใช้"
                  type="text"
                  fullWidth
                  value={editPlan.Emp_PPass}
                  onChange={(e) => handleEditChange(e, editPlan.Emp_Id)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
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
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            maxWidth: "500px",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 9,
              top: 0,
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>
          {loading ? (
            <CircularProgress />
          ) : (
            selectedImage && (
              <img
                src={selectedImage}
                alt="Selected Plan"
                style={{ width: "100%", height: "auto", borderRadius: "4px" }} // Control image size
              />
            )
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AllContent;
