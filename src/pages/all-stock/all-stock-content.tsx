import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
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
import { getEventStock } from "../../services/event-stock.service"; // Import the correct service
import toast from "react-hot-toast";
import Header from "../common/header"; // Assuming you have a Header component
import InventoryIcon from "@mui/icons-material/Inventory";
import AddCardIcon from "@mui/icons-material/AddCard";
import { getAllEventList } from "../../services/event-list.service";
const MAX_ITEMS_PER_PAGE = 50;

// Map event statuses to text and style properties
const getStatusDetails = (status: number) => {
  switch (status) {
    case 1:
      return { label: "รอเริ่มงาน", backgroundColor: "#FFA500" }; // Orange
    case 2:
      return { label: "เริ่มงาน", backgroundColor: "#4CAF50" }; // Green
    case 3:
      return { label: "ปิดงาน", backgroundColor: "#2196F3" }; // Blue
    case 13:
      return { label: "ยกเลิก", backgroundColor: "#F44336" }; // Red
    default:
      return { label: "Unknown", backgroundColor: "#9E9E9E" }; // Grey for unknown statuses
  }
};

// Map event public status to text and style properties
const getPublicStatusDetails = (status: string) => {
  switch (status) {
    case "Y":
      return { label: "เผยแพร่", backgroundColor: "#4CAF50" }; // Green
    case "N":
      return { label: "ไม่เผยแพร่", backgroundColor: "#F44336" }; // Red
    default:
      return { label: "Unknown", backgroundColor: "#9E9E9E" }; // Grey for unknown statuses
  }
};

const AllStockContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventStockData, setEventStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    search: "",
    eventName: "",
    eventStatus: "*",
    publicStatus: "*",
  });
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [totalTicketsBuy, setTotalTicketsBuy] = useState<number>(0);
  const [totalTicketsBalance, setTotalTicketsBalance] = useState<number>(0);
  const [evntDetail, setEvntDetail] = useState<any[]>([]);

  async function fetchEventStockData() {
    try {
      const data = await getEventStock();
      const evntDetailAll = await getAllEventList();
      console.log("data:", data);

      setEvntDetail(
        evntDetailAll?.events.filter((event: any) => event.Event_Public === "Y")
      );
      if (data && Array.isArray(data)) {
        const dataWithEventName = data;

        // จัดเรียงข้อมูลตาม Event_name และ Plan_Id
        dataWithEventName.sort((a, b) => {
          if (a.Event_Name < b.Event_Name) return -1;
          if (a.Event_Name > b.Event_Name) return 1;
          if (a.Plan_Id < b.Plan_Id) return -1;
          if (a.Plan_Id > b.Plan_Id) return 1;
          return 0;
        });
        setEventStockData(dataWithEventName);
        const totalTicketsSum = data.reduce(
          (sum, item) => sum + (item.Ticket_Qty || 0),
          0
        );
        setTotalTickets(totalTicketsSum);

        const totalTicketsBuySum = data.reduce(
          (sum, item) => sum + (item.Ticket_Qty_Buy || 0),
          0
        );
        setTotalTicketsBuy(totalTicketsBuySum);

        const totalTicketsBalanceSum = data.reduce(
          (sum, item) => sum + (item.Ticket_Qty_Balance || 0),
          0
        );
        setTotalTicketsBalance(totalTicketsBalanceSum);
      } else {
        throw new Error("Unexpected data format");
      }
      const savedFilters = localStorage.getItem("filtersStock");
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      }
    } catch (error) {
      toast.error("Failed to fetch event stock data");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchEventStockData();
  }, []);

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

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  const filteredStocks = eventStockData.filter((stock) => {
    const matchesSearch =
      (stock.Event_Name || "").toLowerCase().includes(filters.search) ||
      (stock.Plan_Name || "").toLowerCase().includes(filters.search);

    const matchesEventStatus =
      filters.eventStatus === "*" || stock.Event_Status == filters.eventStatus;

    const matchesPublicStatus =
      filters.publicStatus === "*" ||
      stock.Event_Public === filters.publicStatus;

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

  console.log("filteredStocks", filteredStocks);

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

  const stocksInCurrentPage = filteredStocks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredStocks.length / MAX_ITEMS_PER_PAGE);
  const numberFormatter = new Intl.NumberFormat("en-US");

  // if (isLoading) return <CircularProgress />;
  const handleClearFilters = () => {
    fetchEventStockData();
    setFilters((prevFilters) => ({
      search: prevFilters.search !== "" ? prevFilters.search : "",
      eventName: prevFilters.eventName !== "" ? prevFilters.eventName : "",
      eventStatus:
        prevFilters.eventStatus !== "*" ? prevFilters.eventStatus : "",
      publicStatus:
        prevFilters.publicStatus !== "*" ? prevFilters.publicStatus : "",
    }));
  };

  return (
    <div className="all-orders-content">
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
                  paddingLeft: "60px",
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
                  paddingLeft: "60px",
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
              }}
            >
              <InventoryIcon style={{ fontSize: 70 }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingLeft: "60px",
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
                {evntDetail.map((item, index) => (
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
              style={{ marginRight: "10px", height: "50px", width: "300px" }}
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
            </Box>
          </Stack>
        </Container>
      </div>
      <TableContainer component={Paper} sx={{ borderRadius: "0" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
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
                }}
              >
                จำนวนบัตรทั้งหมด
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                จำนวนที่/บัตร
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                จำนวนบัตรที่ถูกซื้อ
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
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
                }}
              >
                จำนวนที่นั่งคงเหลือ
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                  color: "white",
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
                }}
              >
                สถานะเผยแพร่
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocksInCurrentPage.map((stock, index) => {
              const { label, backgroundColor } = getStatusDetails(
                stock.Event_Status
              );
              const { label: publicLabel, backgroundColor: publicBgColor } =
                getPublicStatusDetails(stock.Event_Public);

              return (
                <TableRow key={stock.Event_STC_Id}>
                  <TableCell
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Event_Name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Plan_Name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Type_Name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Qty}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Qty_Per}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Qty_Buy}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.Ticket_Qty_Balance}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {stock.STC_Total_Balance}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        color: "white",
                        backgroundColor: backgroundColor,
                        padding: "4px",
                        borderRadius: "4px",
                        textAlign: "center",
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
    </div>
  );
};

export default AllStockContent;
