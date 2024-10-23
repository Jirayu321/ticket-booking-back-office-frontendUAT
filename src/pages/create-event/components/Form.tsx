import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SwalError, SwalSuccess } from "../../../lib/sweetalert";
import Header from "../../common/header";
import { useEventStore, useZoneStore } from "../form-store";
import "./create-event-form.css";
import { useZonePriceForm } from "./zone-price-form.hooks";
import BackIcon from "/back.svg";
import DeleteIcon from "@mui/icons-material/Delete";
// import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import SubHeader from "../../edit-event/_components/sub-header/SubHeader";
import { useFetchEventList } from "../../../hooks/fetch-data/useFetchEventList";
// import { useZonePriceForm } from "../components/zone-price-form.hooks";

import {
  Button,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  TextField,
  // MenuItem,
  // Select,
  // InputLabel,
  // FormControl,
  IconButton,
  // Switch,
  Table,
  TableBody,
  TableCell,
  // TableContainer,
  TableHead,
  TableRow,
  // Paper,
  // Pagination,
  Box,
  // Modal,
  // Typography,
  // Collapse,
  // CircularProgress,
  // DataGrid,
  Grid,
} from "@mui/material";

import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
const MINIMUM_EVENT_IMAGES = 1;

const CreateEventForm = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  console.log("eventId", eventId);

  const { data: planGroups } = useFetchPlanGroups();
  const { data: event } = useFetchEventList({
    eventId: Number(eventId),
  });
  console.log("event", event);

  // จัดการ combinedData อย่างมีประสิทธิภาพ
  const combinedData = useMemo(() => {
    if (!planGroups?.planGroups || !planGroups?.getAllPlans?.plans) return [];

    return planGroups.planGroups.map((group) => {
      const plansInGroup = planGroups.getAllPlans.plans.filter(
        (plan) => plan.PlanGroup_id === group.PlanGroup_id
      );
      const plansWithTicketNumbers = plansInGroup.map((plan) => {
        const ticketNumbersForPlan =
          planGroups?.ticketNoPerPlans?.ticketNoPerPlans?.filter(
            (ticket) => ticket.Plan_Id === plan.Plan_id
          );
        return { ...plan, ticketNumbers: ticketNumbersForPlan };
      });

      return { ...group, plans: plansWithTicketNumbers };
    });
  }, [planGroups]);

  const uniqueId = uuidv4();

  const {
    title,
    title2,
    description,
    eventDateTime,
    status,
    images,
    setTitle,
    setTitle2,
    setDescription,
    setEventDateTime,
    setStatus,
    setImages,
  } = useEventStore();

  const { setZoneData, removeZonePrice, addZonePrice, zones } = useZoneStore();

  //   const {
  //     handleSaveEventStock,
  //     handleSaveLogEventPrice,
  //     handleSaveTicketNumbers,
  //     handleCreateEvent,
  //     isFormValid,
  //   } = useZonePriceForm();

  const [priceState, setPriceState] = useState({});
  const [activeTab, setActiveTab] = useState("รายละเอียด");
  const [selectedZoneGroup, setSelectedZoneGroup] = useState("");
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [event_name, setevent_name] = useState("");
  const [event_addr, setevent_addr] = useState("");
  const [event_desc, setevent_desc] = useState("");

  const [allRows, setAllRows] = useState({});

  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const handleEndDateChange = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedEndDate(date);
      setEventDateTime(date);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "event_name":
        setevent_name(value.trim() ? value : "");
        break;
      case "event_addr":
        setevent_addr(value.trim() ? value : "");
        break;
      case "event_desc":
        setevent_desc(value.trim() ? value : "");
        break;
      default:
        break;
    }
  };

  const handleImageUpload = (index) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImages(index, base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index) => () => {
    setImages(index, null);
  };

  const handleNext = (e) => {
    e.preventDefault();

    setStatus(1);

    const isDetailCompleted = Boolean(
      title && title2 && eventDateTime && status
    );

    if (!isDetailCompleted) {
      SwalError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const haveImagesBeenUploaded =
      images.filter((image) => image !== null).length >= MINIMUM_EVENT_IMAGES;

    if (!haveImagesBeenUploaded) {
      SwalError(`กรุณาอัปโหลดภาพ event อย่างน้อย ${MINIMUM_EVENT_IMAGES} รูป`);
      return;
    }

    setActiveTab("โซน & ราคา");
  };

  const handleBackClick = () => {
    if (activeTab === "โซน & ราคา") {
      const userConfirmed = window.confirm(
        "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมด"
      );
      if (userConfirmed) {
        setActiveTab("รายละเอียด");
      }
    } else {
      navigate("/all-events");
    }
  };

  const handleZoneChange = (e) => {
    const selectedValue = e.target.value;

    const foundGroup = combinedData.find(
      (group) => group.PlanGroup_id === parseInt(selectedValue)
    );

    if (foundGroup && Array.isArray(foundGroup.plans)) {
      foundGroup.plans.forEach((plan) => {
        handleAddRow(plan.Plan_id);
      });

      setSelectedGroupData(foundGroup);
    } else {
      SwalError("พบข้อผิดพลาด");
    }
  };

  const getRowsForPlan = (planId) => {
    const defaultRow = {
      id: uuidv4(),
      startDate: new Date().setHours(0, 1, 0, 0),
      endDate: new Date().setHours(23, 59, 0, 0),
      price: 0,
    };

    const rows = allRows[planId]?.map((row) => ({
      ...row,
      startDate: row.startDate ? new Date(row.startDate) : null,
      endDate: row.endDate ? new Date(row.endDate) : null,
    }));

    return rows && rows.length > 0 ? rows : [defaultRow];
  };

  const handleAddRow = (planId) => {
    const currentRows = allRows[planId] || [];

    if (currentRows.length >= 3) {
      SwalError("ไม่สามารถเพิ่มแถวเกิน 3 รายการได้");
      return;
    }

    const newRow = {
      id: uuidv4(),
      startDate: new Date().setHours(0, 1, 0, 0),
      endDate: new Date().setHours(23, 59, 0, 0),
      price: 0,
    };

    setAllRows((prevRows) => ({
      ...prevRows,
      [planId]: [...currentRows, newRow],
    }));
  };

  const handleDeleteRow = (rowId, planId) => {
    setAllRows((prevAllRows) => {
      const updatedRows = prevAllRows[planId].filter((row) => row.id !== rowId);

      return {
        ...prevAllRows,
        [planId]: updatedRows,
      };
    });
  };

  const handleDateChange = (rowId, planId, field, newDate) => {
    setAllRows((prevRows) => ({
      ...prevRows,
      [planId]: prevRows[planId].map((row) =>
        row.id === rowId ? { ...row, [field]: newDate } : row
      ),
    }));
  };

  const handlePriceChange = (rowId, planId, field, newValue) => {
    setAllRows((prevRows) => {
      // ตรวจสอบว่ามี array สำหรับ planId หรือไม่ ถ้าไม่มีก็ให้กำหนดเป็น array ว่าง
      const rows = prevRows[planId] || [];

      // ใช้ map กับ rows ที่ตรวจสอบแล้ว
      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, [field]: Number(newValue) } : row
      );

      return {
        ...prevRows,
        [planId]: updatedRows,
      };
    });
  };

  // const handlePicChange = (planId, picUrl) => {
  //   setAllRows((prevAllRows) => ({
  //     ...prevAllRows,
  //     [planId]: {
  //       ...prevAllRows[planId],
  //       pic: picUrl,
  //     },
  //   }));
  // };

  const updateCombinedRows = () => {
    const combined = JSON.parse(JSON.stringify(allRows));

    Object.keys(priceState).forEach((planId) => {
      if (combined[planId]) {
        combined[planId] = combined[planId].map((row) => ({
          ...row,
          price: priceState[planId]?.[row.id] || row.price,
        }));
      }
    });

    return combined;
  };

  const handleSaveEvent = async () => {
    try {
      const combinedDataForSave = updateCombinedRows();
      const filteredData = Object.keys(combinedDataForSave).reduce(
        (acc, planId) => {
          const filteredRows = combinedDataForSave[planId].filter(
            (row) => row.price !== 0
          );
          if (filteredRows.length > 0) {
            acc[planId] = filteredRows;
          }
          return acc;
        },
        {}
      );

      // เตรียมข้อมูลสำหรับบันทึก Table : Event_List
      const eventDate = new Date(eventDateTime).toISOString().split("T")[0];
      const eventTime = new Date(eventDateTime).toTimeString().split(" ")[0];
      const formEventList = {
        event_name: event_name,
        event_addr: event_addr,
        event_desc: event_desc,
        event_date: eventDate,
        event_time: eventTime,
        // event_Pic_1: images[0] || null,
        // event_Pic_2: images[1] || null,
        // event_Pic_3: images[2] || null,
        // event_Pic_4: images[3] || null,
        event_status: status,
      };
      console.debug(formEventList);
      const event_id = await useZonePriceForm(formEventList);
      console.log(event_id);

      // เตรียมข้อมูลสำหรับบันทึก Table : Event_Stock
      //   const formEventStock = {
      //     event_id: null,
      //     plan_group_id: null,
      //     plan_id: null,
      //     ticket_type_id: null,
      //     ticket_qty: null,
      //     ticket_qty_per: null,
      //     stc_total: null,
      //     ticket_qty_buy: null,
      //     ticket_qty_balance: null,
      //     stc_total_balance: null,
      //     created_date: null,
      //     created_by: null,
      //     updated_date: null,
      //     update_by: null,
      //     plan_pic: null,
      //   };
      //   console.debug(formEventStock);

      // เตรียมข้อมูลสำหรับบันทึก Table : Log_Event_Price
      //   const formLogEventPrice = {
      //     plan_group_id: null,
      //     plan_id: null,
      //     plan_price: null,
      //     start_datetime: null,
      //     end_datetime: null,
      //     created_date: null,
      //     created_by: null,
      //     updated_date: null,
      //     update_by: null,
      //     cancel_date: null,
      //     cancel_by: null,
      //     log_id: null,
      //   };
      //   console.debug(formLogEventPrice);
      // [
      //   {
      //     "id": "b2abc776-b829-47e9-bd0b-ed4401d5c8ea",
      //     "startDate": 1729357260000,
      //     "endDate": 1729443540000,
      //     "price": 1
      //   }
      // ]
      // แสดงข้อมูลที่กรองแล้ว
      console.debug(filteredData);

      SwalSuccess("บันทึกอีเว้นท์สำเร็จ");
    } catch (error) {
      console.error("Error while saving event:", error);
      SwalError("มีข้อผิดพลาดในการบันทึก Event");
    }
  };

  const getThaiText = (id) => {
    switch (id) {
      case 33:
        return "โซฟา";
      case 41:
        return "ห้อง";
      case 40:
        return "โต๊ะ";
      case 37:
        return "บัตรเสริม";
      default:
        return "ไม่ระบุ";
    }
  };

  return (
    <div className="create-new-event">
      <Header title="งานทั้งหมด" />
      {eventId ? (
        <SubHeader event={event} />
      ) : (
        <div
          className="sub-header"
          style={{
            display: "grid",
            gridTemplateColumns: "230px auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "65px auto",
              alignItems: "center",
            }}
          >
            <button className="back-button">
              <img src={BackIcon} alt="Back Icon" onClick={handleBackClick} />
            </button>
            <h2 className="title" style={{ margin: 0 }}>
              สร้างงานใหม่
            </h2>
          </div>
          <div className="toggle-container">
            <button
              className="btn-cancel"
              //   onClick={handleCancel}
            >
              ยกเลิก
            </button>
            <button className="btn-save" onClick={handleSaveEvent}>
              บันทึก
            </button>
          </div>
        </div>
      )}

      <div style={{ maxHeight: "88vh", overflowY: "auto" }}>
        <form
          //   onSubmit={handleCreateEvent}
          style={{ display: "grid", padding: "10px" }}
        >
          <h3 style={{ color: "black", marginLeft: "15px" }}>1. ข้อมูลงาน</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto auto",
              color: "black",
            }}
          >
            <div>
              <label>
                ชื่องาน:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="event_name"
                value={event_name}
                onChange={handleInputChange}
                placeholder="บรรทัดที่ 1 (เช่น This is my first event)"
              />
            </div>
            <div>
              <label>
                สถานที่:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="event_addr"
                value={event_addr}
                onChange={handleInputChange}
                placeholder="บรรทัดที่ 2 (เช่น at deedclub)"
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div>
              <label>ข้อมูลงาน (ถ้ามี)</label>
              <input
                type="text"
                name="event_desc"
                value={event_desc}
                onChange={handleInputChange}
                placeholder="คำอธิบาย (เช่น Event description)"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          <div
            className="form-section"
            style={{ marginLeft: "0px", marginTop: "15px" }}
          >
            <div>
              <label>เวลาจัดงาน :</label>
              <DatePicker
                selected={selectedEndDate}
                dateFormat="dd/MM/yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                onChange={handleEndDateChange}
              />
            </div>
          </div>

          <div className="form-section">
            <label>ภาพประกอบ</label>
            <div className="image-grid">
              {[
                "ภาพปก* ขนาดภาพแบบ1:1",
                "ภาพประกอบ 1 (ไม่บังคับ) ขนาดภาพแบบ1:1",
                "ภาพประกอบ 2 (ไม่บังคับ) ขนาดภาพแบบ1:1",
                "ภาพประกอบ 3 (ไม่บังคับ) ขนาดภาพแบบ1:1",
              ].map((title, index) => (
                <div key={index} className="image-upload-container">
                  <span className="image-upload-title">{title}</span>
                  <div
                    className="image-upload-box"
                    style={{ width: 250, height: 210 }}
                  >
                    {images[index] && (
                      <img src={images[index]} alt={`Upload ${index}`} />
                    )}
                  </div>
                  <div className="upload-link-container">
                    {images[index] ? (
                      <>
                        <label className="image-upload-label">
                          <span className="image-upload-link">เปลี่ยนภาพ</span>
                          <input
                            type="file"
                            onChange={handleImageUpload(index)}
                            className="image-upload-input"
                          />
                        </label>
                        <span
                          className="image-remove-button"
                          onClick={handleImageRemove(index)}
                        >
                          ลบ
                        </span>
                      </>
                    ) : (
                      <label className="image-upload-label">
                        <span className="image-upload-link">+ อัปโหลด</span>
                        <input
                          type="file"
                          onChange={handleImageUpload(index)}
                          className="image-upload-input"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
        <div>
          <form style={{ display: "grid", padding: "10px" }}>
            <h3
              style={{
                color: "black",
                marginLeft: "15px",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              2.ราคาบัตร
            </h3>
            <label>เลือก ZONE GROUP</label>
            {combinedData && combinedData.length > 0 && (
              <select
                className="zone-select"
                style={{ width: "285px", height: "45px" }}
                onChange={handleZoneChange}
                value={selectedZoneGroup || ""}
              >
                <option value="">เลือกผังร้าน</option>
                {combinedData?.map((group: any) => {
                  const { PlanGroup_id, PlanGroup_Name } = group;
                  return (
                    <option key={PlanGroup_id} value={PlanGroup_id}>
                      {PlanGroup_Name}
                    </option>
                  );
                })}
              </select>
            )}
          </form>
          {selectedGroupData && (
            <div style={{ color: "black" }}>
              {selectedGroupData?.plans && (
                <div>
                  {selectedGroupData?.plans?.map((plan) => (
                    <div key={plan.Plan_id} style={{ background: "darkgray" }}>
                      <div key={plan.Plan_id} className="zone-section">
                        <div
                          className="zone-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: "bold",
                            fontSize: "20px",
                            height: " 50px",
                            background: "#ffd700",
                            alignItems: "center",
                            paddingLeft: "10px",
                          }}
                        >
                          <span>{plan.Plan_Name}</span>
                        </div>

                        <div className="">
                          <div
                            className="ticket-layout"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "auto auto",
                              justifyContent: "flex-start",
                              alignItems: "self-start",
                              height: "40vh",
                            }}
                          >
                            <div
                              className="empty-image"
                              style={{
                                width: "500px",
                                height: "auto",
                                marginTop: "25px",
                              }}
                            >
                              <a
                                href={plan.Plan_Pic}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={plan.Plan_Pic}
                                  alt="Plan Pic"
                                  style={{ width: "100%", height: "auto" }}
                                />
                              </a>
                            </div>

                            <div
                              className="ticket-details"
                              style={{
                                display: "grid",
                                width: " 100%",
                                padding: "0px",
                                marginLeft: "15px",
                                position: "relative",
                                top: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  paddingTop: 0,
                                  pandding: 0,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    width: "653px",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      gridTemplateColumns: "auto auto auto",
                                      justifyContent: "space-between",
                                      width: "314px",
                                      display: "grid",
                                      height: "65px",
                                      alignItems: "self-start",
                                    }}
                                  >
                                    <div
                                      className="ticket-type"
                                      style={{ textAlign: "center" }}
                                    >
                                      <label
                                        style={{
                                          fontWeight: "bold",
                                          margin: "0px",
                                        }}
                                      >
                                        ประเภทโต๊ะ
                                      </label>
                                      <input
                                        style={{
                                          width: "75%",
                                          margin: "0px",
                                          textAlign: "center",
                                          padding: "10px",
                                          borderRadius: "4px",
                                          border: "1px solid #ccc",
                                          backgroundColor: "white",
                                          color: "black",
                                        }}
                                        value={getThaiText(
                                          plan?.Plan_Ticket_Type_Id
                                        )}
                                        disabled
                                      />
                                    </div>

                                    <div className="ticket-amount-row">
                                      <label
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "0px",
                                        }}
                                      >
                                        จำนวนบัตร
                                      </label>
                                      <input
                                        value={plan.Plan_Ticket_Qty}
                                        placeholder="จำนวนบัตร/โซน*"
                                        style={{
                                          width: "75%",
                                          margin: "0px",
                                          textAlign: "center",
                                          padding: "10px",
                                          borderRadius: "4px",
                                          border: "1px solid #ccc",
                                          backgroundColor: "white",
                                          color: "black",
                                        }}
                                        disabled
                                      />
                                    </div>

                                    <div className="ticket-amount-row">
                                      <label
                                        style={{
                                          fontWeight: "bold",
                                          marginBottom: "0px",
                                        }}
                                      >
                                        จำนวนที่นั่ง
                                      </label>
                                      <input
                                        onFocus={(e) => e.target.select()}
                                        type="number"
                                        placeholder="จำนวนที่นั่ง/ตั๋ว"
                                        style={{
                                          width: "75%",
                                          margin: "0px",
                                          textAlign: "center",
                                          padding: "10px",
                                          borderRadius: "4px",
                                          border: "1px solid #ccc",
                                          backgroundColor: "white",
                                          color: "black",
                                        }}
                                        value={plan.Plan_Ticket_Qty_Per}
                                        disabled
                                      />
                                    </div>
                                  </div>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: "15px",
                                      marginBottom: "15px",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleAddRow(plan.Plan_id)}
                                      style={{
                                        marginBottom: "-20px",
                                        height: 40,
                                      }}
                                    >
                                      + เพิ่มราคาบัตร
                                    </Button>
                                  </Box>
                                </div>
                              </Box>

                              <div className="price-section">
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <Table>
                                      <TableHead>
                                        <TableRow
                                          style={{
                                            background: "black",
                                            color: "cornsilk",
                                          }}
                                        >
                                          <TableCell
                                            style={{
                                              color: "cornsilk",
                                              minWidth: "40px",
                                            }}
                                          >
                                            ลำดับ
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              color: "cornsilk",
                                              whiteSpace: "nowrap",
                                              minWidth: "130px",
                                            }}
                                          >
                                            วันที่เริ่ม
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              color: "cornsilk",
                                              whiteSpace: "nowrap",
                                              minWidth: "130px",
                                            }}
                                          >
                                            วันที่สิ้นสุด
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              color: "cornsilk",
                                              minWidth: "130px",
                                              height: "10px",
                                            }}
                                          >
                                            ราคา
                                          </TableCell>
                                          <TableCell></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      {getRowsForPlan(plan.Plan_id)?.map(
                                        (row, index) => (
                                          <TableBody key={index}>
                                            <TableRow
                                              key={row.id}
                                              style={{
                                                background: "#f0f0f0",
                                              }}
                                            >
                                              <TableCell>{index + 1}</TableCell>
                                              <TableCell>
                                                <DatePicker
                                                  selected={
                                                    row.startDate
                                                      ? new Date(row.startDate)
                                                      : null
                                                  }
                                                  onChange={(newDate) =>
                                                    handleDateChange(
                                                      row.id,
                                                      plan.Plan_id,
                                                      "startDate",
                                                      newDate
                                                    )
                                                  }
                                                  dateFormat="dd/MM/yyyy HH:mm"
                                                  showTimeSelect
                                                  timeFormat="HH:mm"
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <DatePicker
                                                  selected={
                                                    row.endDate
                                                      ? new Date(row.endDate)
                                                      : null
                                                  }
                                                  onChange={(newDate) =>
                                                    handleDateChange(
                                                      row.id,
                                                      plan.Plan_id,
                                                      "endDate",
                                                      newDate
                                                    )
                                                  }
                                                  dateFormat="dd/MM/yyyy HH:mm"
                                                  showTimeSelect
                                                  timeFormat="HH:mm"
                                                />
                                              </TableCell>
                                              <TableCell
                                                style={{ height: "10px" }}
                                              >
                                                <TextField
                                                  type="number"
                                                  style={{
                                                    width: "150px",
                                                    backgroundColor: "white",
                                                    height: "45px",
                                                    padding: "0px 5px",
                                                  }}
                                                  onChange={(e) =>
                                                    handlePriceChange(
                                                      row.id,
                                                      plan.Plan_id,
                                                      "price",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </TableCell>
                                              <TableCell>
                                                {getRowsForPlan(plan.Plan_id)
                                                  .length > 1 && (
                                                  <IconButton
                                                    onClick={() =>
                                                      handleDeleteRow(
                                                        row.id,
                                                        plan.Plan_id
                                                      )
                                                    }
                                                    color="secondary"
                                                  >
                                                    <DeleteIcon />
                                                  </IconButton>
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          </TableBody>
                                        )
                                      )}
                                    </Table>
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* <div className="next-form-section" style={{ marginTop: " 5vh" }}>
          <button className="buttonNext" onClick={handleNext}>
            ถัดไป
          </button>
        </div> */}
      </div>

      {/* <ZonePriceForm onSaveEvent={handleSaveEvent} /> */}
    </div>
  );
};

export default CreateEventForm;
