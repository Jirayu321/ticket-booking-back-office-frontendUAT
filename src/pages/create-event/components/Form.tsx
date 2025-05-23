import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SwalSuccess, SwalConfirmDialog, SwalError } from "../../../lib/sweetalert";
import Header from "../../common/header";
import { useEventStore } from "../form-store";
import "./create-event-form.css";
import BackIcon from "/back.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import SubHeader from "../../edit-event/_components/sub-header/SubHeader";
import { useFetchEventList } from "../../../hooks/fetch-data/useFetchEventList";
import { createEvent } from "../../../services/event-list.service";
import { createEventStock } from "../../../services/event-stock.service";
import { createLogEventPrice } from "../../../services/log-event-price.service";
import {
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Grid,
} from "@mui/material";
import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import { getTicketTypeNameById } from "../../../services/ticket-type.service";

const CreateEventForm = () => {
  const { eventId } = useParams();
  const { data: planGroups } = useFetchPlanGroups();
  const { data: event } = useFetchEventList({
    eventId: null,
  });
  const combinedData = useMemo(() => {
    if (!planGroups?.planGroups || !planGroups?.getAllPlans?.plans) return [];
    return planGroups.planGroups.map((group) => {
      const plansInGroup = planGroups.getAllPlans.plans.filter((plan) => plan.PlanGroup_id === group.PlanGroup_id);
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

  const [priceState, setPriceState] = useState({});
  const [activeTab, setActiveTab] = useState("รายละเอียด");
  const [selectedZoneGroup, setSelectedZoneGroup] = useState("");
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [planGroupId, setPlanGroupId] = useState("");
  const [allRows, setAllRows] = useState({});

  useEffect(() => {
    if (eventId && planGroupId !== "") {
      // console.debug("handleZoneChange");
      handleZoneChange(String(planGroupId));
    }
  }, [eventId, combinedData, planGroupId]);

  const handleInputChange = (setter) => (e) => {
    const { value } = e.target;
    setter(value);
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

  const handleBackClick = () => {
    if (activeTab === "โซน & ราคา") {
      const userConfirmed = window.confirm(
        "ถ้ากลับไปตอนนี้ข้อมูลในหน้านี้จะหายไปทั้งหมด"
      );
      if (userConfirmed) {
        setActiveTab("รายละเอียด");
      }
    } else {
      window.location.replace("/all-events");
    }
  };

  const handleZoneChange = (e) => {
    // เคลียค่า AllRow
    if (!eventId) {
      setAllRows({});
    }

    const selectedValue = typeof e === "string" ? e : e.target.value;

    setSelectedZoneGroup(selectedValue);

    const foundGroup = combinedData.find(
      (group) => group.PlanGroup_id === parseInt(selectedValue)
    );

    if (foundGroup && Array.isArray(foundGroup.plans)) {
      foundGroup.plans.forEach((plan) => {
        if (!eventId) {
          handleAddRow(plan.Plan_id);
        }
      });

      setSelectedGroupData(foundGroup);
    }
  };

  const getRowsForPlan = (planId) => {
    const rows = allRows[planId]?.map((row) => ({
      ...row,
      startDate: row.startDate ? new Date(row.startDate) : createDefaultRow().startDate,
      endDate: row.endDate ? new Date(row.endDate) : createDefaultRow().endDate,
    }));

    return rows && rows.length > 0 ? rows : [createDefaultRow()];
  };

  const createDefaultRow = () => {
    const eventDate = dayjs(eventDateTime); // ใช้วันที่จาก eventDateTime
    const today = dayjs(); // วันที่ปัจจุบัน

    return {
      id: uuidv4(),
      startDate: today.hour(0).minute(1).second(0).millisecond(0).toDate(), // วันปัจจุบันเวลา 00:01
      endDate: eventDate.hour(23).minute(59).second(0).millisecond(0).toDate(), // eventDate เวลา 23:59
      price: 0,
    };
  };

  const handleAddRow = async (planId) => {
    const currentRows = allRows[planId] || [];

    if (currentRows.length >= 3) {
      SwalError("ไม่สามารถเพิ่มแถวเกิน 3 รายการได้");
      return;
    }

    const newRow = createDefaultRow();

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
      const rows = prevRows[planId] || [];
      const updatedRows = rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            [field]: Number(newValue), // เปลี่ยนแค่ราคาที่กรอกใหม่
            // ไม่ต้องตั้งค่า startDate และ endDate ใหม่
          };
        }
        return row;
      });
      return {
        ...prevRows,
        [planId]: updatedRows,
      };
    });
  };

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

      // Table : Event_List
      const eventDate = new Date(eventDateTime).toISOString().split("T")[0];
      const resEventList = await createEvent({
        Event_Name: title.trim(),
        Event_Addr: title2.trim(),
        Event_Desc: description.trim(),
        Event_Date: eventDate,
        Event_Time: eventDateTime,
        Event_Status: 1,
        Event_Public: "N",
        Event_Pic_1: images[0] || null,
        Event_Pic_2: images[1] || null,
        Event_Pic_3: images[2] || null,
        Event_Pic_4: images[3] || null,
      });

      // Table : Event_Stock
      for (const planData of selectedGroupData.plans) {
        const ticketQty = planData.Plan_Ticket_Qty || 0;
        const ticketQtyPer = planData.Plan_Ticket_Qty_Per || 0;
        const stcTotal = ticketQty * ticketQtyPer;
        const eventStockData = {
          Event_Id: resEventList.eventId,
          PlanGroup_Id: selectedGroupData.PlanGroup_id || null,
          Plan_Id: planData.Plan_id || null,
          Ticket_Type_Id: planData.Plan_Ticket_Type_Id || null,
          Ticket_Qty: ticketQty,
          Ticket_Qty_Per: ticketQtyPer,
          STC_Total: stcTotal,
          Ticket_Qty_Buy: 0,
          Ticket_Qty_Balance: ticketQty,
          STC_Total_Balance: stcTotal,
          Created_By: "admin"
        };
        await createEventStock(eventStockData);
      }

      // Table : Log_Event_Price
      for (const planId in filteredData) {
        if (filteredData.hasOwnProperty(planId)) {

          for (const planData of filteredData[planId]) {
            const startDate = planData.startDate;
            const endDate = planData.endDate;
            const price = planData.price;

            await createLogEventPrice({
              Created_By: "admin",
              Created_Date: new Date().toISOString(),
              End_Datetime: new Date(endDate).toISOString(),
              Event_Id: resEventList.eventId,
              PlanGroup_Id: selectedGroupData.PlanGroup_id || null,
              Plan_Id: planId,
              Plan_Price: price,
              Start_Datetime: new Date(startDate).toISOString(),
            });
          }
        }
      }

      if (resEventList.status === 'SUCCESS') {
        SwalSuccess("บันทึกข้อมูลสําเร็จ");
        setTimeout(() => {
          window.location.replace("/all-events");
        }, 1500);
      }
    } catch (error) {
      toast.error("มีข้อผิดพลาดในการบันทึก Event");
    }
  };

  const getTicketTypeLabel = (ticketTypeId) => {
    switch (ticketTypeId) {
      case 33:
        return "สเตชั่น";
      case 41:
        return "ห้อง";
      case 40:
        return "โต๊ะ";
      case 37:
        return "Walk-In";
      default:
        return "ไม่ระบุ";
    }
  };

  return (
    <div className="create-new-event">
      <Header title="งานทั้งหมด" />
      {eventId ? (
        <SubHeader
          eventId={eventId}
          title={title}
          title2={title2}
          description={description}
          eventDateTime={eventDateTime}
          status={status}
          images={images}
          setTitle={setTitle}
          setTitle2={setTitle2}
          setDescription={setDescription}
          setEventDateTime={setEventDateTime}
          setStatus={setStatus}
          setImages={setImages}
          setPlanGroupId={setPlanGroupId}
          allRows={allRows}
          setAllRows={setAllRows}
        />
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
            >
              ยกเลิก
            </button>
            <button className="btn-save" onClick={async () => {
              const isConfirmed = await SwalConfirmDialog(
                "ท่านยืนยันบันทึก Event นี้หรือไม่?"
              );
              if (!isConfirmed) return;
              handleSaveEvent()
            }}> บันทึก </button>
          </div>
        </div>
      )}

      <div style={{ maxHeight: "88vh", overflowY: "auto" }}>
        <form
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
                onFocus={(e) => e.target.select()}
                type="text"
                value={title}
                onChange={handleInputChange(setTitle)}
                placeholder="บรรทัดที่ 1 (เช่น This is my first event)"
              />
            </div>
            <div>
              <label>
                สถานที่:<span style={{ color: "red" }}>*</span>
              </label>
              <input
                onFocus={(e) => e.target.select()}
                type="text"
                value={title2}
                onChange={handleInputChange(setTitle2)}
                className="second-input"
                placeholder="บรรทัดที่ 2 (เช่น at deedclub)"
              />
            </div>
            <div>
              <label>ข้อมูลงาน (ถ้ามี)</label>
              <input
                onFocus={(e) => e.target.select()}
                type="text"
                value={description}
                onChange={handleInputChange(setDescription)}
              />
            </div>
          </div>

          <div className="form-section" style={{ marginLeft: "0px", marginTop: "15px" }}>
            <div>
              <label>เวลาจัดงาน :</label>
              <DatePicker
                dateTimeValue={eventDateTime}
                setter={setEventDateTime}
                label="เวลาจัดงาน"
                allowPast={false}
              />
            </div>
          </div>
          <div className="form-section">
            <label>ภาพประกอบ</label>
            <div className="image-grid">
              {[
                "ภาพปก* ขนาดภาพแบบ2:3",
                "ภาพออกจอ2 ขนาดภาพแบบ2:3",
              ].map((title, index) => (
                <div key={index} className="image-upload-container">
                  <span className="image-upload-title">{title}</span>
                  <div
                    className="image-upload-box"
                    style={{ width: 200, height: 290 }}
                  >
                    {images[index] && (
                      <img src={images[index]} alt={`Upload ${index}`} />
                    )}
                  </div>
                  <div className="upload-link-container">
                    {images[index] ? (
                      <>
                        <label className="image-upload-label">
                          <span className="image-upload-link" hidden={!!eventId}>เปลี่ยนภาพ</span>
                          <input
                            type="file"
                            onChange={handleImageUpload(index)}
                            className="image-upload-input"
                          />
                        </label>
                        <span
                          // hidden={!!eventId}
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
          <form
            // onSubmit={handleCreateEvent}
            style={{ display: "grid", padding: "10px" }}
          >
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
          {selectedGroupData && selectedGroupData.plans.length > 0 && (
            <>
              {selectedGroupData?.plans?.map((plan) => (
                <div key={plan.Plan_id} style={{ background: "darkgray", color: "black" }}>
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
                                <div className="ticket-type" style={{ textAlign: "center" }}>
                                  <label style={{ fontWeight: "bold", margin: "0px" }}>
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
                                    value={getTicketTypeLabel(plan.Plan_Ticket_Type_Id)}
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

                              {!eventId && (
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
                              )}

                            </div>
                          </Box>

                          <div className="price-section">
                            <Grid container spacing={2}>
                              <Grid item xs={6} md={12} sm={12}>
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
                                              dateTimeValue={row.startDate} // Updated prop name
                                              setter={(newDate) =>
                                                handleDateChange(row.id, plan.Plan_id, "startDate", newDate)
                                              }
                                              label="วันที่เริ่มต้น"
                                              allowPast={false}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <DatePicker
                                              dateTimeValue={row.endDate}
                                              setter={(newDate) =>
                                                handleDateChange(row.id, plan.Plan_id, "endDate", newDate)
                                              }
                                              label="วันที่สิ้นสุด"
                                              allowPast={false}
                                            />
                                          </TableCell>

                                          <TableCell style={{ height: "10px" }}>
                                            <TextField
                                              value={row.price}
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
            </>
          )}
        </div>
      </div>

      {/* <ZonePriceForm onSaveEvent={handleSaveEvent} /> */}
    </div>
  );
};

export default CreateEventForm;
