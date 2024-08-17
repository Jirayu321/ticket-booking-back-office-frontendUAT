import { CircularProgress } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import { useFetchPlanGroups } from "../../../hooks/fetch-data/useFetchPlanGroups";
import { getAllPlans } from "../../../services/plan.service";
import { getAllTicketTypes } from "../../../services/ticket-type.service";
import { useZoneStore } from "../form-store"; // Import Zustand store
import GenerateBoxes from "./generate-boxes";
import "./zone-price-form.css";
import { useZonePriceForm } from "./zone-price-form.hooks";
import deleteOnIcon from "/delete-on.svg";

const ZonePriceForm = () => {
  const {
    selectedZoneGroup,
    setSelectedZoneGroup,
    zones,
    setZoneData,
    addZonePrice,
    removeZonePrice,
  } = useZoneStore();

  const { handleCreateEvent, handleSaveEventStock, handleSaveLogEventPrice } =
    useZonePriceForm();

  const { data: planGroups, isPending: isLoadingPlanGroups } =
    useFetchPlanGroups();

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [filteredZones, setFilteredZones] = useState<ViewPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedZones, setExpandedZones] = useState<{
    [key: number]: boolean;
  }>({});

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ลำดับ",
      width: 120,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: "startDate",
      headerName: "วันเริ่ม",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <div className="form-section form-section-inline">
          <DateTimePickerComponent
            controlledValue={params.value ? dayjs(params.value) : null}
            onChange={(date) =>
              handlePriceChange(
                params.row.id,
                "startDate",
                date ? date.toISOString() : ""
              )
            }
            label="Select Start Date & Time"
          />
        </div>
      ),
    },
    {
      field: "endDate",
      headerName: "วันที่สิ้นสุด",
      width: 280,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <div className="form-section form-section-inline">
          <DateTimePickerComponent
            controlledValue={params.value ? dayjs(params.value) : null}
            onChange={(date) =>
              handlePriceChange(
                params.row.id,
                "endDate",
                date ? date.toISOString() : ""
              )
            }
            label="Select End Date & Time"
          />
        </div>
      ),
    },
    {
      field: "price",
      headerName: "ราคา",
      width: 200,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="number"
          min="0"
          value={params.value}
          onChange={(e) =>
            handlePriceChange(params.row.id, "price", e.target.value)
          }
          style={{ width: "90%", color: "black", backgroundColor: "white" }}
        />
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <img
          src={deleteOnIcon}
          alt="delete-on"
          style={{ cursor: "pointer" }}
          onClick={() => removeZonePrice(params.row.id)}
        />
      ),
    },
  ];

  const handlePlanGroupChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPlanGroupId = parseInt(event.target.value);

    setSelectedZoneGroup(newPlanGroupId);

    forceRefreshFilteredZones(newPlanGroupId);

    setZoneData(newPlanGroupId, { ticketType: "1" }); // Set default ticket type
  };

  const forceRefreshFilteredZones = async (groupId: number) => {
    try {
      const fetchedViewPlans = (await getAllPlans()).plans;
      const newFilteredZones = fetchedViewPlans.filter(
        (plan: any) => plan.PlanGroup_id === groupId
      );
      setFilteredZones(newFilteredZones);
    } catch (error) {
      console.error("Error refreshing filtered zones:", error);
      setError("Failed to refresh zones. Please try again later.");
    }
  };

  const handleExpandZone = (zoneId: number, zoneName: string) => {
    setExpandedZones((prev) => ({
      ...prev,
      [zoneId]: !prev[zoneId], // Toggle the state of the clicked zone
    }));

    if (!zones[zoneId]) {
      setZoneData(zoneId, {
        ticketType: "",
        seatCount: 0,
        seatPerTicket: 0,
        prices: [],
        tableInputMethod: "1",
      });
    }
    setZoneData(zoneId, { zoneName });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTicketTypes = (await getAllTicketTypes()).ticketTypes;
        const fetchedViewPlans = (await getAllPlans()).plans;

        if (!Array.isArray(fetchedViewPlans)) {
          throw new Error("Expected an array but received something else");
        }

        setTicketTypes(fetchedTicketTypes);

        const planGroupMap = new Map();
        fetchedViewPlans.forEach((plan) => {
          const { PlanGroup_Id, PlanGroup_Name } = plan;
          if (plan.plangroup_id && !planGroupMap.has(PlanGroup_Id)) {
            planGroupMap.set(PlanGroup_Id, {
              plangroup_id: PlanGroup_Id,
              plangroup_name: PlanGroup_Name,
            });
          }
        });

        const derivedPlanGroups = Array.from(planGroupMap.values());

        if (derivedPlanGroups.length > 0) {
          const firstGroupId = derivedPlanGroups[0].plangroup_id;
          if (firstGroupId !== undefined) {
            setSelectedZoneGroup(firstGroupId);
            const initialFilteredZones = fetchedViewPlans.filter(
              (plan) => plan.plangroup_id === firstGroupId
            );
            setFilteredZones(initialFilteredZones);
          } else {
            console.error("First plan group does not have a plangroup_id");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    zoneId: number,
    field: keyof ZoneData,
    value: any
  ) => {
    setZoneData(zoneId, { [field]: value });
  };

  const handlePriceChange = (
    zoneId: number,
    priceId: number,
    field: keyof Price,
    value: any
  ) => {
    const zone = zones[zoneId];
    if (zone) {
      const updatedPrices = zone.prices.map((price) =>
        price.id === priceId ? { ...price, [field]: value } : price
      );
      setZoneData(zoneId, { prices: updatedPrices });
    }
  };

  async function handleSaveEvent() {
    try {
      toast.loading("กำลังบันทึกข้อมูล Event");

      const eventId = await handleCreateEvent();

      if (!eventId) {
        toast.dismiss();
        toast.error("ไม่สามารถสร้าง Event ได้");
        return;
      }

      await handleSaveEventStock(eventId);
      
      await handleSaveLogEventPrice(eventId);
      // บันทึก ticket number
      toast.dismiss();
      toast.success("บันทึกข้อมูล Event สำเร็จ");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }

  if (isLoadingPlanGroups) return <CircularProgress />;

  return (
    <div className="zone-price-form-container">
      {error && <div className="error-message">{error}</div>}
      <div style={{ paddingTop: "30px" }} className="form-section">
        <div className="zone-select-container">
          <label>เลือก ZONE GROUP</label>
          <select
            className="zone-select"
            onChange={handlePlanGroupChange}
            value={selectedZoneGroup || ""}
          >
            {planGroups.map((group: any) => {
              const { PlanGroup_id, PlanGroup_Name } = group;
              return (
                <option key={PlanGroup_id} value={PlanGroup_id}>
                  {PlanGroup_Name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {filteredZones.map((zone) => (
        <div key={zone.Plan_id} className="zone-section">
          <div
            className="zone-header"
            onClick={() => handleExpandZone(zone.Plan_id, zone.Plan_Name)}
          >
            <span>
              {zone.Plan_id}. {zone.Plan_Name}
            </span>
            <span>{zone.Plan_Desc}</span>
          </div>
          <Collapse
            in={expandedZones[zone.Plan_id]}
            timeout="auto"
            unmountOnExit
          >
            <div className="zone-content">
              <div className="ticket-layout">
                <div className="empty-image">
                  <span>Image Placeholder</span>
                </div>
                <div className="ticket-details">
                  <div className="ticket-type">
                    <label>TICKET TYPE*</label>
                    <select
                      className="ticket-type-select"
                      value={zones[zone.Plan_id]?.ticketType || ""}
                      onChange={(e) =>
                        handleInputChange(
                          zone.Plan_id,
                          "ticketType",
                          e.target.value
                        )
                      }
                    >
                      {ticketTypes.map((type) => (
                        <option
                          key={type.Ticket_Type_Id}
                          value={type.Ticket_Type_Id}
                        >
                          {type.Ticket_Type_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ticket-amount">
                    <div className="ticket-amount-row">
                      <label>จำนวนบัตร/โซน*</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="จำนวนบัตร/โซน*"
                        style={{ backgroundColor: "white", color: "black" }}
                        value={zones[zone.Plan_id]?.seatCount || 0}
                        onChange={(e) =>
                          handleInputChange(
                            zone.Plan_id,
                            "seatCount",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="ticket-amount-row">
                      <label>จำนวนที่นั่ง/บัตร</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="จำนวนที่นั่ง/ตั๋ว"
                        style={{ backgroundColor: "white", color: "black" }}
                        value={zones[zone.Plan_id]?.seatPerTicket || 0}
                        onChange={(e) =>
                          handleInputChange(
                            zone.Plan_id,
                            "seatPerTicket",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="price-section">
                <h3>ราคา ({zones[zone.Plan_id]?.prices?.length || 0})</h3>
                <div style={{ height: "auto", width: "100%" }}>
                  <DataGrid
                    rows={zones[zone.Plan_id]?.prices || []}
                    columns={columns.map((col) => ({
                      ...col,
                      renderCell: (params: GridRenderCellParams) => {
                        if (
                          col.field === "startDate" ||
                          col.field === "endDate"
                        ) {
                          return (
                            <DateTimePickerComponent
                              controlledValue={
                                params.value ? dayjs(params.value) : null
                              }
                              onChange={(date) =>
                                handlePriceChange(
                                  zone.Plan_id,
                                  params.row.id,
                                  col.field,
                                  date ? date.toISOString() : ""
                                )
                              }
                              label={col.headerName}
                            />
                          );
                        }
                        if (col.field === "price") {
                          return (
                            <input
                              type="number"
                              min="0"
                              value={params.value}
                              onChange={(e) =>
                                handlePriceChange(
                                  zone.Plan_id,
                                  params.row.id,
                                  col.field,
                                  e.target.value
                                )
                              }
                              style={{
                                width: "90%",
                                color: "black",
                                backgroundColor: "white",
                              }}
                            />
                          );
                        }
                        if (col.field === "delete") {
                          return (
                            <img
                              src={deleteOnIcon}
                              alt="delete-on"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                removeZonePrice(zone.Plan_id, params.row.id)
                              }
                            />
                          );
                        }
                        return null;
                      },
                    }))}
                    pageSize={zones[zone.Plan_id]?.prices?.length || 0}
                    autoHeight
                    disableSelectionOnClick
                    hideFooterPagination
                  />
                </div>

                <button
                  type="button"
                  className="add-price"
                  onClick={() => addZonePrice(zone.Plan_id)}
                >
                  + เพิ่มราคาบัตร
                </button>
              </div>
              <div className="table-input-method-section">
                <label style={{ color: "black" }}>ระบุเลขโต๊ะ/ที่*</label>
                <select
                  value={zones[zone.Plan_id]?.tableInputMethod || "1"}
                  onChange={(e) =>
                    handleInputChange(
                      zone.Plan_id,
                      "tableInputMethod",
                      e.target.value
                    )
                  }
                  className="table-input-method-select"
                >
                  <option value="1">1.คีย์เลขโต๊ะได้เอง</option>
                  <option value="2">
                    2.รันจาก 1 ถึง {zones[zone.Plan_id]?.seatCount || 0}
                  </option>
                  <option value="3">
                    3.นำหน้าด้วย โต๊ะ ต่อด้วย รันจาก 1 ถึง{" "}
                    {zones[zone.Plan_id]?.seatCount || 0} - (โต๊ะ 1- โต๊ะ{" "}
                    {zones[zone.Plan_id]?.seatCount || 0})
                  </option>
                  <option value="4">
                    4.ใส่อักษรนำหน้า ต่อด้วย รันจาก 1 ถึง{" "}
                    {zones[zone.Plan_id]?.seatCount || 0} ([?] 1- [?]{" "}
                    {zones[zone.Plan_id]?.seatCount || 0})
                  </option>
                  <option value="5">5.ไม่ระบุเลขโต๊ะ</option>
                </select>
                <GenerateBoxes
                  method={zones[zone.Plan_id]?.tableInputMethod || "1"}
                  seatNumber={zones[zone.Plan_id]?.seatCount || 0}
                  zoneId={zone.Plan_id}
                />
              </div>
            </div>
          </Collapse>
        </div>
      ))}
      <div className="save-form-section">
        <button className="buttonSave" onClick={handleSaveEvent}>
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default ZonePriceForm;
