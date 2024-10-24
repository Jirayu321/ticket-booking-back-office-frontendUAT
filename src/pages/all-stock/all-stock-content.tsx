import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Container,
  Grid,
  Box,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import Header from "../common/header";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddCardIcon from "@mui/icons-material/AddCard";
import {
  selectedColor,
  ColumnColorstock,
  Event_StatusColor1,
  Event_StatusColor13,
  Event_StatusColor2,
  Event_StatusColor3,
  Event_StatusColorUnknown,
} from "../../lib/util";
import { useFetchEventStocktList } from "../../hooks/fetch-data/useFetchEventList";

const getStatusDetails = (status: number) => {
  switch (status) {
    case 1:
      return { label: "รอเริ่มงาน", backgroundColor: `${Event_StatusColor1}` }; // Orange
    case 2:
      return { label: "เริ่มงาน", backgroundColor: `${Event_StatusColor2}` }; // Green
    case 3:
      return { label: "ปิดงาน", backgroundColor: `${Event_StatusColor3}` }; // Blue
    case 13:
      return { label: "ยกเลิก", backgroundColor: `${Event_StatusColor13}` }; // Red
    default:
      return {
        label: "Unknown",
        backgroundColor: { Event_StatusColorUnknown },
      }; // Grey for unknown statuses
  }
};

const getPublicStatusDetails = (status: string) => {
  switch (status) {
    case "Y":
      return { label: "เผยแพร่", backgroundColor: `${Event_StatusColor2}` }; // Green
    case "N":
      return {
        label: "ไม่เผยแพร่",
        backgroundColor: `${Event_StatusColorUnknown}`,
      }; // Red
    default:
      return {
        label: "Unknown",
        backgroundColor: `${Event_StatusColorUnknown}`,
      }; // Grey for unknown statuses
  }
};

