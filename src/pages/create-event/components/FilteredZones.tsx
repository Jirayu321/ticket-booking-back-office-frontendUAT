import { Button, CircularProgress, Collapse } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { FC, useState } from "react";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { Price, ZoneData } from "../../edit-event/type";
import { useZoneStore } from "../form-store";
import GenerateBoxes from "./generate-boxes";
import deleteOnIcon from "/delete-on.svg";

type FilteredZonesProps = {
  filteredZones: any[];
};

const FilteredZones: FC<FilteredZonesProps> = ({ filteredZones }) => {
  const { setZoneData, removeZonePrice, addZonePrice, zones } = useZoneStore();

  const [ticketQuantityPerPlan, setTicketQuantityPerPlan] = useState<{
    zone: any | null;
    ticketQty: number;
  }>({
    zone: null,
    ticketQty: 0,
  });

  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();

  const [expandedZones, setExpandedZones] = useState<{
    [key: number]: boolean;
  }>({});

  const handleExpandZone = (zoneId: number, zoneName: string) => {
    setExpandedZones((prev) => ({
      ...prev,
      [zoneId]: !prev[zoneId],
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

  const handleInputChange = (
    zoneId: number,
    field: keyof ZoneData,
    value: any
  ) => {
    setZoneData(zoneId, { [field]: value });
  };

  const handleUpdateTicketQuantity = (planId: number) => {
    handleInputChange(planId, "seatCount", ticketQuantityPerPlan.ticketQty);
  };

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
          onFocus={(e) => e.target.select()}
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

  if (isLoadingTicketTypes) return <CircularProgress />;

  return (
    <>
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
                  <a href={zone.Plan_Pic} target="_blank" rel="noopener noreferrer">
                    <img src={zone.Plan_Pic} alt="Plan Pic" style={{ width: '100%', height: 'auto' }} />
                  </a>
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
                      <option value="">เลือกประเภทตั๋ว</option>
                      {ticketTypes?.map((type: any) => (
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
                        onFocus={(e) => e.target.select()}
                        type="number"
                        min="0"
                        placeholder="จำนวนบัตร/โซน*"
                        style={{ backgroundColor: "white", color: "black" }}
                        value={ticketQuantityPerPlan.ticketQty || 0}
                        onChange={(e) => {
                          setTicketQuantityPerPlan({
                            zone,
                            ticketQty: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <div className="ticket-amount-row">
                      <label>จำนวนที่นั่ง/บัตร</label>
                      <input
                        onFocus={(e) => e.target.select()}
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
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => handleUpdateTicketQuantity(zone.Plan_id)}
                    sx={{
                      height: 45,
                      marginTop: 2,
                      width: 150,
                      marginX: "auto",
                    }}
                  >
                    <p>ยืนยันจำนวนโต๊ะ</p>
                  </Button>
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
                                params.value ? dayjs(params.value) : dayjs(null)
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
                              onFocus={(e) => e.target.select()}
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
                  value={zones[zone.Plan_id]?.tableInputMethod || ""}
                  onChange={(e) =>
                    handleInputChange(
                      zone.Plan_id,
                      "tableInputMethod",
                      e.target.value
                    )
                  }
                  className="table-input-method-select"
                >
                  <option value="">เลือกรูปแบบการระบุ</option>
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
                  totalSeats={zones[zone.Plan_id]?.seatCount || 0}
                  zoneId={zone.Plan_id}
                />
              </div>
            </div>
          </Collapse>
        </div>
      ))}
      )
    </>
  );
};

export default FilteredZones;
