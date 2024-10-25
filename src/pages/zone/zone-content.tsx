import React, { useState, useEffect, useRef } from "react";
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
  Box,
  Modal,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAllPlans,
  createPlan,
  patchPlan,
  deletePlan,
} from "../../services/plan.service";
import { getAllPlanGroups } from "../../services/plan-group.service";
import {
  createEventStock,
  getEventStock,
} from "../../services/event-stock.service";

import Header from "../common/header";
import Swal from "sweetalert2";
import { useFetchTicketTypes } from "../../hooks/fetch-data/useFetchTicketTypes";
import { useZoneStore } from "../create-event/form-store";
import { ZoneData } from "../edit-event/type";
import Plan from "../edit-event/_components/Plan";
import GenerateBoxes from "../create-event/components/generate-boxes";
import { set } from "react-hook-form";
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
const ZoneContent: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planGroups, setPlanGroups] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    desc: "",
    pic: "",
    active: "Y",
    planGroupId: "",
    selectedTicketType: "", // selectedTicketType
    zone: "", //  zone
    seats: "", // seats
  });
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [letter, setTetter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ทั้งหมด");

  const [selectTableModal, setSelectTableModal] = useState<sting>("");
  const itemsPerPage = 50;

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

  // ประเภทตั๋ว
  const handleTicketTypeChange = (e) => {
    const ticketTypeId = e.target.value;
    console.log("Selected Ticket Type ID:", ticketTypeId);
    const selectedTicket = ticketTypes.find(
      (ticket) => ticket.Ticket_Type_Id === ticketTypeId
    );
    // ประเภทตั๋ว ID
    setSelectedTicketType(ticketTypeId);
    // ประเภทตั๋ว Name
    setSelectedTicketTypeName(selectedTicket?.Ticket_Type_Name || "");

    setNewPlan((prevPlan) => {
      console.log("Previous Plan:", prevPlan); // Log the previous plan
      const newPlan = {
        ...prevPlan,
        selectedTicketType: ticketTypeId,
      };
      console.log("New Plan:", newPlan); // Log the new plan
      return newPlan;
    });
  };

  // โซน
  const handleZoneChange = (e) => {
    const value = e.target.value;
    console.log("Selected Zone:", value); // Log the selected zone
    setZone(value);
    setNewPlan((prevPlan) => {
      console.log("Previous Plan:", prevPlan); // Log the previous plan
      const newPlan = {
        ...prevPlan,
        zone: value,
      };
      console.log("New Plan:", newPlan); // Log the new plan
      return newPlan;
    });
  };

  // ที่นั่ง
  const handleSeatsChange = (e) => {
    const value = e.target.value;
    console.log("Selected Seats:", value); // Log the selected seats
    setSeats(value);
    setNewPlan((prevPlan) => {
      console.log("Previous Plan:", prevPlan); // Log the previous plan
      const newPlan = {
        ...prevPlan,
        seats: value,
      };
      console.log("New Plan:", newPlan); // Log the new plan
      return newPlan;
    });
  };

  // Select โต๊ะ 1-5
  const handleTableChange = (e) => {
    const value = e.target.value;
    console.log("Selected Table:", value); // Log the selected table
    setSelectedTable(value);
  };

  const fetchTicketNoPerPlan = async (planId, planGroupId) => {
    try {
      const data = await getAllTicketNoPerPlanByEventId({
        planId,
        planGroupId,
      });
      if (data && data.length > 0) {
        setSelectTableModal(data[0].Ticket_No_Option);
        setTicketNoPerPlan(data);
      } else {
        console.warn(
          "No ticket numbers found for the given plan and plan group."
        );
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch ticket no per plan:", error);
      return [];
    }
  };

  // ข้อมูล Plan และ PlanGroup
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        if (data && data.plans) {
          setPlans(data.plans);
        } else {
          console.warn("No plans found.");
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    // ดึงข้อมูล PlanGroup ที่มีสถานะเป็น Y
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

  // สร้างแผนใหม่
  const handleOpen = () => {
    setNewPlan({
      name: "",
      desc: "",
      pic: "",
      active: "Y",
      planGroupId: "",
      selectedTicketType: "",
      zone: "",
      seats: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setNewPlan({
      planGroupId: "",
      name: "",
      desc: "",
      pic: "",
      active: "",
    });
    setSelectedTicketType("");
    setZone("");
    setSeats("");
    setSelectedTable("");
    setSelectedTicketTypeName("");
    setOpen(false);
  };

  const handleEditOpen = async (plan: any) => {
    console.log("handleEditOpen plan =>", plan);
    setSelectTableModal(plan.Ticket_No_Option);
    const dataTicketNoPerPage = await fetchTicketNoPerPlan(
      plan.Plan_id,
      plan.PlanGroup_id
    );

    const planDataMerge = {
      ...plan,
      ticketNoPlanList: dataTicketNoPerPage,
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
    >,
    mode: string
  ) => {
    const { name, value } = event.target;

    setNewPlan((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  // แก้ไขแผน
  // const handleEditChange = (
  //   event: React.ChangeEvent<
  //     HTMLInputElement | { name?: string; value: unknown }
  //   >
  // ) => {
  //   const { name, value } = event.target;
  //   // console.log("handleEditChange value", value);
  //   setEditPlan((prev: any) => ({
  //     ...prev,
  //     [name!]: value,
  //   }));
  //   if (name === "selectTableModal") {
  //     setSelectTableModal(value);
  //     setStartNumber(1);
  //   } else if (name === "Plan_Ticket_Type_Id") {
  //     const typeName = ticketTypes.find(
  //       (type) => type.Ticket_Type_Id === value
  //     );
  //     setSelectedTicketTypeName(typeName?.Ticket_Type_Name || "");
  //   }
  // };
  const handleEditChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (!name) {
      console.error("Event target name is undefined");
      return;
    }

    setEditPlan((prev: any) => ({
      ...prev,
      [name]: value,
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setStatusFilter(event.target.value as string);
  };

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

  const handleSaveTicketNumbers = async (
    planGroupId: number,
    planId: number
  ) => {
    const ticketNumberData = Object.entries(zones).flatMap(
      ([zoneId, zoneData]) => {
        const ticketValues = zoneData.tableValues;
        if (!ticketValues) return [];

        return ticketValues.map((ticketValue, index) => ({
          PlanGroup_Id: planGroupId,
          Plan_Id: planId,
          Line: index + 1,
          Ticket_No: ticketValue,
          Ticket_No_Option: selectedTable,
        }));
      }
    );

    try {
      await Promise.all(
        ticketNumberData.map(async (ticket) => {
          const { PlanGroup_Id, Plan_Id, Line, Ticket_No, Ticket_No_Option } =
            ticket;
          await createTicketNoPerPlan({
            PlanGroup_Id,
            Plan_Id,
            Line,
            Ticket_No,
            Ticket_No_Option,
          });
        })
      );
    } catch (error) {
      console.error("Failed to save ticket numbers", error);
      throw new Error("ล้มเหลวระหว่างสร้างเลขตั๋ว");
    }
  };

  // const DEFAULT_ACTIONER = "admin";

  //
  // const handleSaveEventStock = async (
  //   plan_Id: number,
  //   planGroup_Id: number,
  //   ticket_Type_Id: number,
  //   ticket_Qty: number,
  //   ticket_Qty_Per: number
  // ) => {
  //   try {
  //     const stcTotal = ticket_Qty * ticket_Qty_Per;

  //     const zoneDataArray = [{
  //       PlanGroup_Id: planGroup_Id,
  //       Plan_Id: plan_Id,
  //       Ticket_Type_Id: ticket_Type_Id,
  //       Ticket_Qty: ticket_Qty,
  //       Ticket_Qty_Per: ticket_Qty_Per,
  //       STC_Total: stcTotal,
  //       Ticket_Qty_Buy: 0,
  //       Ticket_Qty_Balance: ticket_Qty,
  //       STC_Total_Balance: stcTotal,
  //       Created_By: DEFAULT_ACTIONER,
  //     }];

  //     await Promise.all(zoneDataArray.map(async (data) => {
  //       await createEventStock(data);
  //     }));

  //   } catch (error: any) {
  //     console.error("Error saving event stock:", error);
  //     throw new Error(error?.message || "An error occurred while saving event stock");
  //   }
  // };

  // ส่งข้อมูลไปหา API

  const handleCreate = async () => {
    if (!newPlan.planGroupId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกผังร้าน",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
      return;
    }
    const groupId = parseInt(newPlan.planGroupId, 10);

    if (isDuplicatePlanName(newPlan.name, groupId, plans)) {
      Swal.fire({
        icon: "warning",
        title: "มีโซนที่มีชื่อเดียวกันในกลุ่มนี้แล้ว",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
      return;
    }

    try {
      // Create a new plan by sending the plan data to the API
      const res = await createPlan({
        Plan_Desc: newPlan.desc,
        Plan_Name: newPlan.name,
        Plan_Pic: newPlan.pic || null, // Use null if no image is provided
        Plan_Active: newPlan.active,
        PlanGroup_id: groupId,
        Plan_Ticket_Type_Id: newPlan.selectedTicketType,
        Plan_Ticket_Qty: newPlan.zone,
        Plan_Ticket_Qty_Per: newPlan.seats,
      });

      console.log("Response from createPlan:", res);
      if (typeof res.planId === "number") {
        await handleSaveTicketNumbers(
          groupId,
          res.planId,
          newPlan.selectedTicketType
        );
      }

      Swal.fire({
        icon: "success",
        title: "สร้างโซนสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });

      setNewPlan({
        name: "",
        desc: "",
        pic: "",
        active: "",
        planGroupId: "",
        selectedTicketType: "",
        zone: "",
        seats: "",
      });

      setOpen(false);

      const data = await getAllPlans();
      console.log("eeee", data);
      setPlans(data.plans);
    } catch (error: any) {
      console.error("Error creating plan:", error.message);
      Swal.fire({
        title: "ล้มเหลวในการสร้างโซน",
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

    const groupId = editPlan.PlanGroup_id;

    // Exclude the plan being edited from the duplicate check
    const filteredPlans = plans.filter(
      (plan) => plan.Plan_id !== editPlan.Plan_id
    );

    if (isDuplicatePlanName(editPlan.Plan_Name, groupId, filteredPlans)) {
      Swal.fire({
        title: "มีโซนที่มีชื่อเดียวกันในกลุ่มนี้แล้ว",
        icon: "warning",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
      return;
    }

    try {
      let dataTicket = [];
      inputValues.forEach((value, i) => {
        const obj = {
          Line: i + 1,
          Ticket_No: value,
          Ticket_No_Option: selectTableModal,
        };
        dataTicket.push(obj);
      });

      const payload = {
        Plan_id: editPlan.Plan_id,
        Plan_Desc: editPlan.Plan_Desc,
        Plan_Name: editPlan.Plan_Name,
        Plan_Pic: editPlan.Plan_Pic,
        Plan_Ticket_Type_Id: editPlan.Plan_Ticket_Type_Id,
        Plan_Ticket_Qty: editPlan.Plan_Ticket_Qty,
        Plan_Ticket_Qty_Per: editPlan.Plan_Ticket_Qty_Per,
        Plan_Active: editPlan.Plan_Active,
        PlanGroup_id: groupId,
        dataTicketValue: dataTicket,
      };

      console.log("payload =>", payload);
      await patchPlan(payload);

      Swal.fire({
        icon: "success",
        title: "อัปเดตโซนสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
      handleEditClose();
      const data = await getAllPlans();
      setPlans(data.plans);
    } catch (error: any) {
      console.error("Error updating plan:", error.message);
      Swal.fire({
        icon: "error",
        title: "ล้มเหลวในการอัปเดตโซน",
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

      const eventStocks = await getEventStock();
      const isPlanInUse = eventStocks.some((stock) => stock.Plan_Id === id);

      if (isPlanInUse) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถลบโซนที่ถูกใช้งานอยู่",
          customClass: {
            title: "swal2-title",
            content: "swal2-content",
          },
        });
        return;
      }

      await deletePlan(id);
      Swal.fire({
        icon: "success",
        title: "ลบโซนสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });
      const data = await getAllPlans();
      setPlans(data.plans);
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const filteredPlans = plans.filter((plan) => {
    const nameMatch = plan.Plan_Name?.toLowerCase().includes(
      searchQuery.toLowerCase() || ""
    );

    const groupNameMatch = plan.PlanGroup_Name?.toLowerCase().includes(
      searchQuery.toLowerCase() || ""
    );

    return (
      (statusFilter === "ทั้งหมด" || plan.Plan_Active === statusFilter) &&
      (nameMatch || groupNameMatch) // Match either Plan_Name or PlanGroup_Name
    );
  });

  const currentItems = filteredPlans;
  // console.log("currentItems =>", currentItems);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPlan((prev) => ({
          ...prev,
          pic: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setNewPlan((prev) => ({
      ...prev,
      pic: "",
    }));

    // เคลียร์ input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleEditImageChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];

  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setEditPlan((prev) => ({
  //         ...prev,
  //         Plan_Pic: e.target?.result as string, // Store the base64 string in state
  //       }));
  //     };
  //     reader.readAsDataURL(file); // Read the file as a data URL (base64 string)
  //   }
  // };

  const handleEditImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPlan((prev: any) => ({
          ...prev,
          Plan_Pic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  function Letter() {
    if (ticketNoPerPlan.length !== 0) {
      const firstTicketNo = ticketNoPerPlan[0]?.Ticket_No;
      console.log("firstTicketNo", firstTicketNo);

      if (firstTicketNo) {
        const letterMatch = firstTicketNo.match(/[A-Za-z]+/);

        if (letterMatch && letterMatch[0]) {
          setTetter(letterMatch[0]);
        } else {
          console.warn("No letters found in ticket number.");
          setTetter(null); // or set to a default value if needed
        }
      } else {
        console.warn("firstTicketNo is null or undefined.");
        setTetter(null);
      }
    } else {
      console.warn("ticketNoPerPlan array is empty.");
      setTetter(null);
    }
  }

  useEffect(() => {
    Letter();
  }, [ticketNoPerPlan]);

  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        height: "100vh",
      }}
    >
      <Header title="โซน" />
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
              <MenuItem value="ทั้งหมด" sx={{ fontSize: "16px" }}>
                ทั้งหมด
              </MenuItem>
              <MenuItem value="Y" sx={{ fontSize: "16px" }}>
                เผยแพร่
              </MenuItem>
              <MenuItem value="N" sx={{ fontSize: "16px" }}>
                ไม่เผยแพร่
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            placeholder="ค้นหาชื่อผังร้านและโซน"
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
          + เพิ่มรายการ
        </Button>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "0" }}
          style={{ maxHeight: "85vh", overflowY: "auto", maxWidth: "65vw" }}
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
                    width: "100px",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
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
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
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
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  ชื่อโซน
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "300px",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  คำอธิบาย
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100px",
                    padding: "5px",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#11131A",
                    zIndex: 2,
                  }}
                >
                  รูปภาพ
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
                  สถานะ
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
                  จัดการ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((plan, index) => (
                  <TableRow key={plan.Plan_id}>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.PlanGroup_Name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.Plan_Name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.Plan_Desc}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <img
                          src={plan.Plan_Pic}
                          alt="Plan Image"
                          style={{
                            width: "100px",
                            height: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(plan.Plan_Pic)}
                        />
                      </div>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Switch
                        checked={plan.Plan_Active === "Y"}
                        onChange={() => toggleActiveStatus(plan)}
                        color="primary"
                      />
                      <span>
                        {plan.Plan_Active === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                      </span>
                    </TableCell>
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
                        onClick={() => handleDelete(plan.Plan_id)}
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
        <DialogTitle>สร้างโซนใหม่</DialogTitle>
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
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
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
              "& .MuiOutlinedInput-root": {
                "& input": {
                  border: "none", // Remove the inner border
                  transform: "translateY(5px)",
                },
              },
            }}
          />
          {/* <input
            accept="image/*"
            style={{ display: "block", margin: "dense" }}
            type="file"
            onChange={handleImageChange}
          />
          {newPlan.pic && (
            <img
              src={newPlan.pic}
              alt="Selected"
              style={{
                width: "100px",
                height: "auto",
                cursor: "pointer",
                marginTop: "10px",
              }}
            />
          )} */}
          <TextField
            inputRef={fileInputRef}
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              display: "block",
              margin: "dense",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                borderColor: "grey.300",
                "&:hover": {
                  borderColor: "primary.main",
                },
                "& input": {
                  padding: "12px 12px",
                  textAlign: "center",
                  fontSize: "0.9rem",
                },
              },
            }}
          />
          {newPlan.pic && (
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <Box
                component="img"
                src={newPlan.pic}
                alt="Selected"
                sx={{
                  width: 100,
                  height: "auto",
                  cursor: "pointer",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={handleImageRemove}
                sx={{
                  marginLeft: 2,
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                  },
                }}
              >
                ลบรูปภาพ
              </Button>
            </Box>
          )}
          <br />
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
          {/* TICKET TYPE* */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="demo-simple-select-label">
              เลือกประเภทตั๋ว*
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="TICKET TYPE*"
              value={selectedTicketType}
              onChange={handleTicketTypeChange}
            >
              {ticketTypes?.map((ticket) => (
                <MenuItem key={ticket.id} value={ticket.Ticket_Type_Id}>
                  {ticket.Ticket_Type_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Ticket-amount */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "6px",
            }}
          >
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                    width: "105px",
                    textAlign: "center",
                  },
                },
                marginRight: "10px",
              }}
              id="outlined-controlled"
              label="จำนวนบัตร/โซน*"
              value={zone}
              type="number"
              onChange={handleZoneChange}
            />
            <TextField
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                    width: "105px",
                    textAlign: "center",
                  },
                },
              }}
              id="outlined-uncontrolled"
              label="จำนวนที่นั่ง/บัตร"
              value={seats}
              type="number"
              onChange={handleSeatsChange}
            />
          </Box>
          <FormControl
            sx={{
              marginTop: "10px",
            }}
            fullWidth
            margin="dense"
          >
            <InputLabel id="demo-simple-select-label">
              ระบุเลขโต๊ะ/ที่*
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="ระบุเลขโต๊ะ/ที่*"
              value={selectedTable}
              onChange={handleTableChange}
            >
              <MenuItem value="1">1.คีย์เลขโต๊ะได้เอง</MenuItem>
              <MenuItem value="2">{`2. รันจาก 1 ถึง ${zone ? parseInt(zone, 10) : 0
                }`}</MenuItem>
              <MenuItem value="3">{`3.นำหน้าด้วย ประเภทบัตร ต่อด้วย รันจาก 1 ถึง ${zone ? parseInt(zone, 10) : 0
                } - (ประเภทบัตร 1-${zone ? parseInt(zone, 10) : 0})`}</MenuItem>
              <MenuItem value="4">{`4.ใส่อักษรนำหน้า ต่อด้วย ประเภทบัตร จาก 1 ถึง ${zone ? parseInt(zone, 10) : 0
                }`}</MenuItem>
              <MenuItem value="5">5.ไม่ระบุเลขโต๊ะ</MenuItem>
            </Select>
          </FormControl>
          <GenerateBoxes
            method={selectedTable}
            totalSeats={zone}
            zoneId={1}
            selectedTicketType={selectedTicketTypeName}
            letter={letter || null}
          />
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
          <DialogTitle>แก้ไขโซน</DialogTitle>
          <DialogContent>
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
              name="Plan_Desc"
              label="คำอธิบาย"
              type="text"
              fullWidth
              value={editPlan.Plan_Desc}
              onChange={handleEditChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                  },
                },
              }}
            />
            <Box sx={{ margin: "dense" }}>
              <Typography
                component="label"
                htmlFor="upload-image"
                sx={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                รูปภาพ
              </Typography>
              <TextField
                id="upload-image"
                accept="image/*"
                type="file"
                onChange={handleEditImageChange}
                InputLabelProps={{ shrink: true }}
                sx={{ display: "block", marginBottom: "8px" }}
              />
              {editPlan.Plan_Pic && (
                <Box
                  component="img"
                  src={editPlan.Plan_Pic}
                  alt="Selected"
                  sx={{
                    width: 100,
                    height: "auto",
                    cursor: "pointer",
                    marginTop: 2,
                  }}
                />
              )}
            </Box>
            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label">
                เลือกประเภทตั๋ว*
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="TICKET TYPE*"
                name="Plan_Ticket_Type_Id"
                value={editPlan.Plan_Ticket_Type_Id}
                onChange={handleEditChange}
              >
                {ticketTypes?.map((ticket) => (
                  <MenuItem key={ticket.id} value={ticket.Ticket_Type_Id}>
                    {ticket.Ticket_Type_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                marginTop: "6px",
              }}
            >
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                      width: "105px",
                      textAlign: "center",
                    },
                  },
                  marginRight: "10px",
                }}
                id="outlined-controlled"
                label="จำนวนบัตร/โซน*"
                name="Plan_Ticket_Qty"
                value={editPlan.Plan_Ticket_Qty}
                type="number"
                onChange={handleEditChange}
              />
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                      width: "105px",
                      textAlign: "center",
                    },
                  },
                }}
                id="outlined-uncontrolled"
                label="จำนวนที่นั่ง/บัตร"
                name="Plan_Ticket_Qty_Per"
                value={editPlan.Plan_Ticket_Qty_Per}
                type="number"
                onChange={handleEditChange}
              />
            </Box>
            <FormControl
              sx={{
                marginTop: "10px",
              }}
              fullWidth
              margin="dense"
            >
              <InputLabel id="demo-simple-select-label">
                ระบุเลขโต๊ะ/ที่*
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="ระบุเลขโต๊ะ/ที่*"
                name="selectTableModal"
                value={selectTableModal}
                onChange={handleEditChange}
              >
                <MenuItem value="1">1.คีย์เลขโต๊ะได้เอง</MenuItem>
                <MenuItem value="2">{`2. รันจาก 1 ถึง ${editPlan.Plan_Ticket_Qty
                  ? parseInt(editPlan.Plan_Ticket_Qty, 10)
                  : 0
                  }`}</MenuItem>
                <MenuItem value="3">{`3.นำหน้าด้วย ประเภทบัตร ต่อด้วย รันจาก 1 ถึง ${editPlan.Plan_Ticket_Qty
                  ? parseInt(editPlan.Plan_Ticket_Qty, 10)
                  : 0
                  } - (ประเภทบัตร 1-${editPlan.Plan_Ticket_Qty
                    ? parseInt(editPlan.Plan_Ticket_Qty, 10)
                    : 0
                  })`}</MenuItem>
                <MenuItem value="4">{`4.ใส่อักษรนำหน้า ต่อด้วย ประเภทบัตร จาก 1 ถึง ${editPlan.Plan_Ticket_Qty
                  ? parseInt(editPlan.Plan_Ticket_Qty, 10)
                  : 0
                  }`}</MenuItem>
                <MenuItem value="5">5.ไม่ระบุเลขโต๊ะ</MenuItem>
              </Select>
            </FormControl>
            <GenerateBoxes
              method={selectTableModal ? selectTableModal.toString() : ""} // ตรวจสอบว่า selectTableModal มีค่าอยู่หรือไม่
              totalSeats={editPlan.Plan_Ticket_Qty} // เลขโต๊ะที่โชว์
              zoneId={1} // ID
              selectedTicketType={selectedTicketTypeName} // ประเภทตั๋ว
              letter={letter || null}
            // mode="edit" // โหมดแก้ไข
            // dataEdit={editPlan} // ข้อมูลที่จะแก้ไข
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
            <CircularProgress /> // Show loading spinner
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

export default ZoneContent;