const AllStockContent: React.FC = () => {
  const [eventStocks, setEventStocks] = useState<any[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { refetch } = useFetchEventStocktList({ eventId: null });

  useEffect(() => {
    if (eventStocks) {
      console.log("ข้อมูล data เปลี่ยนไป:", eventStocks);
    }
  }, [eventStocks]);

  useEffect(() => {
    if (isFetching) {
      console.log("กำลังดึงข้อมูล...");
    } else if (eventStocks) {
      console.log("ข้อมูลโหลดเสร็จแล้ว");
    }
  }, [isFetching, eventStocks]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setIsFetching(true);
    setEventStocks(null);
    const result = await refetch();
    if (result?.data) {
      setEventStocks(result.data);
      console.log("ข้อมูล data เปลี่ยนไป:", result.data);
    }
    setIsFetching(false);
  };

  const handleClearFilters = () => {
    setFilters((prevFilters) => ({
      search: prevFilters.search !== "" ? prevFilters.search : "",
      eventName: prevFilters.eventName !== "" ? prevFilters.eventName : "",
      eventStatus:
        prevFilters.eventStatus !== "*" ? prevFilters.eventStatus : "*",
      publicStatus:
        prevFilters.publicStatus !== "*" ? prevFilters.publicStatus : "*",
    }));

    localStorage.setItem(
      "filtersStock",
      JSON.stringify({
        search: filters.search !== "" ? filters.search : "",
        eventName: filters.eventName !== "" ? filters.eventName : "",
        eventStatus: filters.eventStatus !== "*" ? filters.eventStatus : "*",
        publicStatus: filters.publicStatus !== "*" ? filters.publicStatus : "*",
      })
    );

    initialize();
  };

  const dataEvent = eventStocks?.dataEvent || {};
  const dataEventStock = eventStocks?.dataEventStock || [];

  const evntDetail = dataEvent.events?.filter(
    (event: any) => event.Event_Public === 'Y'
  ) || [];

  const eventStockData = dataEventStock.sort((a, b) => {
    if (a.Event_Name < b.Event_Name) return -1;
    if (a.Event_Name > b.Event_Name) return 1;
    if (a.Plan_Id < b.Plan_Id) return -1;
    if (a.Plan_Id > b.Plan_Id) return 1;
    return 0;
  });

  const totalTickets = eventStockData.reduce((sum, item) => sum + (item.Ticket_Qty || 0), 0);
  const totalTicketsBuy = eventStockData.reduce((sum, item) => sum + (item.Ticket_Qty_Buy || 0), 0);
  const totalTicketsBalance = eventStockData.reduce((sum, item) => sum + (item.Ticket_Qty_Balance || 0), 0);

  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("filtersStock");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
        search: "",
        eventName: "",
        eventStatus: "*",
        publicStatus: "*",
      };
  });

  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;

    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [name as string]: value,
      };

      localStorage.setItem("filtersStock", JSON.stringify(updatedFilters));

      return updatedFilters;
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        search: event.target.value,
      };

      localStorage.setItem("filtersStock", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  };

  const filteredStocks = eventStockData.filter((stock) => {
    const matchesSearch =
      (stock.Event_Name || "").toLowerCase().includes(filters.search) ||
      (stock.Plan_Name || "").toLowerCase().includes(filters.search);

    const matchesEventStatus =
      filters.eventStatus === "*" ||
      (filters.eventStatus === "1" && stock.Event_Status === 1) ||
      (filters.eventStatus === "2" && stock.Event_Status === 2) ||
      (filters.eventStatus === "3" && stock.Event_Status === 3) ||
      (filters.eventStatus === "13" && stock.Event_Status === 13);

    const matchesPublicStatus =
      filters.publicStatus === "*" ||
      (filters.publicStatus === "Y" && stock.Event_Public === "Y") ||
      (filters.publicStatus === "N" && stock.Event_Public === "N");

    const matchesEvent =
      filters.eventName === "" ||
      (filters.eventName &&
        stock.Event_Name &&
        stock.Event_Name.toLowerCase().includes(
          filters.eventName.toLowerCase()
        ));

    return (
      matchesSearch && matchesEventStatus && matchesPublicStatus && matchesEvent
    );
  });

  const TotalTickets = filteredStocks.reduce(
    (sum, order) => sum + order.Ticket_Qty,
    0
  );

  const TotalTicketsBuy = filteredStocks.reduce(
    (sum, order) => sum + order.Ticket_Qty_Balance,
    0
  );

  const TotalTicketsBalance = filteredStocks.reduce(
    (sum, order) => sum + order.Ticket_Qty_Buy,
    0
  );

  const numberFormatter = new Intl.NumberFormat("en-US");

  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const handleOrderClick = (orderNo: any) => {
    setSelectedOrderNo(orderNo);
  };

  return (
    <div
      className="all-orders-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="สต๊อกทั้งหมด" />
      <Container maxWidth={false} sx={{ padding: 1, marginTop: "5px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <AddCardIcon
                sx={{
                  fontSize: 70,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>บัตรทั้งหมด</Typography>
                  {filters.eventName === "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {numberFormatter.format(totalTickets)}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {numberFormatter.format(TotalTickets)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <Avatar
                src="/not-pay.svg"
                alt="บัตรคงเหลือทั้งหมด"
                className="filter-icon"
                sx={{ width: 70, height: 70 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>
                    บัตรคงเหลือทั้งหมด
                  </Typography>
                  {filters.eventName === "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {numberFormatter.format(totalTicketsBuy)}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {numberFormatter.format(TotalTicketsBuy)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(207, 183, 11, 0.1)",
                color: "black",
                padding: "15px",
                borderRadius: "4px",
                borderColor: "#CFB70B",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                fontSize: "18px",
                boxSizing: "border-box",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <InventoryIcon style={{ fontSize: 70 }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>
                    บัตรที่ขายไปแล้ว
                  </Typography>
                  {filters.eventName === "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {numberFormatter.format(totalTicketsBalance)}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {numberFormatter.format(TotalTicketsBalance)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <div
        style={{
          backgroundColor: "#f7f7f7",
        }}
      >
        <Container maxWidth={false} sx={{ padding: 1, marginTop: "5px" }}>
          <Stack direction="row" spacing={2}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 150, backgroundColor: "white" }}
            >
              <InputLabel>ชื่องาน</InputLabel>
              <Select
                label="ชื่องาน"
                name="eventName"
                value={filters.eventName}
                onChange={handleFilterChange}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {evntDetail?.map((item, index) => (
                  <MenuItem key={index + 1} value={item.Event_Name}>
                    {item.Event_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              label="ค้นหา"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="ค้นหาโดย ชื่องาน หรือ ชื่อโซน"
              style={{ marginRight: "10px", width: "300px" }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none", // Remove the inner border
                    transform: "translateY(5px)",
                    height: 30,
                    width: 200,
                  },
                },
              }}
              style={{ height: 30 }}
            />

            <FormControl
              variant="outlined"
              style={{ minWidth: 150, backgroundColor: "white" }}
            >
              <InputLabel>สถานะ Event</InputLabel>
              <Select
                label="สถานะ Event"
                name="eventStatus"
                value={filters.eventStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="*">ทั้งหมด</MenuItem>
                <MenuItem value="1">รอเริ่มงาน</MenuItem>
                <MenuItem value="2">เริ่มงาน</MenuItem>
                <MenuItem value="3">ปิดงาน</MenuItem>
                <MenuItem value="13">ยกเลิก</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              style={{ minWidth: 150, backgroundColor: "white" }}
            >
              <InputLabel>สถานะเผยแพร่</InputLabel>
              <Select
                label="สถานะเผยแพร่"
                name="publicStatus"
                value={filters.publicStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="*">ทั้งหมด</MenuItem>
                <MenuItem value="Y">เผยแพร่</MenuItem>
                <MenuItem value="N">ไม่เผยแพร่</MenuItem>
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearFilters}
                sx={{
                  backgroundColor: "#CFB70B",
                  width: "160px",
                  height: "45px",
                  color: "black",
                  fontSize: "15px",
                  "&:hover": {
                    backgroundColor: "#CFB70B",
                  },
                  flexShrink: 0,
                }}
              >
                ค้นหา
              </Button>

              {filteredStocks?.length === 0 ? (
                <p style={{ color: "red", marginLeft: 10 }}>
                  ผลการค้นหา 0 รายการ
                </p>
              ) : (
                <p style={{}}></p>
              )}
            </Box>
          </Stack>
        </Container>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "0",
          maxHeight: "100vh",
          overflowY: "auto",
          display: "grid",
          minWidth: "800px",
          maxWidth: "1500px",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
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
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                  minWidth: "170px",
                }}
              >
                ชื่องาน
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
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
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                  minWidth: "115px",
                }}
              >
                ขายไป / ทั้งหมด (โต๊ะ)
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                  minWidth: "115px",
                }}
              >
                จำนวนบัตรคงเหลือ
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ประเภทบัตร
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                  minWidth: "115px",
                }}
              >
                ที่นั่ง/โต๊ะ
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ที่นั่งคงเหลือ
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                สถานะ Event
              </TableCell>

              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                สถานะเผยแพร่
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStocks.map((stock, index) => {
              const { label, backgroundColor } = getStatusDetails(
                stock.Event_Status
              );
              const { label: publicLabel, backgroundColor: publicBgColor } =
                getPublicStatusDetails(stock.Event_Public);

              return (
                <TableRow
                  key={stock.Event_STC_Id}
                  style={{
                    backgroundColor:
                      selectedOrderNo === stock.Event_STC_Id
                        ? `${selectedColor}`
                        : "inherit",
                    cursor: "pointer",
                    height: 50,
                  }}
                  onClick={() => handleOrderClick(stock.Event_STC_Id)}
                >
                  <TableCell
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {index + 1}
                  </TableCell>

                  <TableCell style={{ textAlign: "left" }}>
                    {stock.Event_Name}
                  </TableCell>

                  <TableCell
                    style={{
                      textAlign: "center",
                      backgroundColor:
                        selectedOrderNo === stock.Event_STC_Id
                          ? `${selectedColor}`
                          : `${ColumnColorstock}`,
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    {stock.Plan_Name}
                  </TableCell>

                  <TableCell
                    style={{
                      textAlign: "center",
                      backgroundColor:
                        selectedOrderNo === stock.Event_STC_Id
                          ? `${selectedColor}`
                          : `${ColumnColorstock}`,

                      fontWeight: "bold",
                    }}
                  >
                    {stock.Ticket_Qty_Buy} / {stock.Ticket_Qty}
                  </TableCell>

                  <TableCell
                    style={{
                      textAlign: "center",
                      backgroundColor:
                        selectedOrderNo === stock.Event_STC_Id
                          ? `${selectedColor}`
                          : `${ColumnColorstock}`,
                    }}
                  >
                    {stock.Ticket_Qty_Balance === 0 ? (
                      <p
                        style={{
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        sold
                      </p>
                    ) : (
                      <p style={{ fontWeight: "bold" }}>
                        {stock.Ticket_Qty_Balance}
                      </p>
                    )}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Type_Name}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Qty_Per}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {stock.STC_Total_Balance === 0 ? (
                      <p
                        style={{
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        sold
                      </p>
                    ) : (
                      <p>{stock.STC_Total_Balance}</p>
                    )}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        color: "white",
                        backgroundColor: backgroundColor,
                        padding: "4px",
                        borderRadius: "4px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </div>
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        color: "white",
                        backgroundColor: publicBgColor,
                        padding: "4px",
                        borderRadius: "4px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {publicLabel}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllStockContent;
