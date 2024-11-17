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
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAllcompany,
  createComp,
  patchComp,
  deleteComp,
} from "../../services/company.service";
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
const AllContent: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planGroups, setPlanGroups] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState({
    Comp_Add1: "",
    Comp_Add2: "",
    Comp_Add3: "",
    Comp_Contact1: "",
    Comp_Contact2: "",
    Comp_Name_EN: "",
    Comp_Name_TH: "",
    Comp_ShortName: "",
    Comp_Post: "",
    Comp_Province: "",
    Comp_TaxNo: "",
    Comp_Tel1: "",
    Comp_Tel2: "",
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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllcompany();
        if (data && data.Comp) {
          setPlans(data.Comp);
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
    setNewPlan({
      Comp_Add1: "",
      Comp_Add2: "",
      Comp_Add3: "",
      Comp_Contact1: "",
      Comp_Contact2: "",
      Comp_Name_EN: "",
      Comp_Name_TH: "",
      Comp_ShortName: "",
      Comp_Post: "",
      Comp_Province: "",
      Comp_TaxNo: "",
      Comp_Tel1: "",
      Comp_Tel2: "",
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
    const planDataMerge = {
      ...plan,
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

  const handleEditChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    Comp_Id: number
  ) => {
    const { name, value } = event.target;
    if (!name) {
      console.error("Event target name is undefined");
      return;
    }

    setEditPlan((prev: any) => ({
      ...prev,
      [name]: value,
      [Comp_Id]: Comp_Id,
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

  //   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchQuery(event.target.value);
  //   };

  //   const handleStatusFilterChange = (
  //     event: React.ChangeEvent<{ value: unknown }>
  //   ) => {
  //     setStatusFilter(event.target.value as string);
  //   };

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

  const handleCreate = async () => {
    // if (!newPlan.planGroupId) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "กรุณาเลือกผังร้าน",
    //     customClass: {
    //       title: "swal2-title",
    //       content: "swal2-content",
    //     },
    //   });
    //   return;
    // }
    // const groupId = parseInt(newPlan.planGroupId, 10);

    // if (isDuplicatePlanName(newPlan.name, groupId, plans)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "มีโซนที่มีชื่อเดียวกันในกลุ่มนี้แล้ว",
    //     customClass: {
    //       title: "swal2-title",
    //       content: "swal2-content",
    //     },
    //   });
    //   return;
    // }

    try {
      const res = await createComp({
        Comp_Add1: newPlan.Comp_Add1,
        Comp_Add2: newPlan.Comp_Add2,
        Comp_Add3: newPlan.Comp_Add3,
        Comp_Contact1: newPlan.Comp_Contact1,
        Comp_Contact2: newPlan.Comp_Contact2,
        Comp_Name_EN: newPlan.Comp_Name_EN,
        Comp_Name_TH: newPlan.Comp_Name_TH,
        Comp_ShortName: newPlan.Comp_ShortName,
        Comp_Post: newPlan.Comp_Post,
        Comp_Province: newPlan.Comp_Province,
        Comp_TaxNo: newPlan.Comp_TaxNo,
        Comp_Tel1: newPlan.Comp_Tel1,
        Comp_Tel2: newPlan.Comp_Tel2,
      });

      console.log("Response from createPlan:", res);
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
      const data = await getAllcompany();
      if (data && data.Comp) {
        setPlans(data.Comp);
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
        Comp_Id: editPlan.Comp_Id,
        Comp_Add1: editPlan.Comp_Add1,
        Comp_Add2: editPlan.Comp_Add2,
        Comp_Add3: editPlan.Comp_Add3,
        Comp_Contact1: editPlan.Comp_Contact1,
        Comp_Contact2: editPlan.Comp_Contact2,
        Comp_Name_EN: editPlan.Comp_Name_EN,
        Comp_Name_TH: editPlan.Comp_Name_TH,
        Comp_ShortName: editPlan.Comp_ShortName,
        Comp_Post: editPlan.Comp_Post,
        Comp_Province: editPlan.Comp_Province,
        Comp_TaxNo: editPlan.Comp_TaxNo,
        Comp_Tel1: editPlan.Comp_Tel1,
        Comp_Tel2: editPlan.Comp_Tel2,
      };

      console.log("payload =>", payload);
      await patchComp(payload);

      Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });

      handleEditClose();
      const data = await getAllcompany();
      setPlans(data.Comp);
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

      await deleteComp(id);
      Swal.fire({
        icon: "success",
        title: "ลบโซนสำเร็จ",
        customClass: {
          title: "swal2-title",
          content: "swal2-content",
        },
      });

      const data = await getAllcompany();
      setPlans(data.Comp);
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

  //   const toggleActiveStatus = async (plan: any) => {
  //     try {
  //       const updatedPlan = {
  //         ...plan,
  //         Plan_Active: plan.Plan_Active === "Y" ? "N" : "Y",
  //       };
  //       await patchPlan(updatedPlan);
  //       Swal.fire({
  //         icon: "success",
  //         title: "อัปเดตสถานะสำเร็จ",
  //       });
  //       const data = await getAllcompany();
  //       setPlans(data.Comp);
  //     } catch (error) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "ล้มเหลวในการอัปเดตสถานะ",
  //       });
  //     }
  //   };

  //   const handleImageClick = (image) => {
  //     setSelectedImage(image);
  //     setModalOpen(true);
  //   };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const filteredPlans = plans;

  const currentItems = filteredPlans;

  //   const filteredPlans = plans.filter((plan) => {
  //     const nameMatch = plan.Plan_Name?.toLowerCase().includes(
  //       searchQuery.toLowerCase() || ""
  //     );

  //     const groupNameMatch = plan.PlanGroup_Name?.toLowerCase().includes(
  //       searchQuery.toLowerCase() || ""
  //     );

  //     return (
  //       (statusFilter === "ทั้งหมด" || plan.Plan_Active === statusFilter) &&
  //       (nameMatch || groupNameMatch) // Match either Plan_Name or PlanGroup_Name
  //     );
  //   });

  //   const currentItems = filteredPlans;
  // console.log("currentItems =>", currentItems);

  //   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.files && event.target.files[0]) {
  //       const file = event.target.files[0];
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         setNewPlan((prev) => ({
  //           ...prev,
  //           pic: e.target?.result as string,
  //         }));
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleImageRemove = () => {
  //     setNewPlan((prev) => ({
  //       ...prev,
  //       pic: "",
  //     }));

  //     // เคลียร์ input file
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //   };

  //   const handleEditImageChange = (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const file = event.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setEditPlan((prev: any) => ({
  //           ...prev,
  //           Plan_Pic: reader.result,
  //         }));
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   function Letter() {
  //     if (ticketNoPerPlan.length !== 0) {
  //       const firstTicketNo = ticketNoPerPlan[0]?.Ticket_No;
  //       console.log("firstTicketNo", firstTicketNo);

  //       if (firstTicketNo) {
  //         const letterMatch = firstTicketNo.match(/[A-Za-z]+/);

  //         if (letterMatch && letterMatch[0]) {
  //           setTetter(letterMatch[0]);
  //         } else {
  //           console.warn("No letters found in ticket number.");
  //           setTetter(null);
  //         }
  //       } else {
  //         console.warn("firstTicketNo is null or undefined.");
  //         setTetter(null);
  //       }
  //     } else {
  //       console.warn("ticketNoPerPlan array is empty.");
  //       setTetter(null);
  //     }
  //   }

  //   useEffect(() => {
  //     Letter();
  //   }, [ticketNoPerPlan]);

  return (
    <div
      style={{
        backgroundColor: "#f7f7f7",
        height: "100vh",
      }}
    >
      <Header title="ตั้งค่าบริษัท" />
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
          style={{ maxHeight: "85vh", overflowY: "auto" }}
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
                  }}
                >
                  ชื่อบริษัทภาษาไทย
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
                  ชื่อบริษัทภาษาอังกฤษ
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
                  ชื่อแบบย่อ
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
                  เลขภาษี
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
                  ที่อยู่ 1
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
                  ที่อยู่ 2
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
                  ที่อยู่ 3
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
                  จังหวัด
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
                  รหัสไปรษณีย์
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
                  เบอร์โทร 1
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
                  เบอร์โทร 2
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
                  ติดต่อ 1
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
                  ติดต่อ 2
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
                  <TableRow key={plan.Comp_Id}>
                    <TableCell sx={{}}>{plan.Comp_Name_TH}</TableCell>
                    <TableCell sx={{}}>{plan.Comp_Name_EN}</TableCell>
                    <TableCell sx={{}}>{plan.Comp_ShortName}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {plan.Comp_TaxNo}
                    </TableCell>{" "}
                    <TableCell sx={{}}>{plan.Comp_Add1}</TableCell>{" "}
                    <TableCell sx={{}}>{plan.Comp_Add2}</TableCell>{" "}
                    <TableCell sx={{}}>{plan.Comp_Add3}</TableCell>{" "}
                    <TableCell sx={{}}>{plan.Comp_Province}</TableCell>{" "}
                    <TableCell sx={{}}>{plan.Comp_Post}</TableCell>{" "}
                    <TableCell sx={{}}>{plan.Comp_Tel1}</TableCell>
                    <TableCell sx={{}}>{plan.Comp_Tel2}</TableCell>
                    <TableCell sx={{}}>{plan.Comp_Contact1}</TableCell>
                    <TableCell sx={{}}>{plan.Comp_Contact2}</TableCell>
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
                        onClick={() => handleDelete(plan.Comp_Id)}
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
        <DialogTitle>สร้างบริษัท</DialogTitle>
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
                name="Comp_Name_TH"
                label="ชื่อบริษัทภาษาไทย"
                type="text"
                fullWidth
                value={newPlan.Comp_Name_TH}
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
                name="Comp_ShortName"
                label="ชื่อแบบย่อ"
                type="text"
                fullWidth
                value={newPlan.Comp_ShortName}
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
                name="Comp_Add1"
                label="ที่อยู่ 1"
                type="text"
                fullWidth
                value={newPlan.Comp_Add1}
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
                name="Comp_Add3"
                label="ที่อยู่ 3"
                type="text"
                fullWidth
                value={newPlan.Comp_Add3}
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
                name="Comp_Post"
                label="รหัสไปรษณีย์"
                type="text"
                fullWidth
                value={newPlan.Comp_Post}
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
                name="Comp_Tel2"
                label="เบอร์โทร 2"
                type="text"
                fullWidth
                value={newPlan.Comp_Tel2}
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
                name="Comp_Contact2"
                label="ติดต่อ 2"
                type="text"
                fullWidth
                value={newPlan.Comp_Contact2}
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
            <Box>
              <TextField
                autoFocus
                margin="dense"
                name="Comp_Name_EN"
                label="ชื่อบริษัทภาษาอังกฤษ"
                type="text"
                fullWidth
                value={newPlan.Comp_Name_EN}
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
                name="Comp_TaxNo"
                label="เลขภาษี"
                type="text"
                fullWidth
                value={newPlan.Comp_TaxNo}
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
                name="Comp_Add2"
                label="ที่อยู่ 2"
                type="text"
                fullWidth
                value={newPlan.Comp_Add2}
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
                name="Comp_Province"
                label="จังหวัด"
                type="text"
                fullWidth
                value={newPlan.Comp_Province}
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
                name="Comp_Tel1"
                label="เบอร์โทร 1"
                type="text"
                fullWidth
                value={newPlan.Comp_Tel1}
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
                name="Comp_Contact1"
                label="ติดต่อ 1"
                type="text"
                fullWidth
                value={newPlan.Comp_Contact1}
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
          <DialogTitle>แก้ไขข้อมูลบริษัท</DialogTitle>
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
                  name="Comp_Name_TH"
                  label="ชื่อบริษัทภาษาไทย"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Name_TH}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_ShortName"
                  label="ชื่อแบบย่อ"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_ShortName}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Add1"
                  label="ที่อยู่ 1"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Add1}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Add3"
                  label="ที่อยู่ 3"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Add3}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Post"
                  label="รหัสไปรษณีย์"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Post}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Tel2"
                  label="เบอร์โทร 2"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Tel2}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Contact2"
                  label="ติดต่อ 2"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Contact2}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
              <Box>
                <TextField
                  autoFocus
                  margin="dense"
                  name="Comp_Name_EN"
                  label="ชื่อบริษัทภาษาอังกฤษ"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Name_EN}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_TaxNo"
                  label="เลขภาษี"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_TaxNo}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Add2"
                  label="ที่อยู่ 2"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Add2}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Province"
                  label="จังหวัด"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Province}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Tel1"
                  label="เบอร์โทร 1"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Tel1}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
                  name="Comp_Contact1"
                  label="ติดต่อ 1"
                  type="text"
                  fullWidth
                  value={editPlan.Comp_Contact1}
                  onChange={(e) => handleEditChange(e, editPlan.Comp_Id)}
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
