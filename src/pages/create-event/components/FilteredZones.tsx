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
  Typography,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs from "dayjs";
import React, { FC, useState, useEffect } from "react";
import DateTimePickerComponent from "../../../components/common/date-time-picker";
import ConfirmNumberInput from "../../../components/common/input/date-picker/ConfirmNumberInput";
import DatePicker from "../../../components/common/input/date-picker/DatePicker";
import { useFetchTicketTypes } from "../../../hooks/fetch-data/useFetchTicketTypes";
import { SwalConfirmAction } from "../../../lib/sweetalert";
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

  const [ticketNoPerPlan, setTicketNoPerPlan] = useState<any[]>([]);
  console.log("ticketNoPerPlan", ticketNoPerPlan);
  const [letter, setTetter] = useState<string>("");
  const { data: ticketTypes, isPending: isLoadingTicketTypes } =
    useFetchTicketTypes();
  // console.log("ticketTypes =>", ticketTypes);

  const [expandedZones, setExpandedZones] = useState<{
    [key: number]: boolean;
  }>({});
  // console.log("expandedZones =>", expandedZones);

  const handleExpandZone = (
    zoneId: number,
    zoneName: string,
    ticketNoPlanList: any
  ) => {
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
    
    setTicketNoPerPlan(ticketNoPlanList);
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

  // const handleUpdateTicketQuantity = (planId: number) => {
  //   console.log("planId =>", planId);
  //   handleInputChange(planId, "seatCount", ticketQuantityPerPlan.ticketQty);
  // };

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

  const getThaiText = (id: number) => {
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
        return "";
    }
  };

  console.log("Zones", zones);
  console.log("ticketNoPerPlan", ticketNoPerPlan);

  useEffect(() => {
    if (ticketNoPerPlan && ticketNoPerPlan.length > 0) {
      const firstTicketNo = ticketNoPerPlan[0]?.Ticket_No;
      if (firstTicketNo) {
        const letter = firstTicketNo.match(/[A-Za-z]+/);
        if (letter && letter[0]) {
          setTetter(letter[0]);
        }
      }
    }
  }, [ticketNoPerPlan]);

  if (isLoadingTicketTypes) return <CircularProgress />;

  return (
    <>
      {filteredZones.map((zone) => (
        <div key={zone.Plan_id} className="zone-section">
          <div
            className="zone-header"
            onClick={() =>
              handleExpandZone(
                zone.Plan_id,
                zone.Plan_Name,
                zone.ticketNoPlanList
              )
            }
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
            <div className="">
              <div className="ticket-layout">
                <div className="empty-image">
                  <a
                    href={zone.Plan_Pic}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={zone.Plan_Pic}
                      alt="Plan Pic"
                      style={{ width: "500px", height: "250px" }}
                    />
                  </a>
                </div>
                <div className="ticket-details">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",

                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ display: "flex", width: "100%" }}>
                      <div className="ticket-type">
                        <label
                          style={{ fontWeight: "bold", marginBottom: "7px" }}
                        >
                          TICKET TYPE*
                        </label>

                        <input
                          style={{
                            width: "80%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            color: "black",
                          }}
                          value={getThaiText(zone.Plan_Ticket_Type_Id)}
                          disabled={!!getThaiText(zone.Plan_Ticket_Type_Id)}
                        />
                      </div>
                      <div
                        className="ticket-amount"
                        style={{ flexBasis: "50%", paddingLeft: "10px" }}
                      >
                        <div
                          className="ticket-amount-row"
                          style={{ marginBottom: "15px" }}
                        >
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            จำนวนบัตร/โซน*
                          </label>
                          <ConfirmNumberInput
                            setter={(value) =>
                              handleInputChange(
                                zone.Plan_id,
                                "seatCount",
                                value
                              )
                            }
                            value={zone.Plan_Ticket_Qty}
                            min={0}
                            placeholder="จำนวนบัตร/โซน*"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                            }}
                            disabled={true}
                          />
                        </div>
                        <div className="ticket-amount-row">
                          <label
                            style={{ fontWeight: "bold", marginBottom: "5px" }}
                          >
                            จำนวนที่นั่ง/บัตร
                          </label>
                          <input
                            onFocus={(e) => e.target.select()}
                            type="number"
                            min="0"
                            placeholder="จำนวนที่นั่ง/ตั๋ว"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              backgroundColor: "white",
                              color: "black",
                            }}
                            value={zone.Plan_Ticket_Qty_Per}
                            onChange={(e) =>
                              handleInputChange(
                                zone.Plan_id,
                                "seatPerTicket",
                                Number(e.target.value)
                              )
                            }
                            disabled={!!zone.Plan_Ticket_Qty_Per}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                </div>
              </div>
              {/* ... */}
              <div className="price-section">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    marginBottom: "15px",
                  }}
                >
                  {/* <h3>ราคา ({zones[zone.Plan_id]?.prices?.length || 0})</h3> */}
                  <h3>ราคา</h3>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addZonePrice(zone.Plan_id)}
                  >
                    + เพิ่มราคาบัตร
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <DataGrid
                    rows={zones[zone.Plan_id]?.prices || 0}
                    columns={columns.map((col) => ({
                      ...col,
                      renderCell: (params: GridRenderCellParams) => {
                        if (col.field === "id") {
                          return (
                            <div style={{ color: "black" }}>
                              {params.row.id}
                            </div>
                          );
                        }
                        if (
                          col.field === "startDate" ||
                          col.field === "endDate"
                        ) {
                          return (
                            <DatePicker
                              label=""
                              dateTimeValue={params.value ? params.value : null}
                              setter={(date: string) => {
                                handlePriceChange(
                                  zone.Plan_id,
                                  params.row.id,
                                  col.field,
                                  date ? new Date(date).toISOString() : ""
                                );
                              }}
                            />
                          );
                        }
                        if (col.field === "price") {
                          return (
                            <TextField
                              onFocus={(e) => e.target.select()}
                              type="number"
                              inputProps={{ min: "0" }}
                              value={params.value}
                              onChange={(e) =>
                                handlePriceChange(
                                  zone.Plan_id,
                                  params.row.id,
                                  col.field,
                                  e.target.value
                                )
                              }
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  "& input": {
                                    border: "none",
                                    transform: "translateY(5px)",
                                    backgroundColor: "white",
                                    padding: "13px",
                                  },
                                },
                              }}
                              variant="outlined"
                              fullWidth
                            />
                          );
                        }
                        if (col.field === "delete") {
                          return (
                            <img
                              src={deleteOnIcon}
                              alt="delete-on"
                              style={{ cursor: "pointer" }}
                              onClick={async () => {
                                const isConfirmed = await SwalConfirmAction(
                                  "คุณต้องการลบราคานี้ใช่หรือไม่?"
                                );

                                if (!isConfirmed) return;

                                removeZonePrice(zone.Plan_id, params.row.id);
                              }}
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
                </Box>
              </div>
              <Box>
                <FormControl
                  sx={{
                    marginTop: "10px",
                    width: "500px", // Set your desired width here
                  }}
                  fullWidth
                  margin="dense"
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ color: "black" }}
                  >
                    ระบุเลขโต๊ะ/ที่*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // id="demo-simple-select"
                    label="ระบุเลขโต๊ะ/ที่*"
                    name="selectTableModal"
                    value={zone.ticketNoPlanList?.[0]?.Ticket_No_Option || ""}
                    disabled
                    style={{ color: "black" }}
                  >
                    <MenuItem value="1" style={{ color: "black" }}>
                      1.คีย์เลขโต๊ะได้เอง
                    </MenuItem>
                    <MenuItem
                      value="2"
                      style={{ color: "black" }}
                    >{`2. รันจาก 1 ถึง ${
                      zone.Plan_Ticket_Qty
                        ? parseInt(zone.Plan_Ticket_Qty, 10)
                        : 0
                    }`}</MenuItem>
                    <MenuItem
                      value="3"
                      style={{ color: "black" }}
                    >{`3.นำหน้าด้วย ประเภทบัตร ต่อด้วย รันจาก 1 ถึง ${
                      zone.Plan_Ticket_Qty
                        ? parseInt(zone.Plan_Ticket_Qty, 10)
                        : 0
                    } - (ประเภทบัตร 1-${
                      zone.Plan_Ticket_Qty
                        ? parseInt(zone.Plan_Ticket_Qty, 10)
                        : 0
                    })`}</MenuItem>
                    <MenuItem
                      value="4"
                      style={{ color: "black" }}
                    >{`4.ใส่อักษรนำหน้า ต่อด้วย ประเภทบัตร จาก 1 ถึง ${
                      zone.Plan_Ticket_Qty
                        ? parseInt(zone.Plan_Ticket_Qty, 10)
                        : 0
                    }`}</MenuItem>
                    <MenuItem value="5" style={{ color: "black" }}>
                      5.ไม่ระบุเลขโต๊ะ
                    </MenuItem>
                  </Select>
                </FormControl>

                <GenerateBoxes
                  method={zone.ticketNoPlanList?.[0]?.Ticket_No_Option.toString()}
                  totalSeats={zone.Plan_Ticket_Qty}
                  zoneId={zone.Plan_id}
                  selectedTicketType={getThaiText(zone.Plan_Ticket_Type_Id)}
                  letter={letter || null}
                />
              </Box>
            </div>
          </Collapse>
        </div>
      ))}
    </>
  );
};

export default FilteredZones;
