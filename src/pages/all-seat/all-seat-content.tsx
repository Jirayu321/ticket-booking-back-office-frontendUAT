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
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Container,
  Grid,
  // Avatar,
  Box,
  Typography,
} from "@mui/material";
import { getViewTicketList } from "../../services/view-tikcet-list.service";
import toast from "react-hot-toast";
import Header from "../common/header";
import QRCodeModal from "./QRCodeModal"; // Adjust the path as necessary
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import StartEndDatePickers from "../../components/common/input/date-picker/date"; // Import the date picker component
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { DatePicker } from "@mui/x-date-pickers";

dayjs.extend(buddhistEra);

const MAX_ITEMS_PER_PAGE = 50;

const AllSeatContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketData, setTicketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    event: "all",
    ticketType: "all",
    printStatus: "all",
    printStatusName: "all",
    scanStatus: "all",
    ticket_Reserve: "all",
  });
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  useEffect(() => {
    async function fetchTicketData() {
      try {
        const data = await getViewTicketList(); // Fetch data from your service
        if (Array.isArray(data)) {
          setTicketData(data);
        } else if (data?.ticketList && Array.isArray(data.ticketList)) {
          setTicketData(data.ticketList);
        } else {
          toast.error("Unexpected data format");
        }
      } catch (error) {
        toast.error("Failed to fetch ticket data");
      }
      // finally {
      // setIsLoading(false);
      // }
    }

    fetchTicketData();
  }, []);

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const handleDateRangeChange = (startDate, endDate) => {
  //   setStartDate(startDate);
  //   setEndDate(endDate);
  // };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  console.log("ticketData", ticketData, filters);
  const filteredTickets = ticketData.filter((ticket) => {
    const searchValue = filters.search.toLowerCase();
    const matchesSearch =
      ticket.ticket_running?.toLowerCase().includes(searchValue) ||
      ticket.Order_no?.toLowerCase().includes(searchValue) ||
      ticket.ticket_no?.toLowerCase().includes(searchValue) ||
      ticket.Event_Name?.toLowerCase().includes(searchValue) ||
      ticket.Cust_name?.toLowerCase().includes(searchValue) || // Added search for Cust_name
      ticket.Cust_tel?.toLowerCase().includes(searchValue); // Added search for Cust_tel

    const matchesStatus =
      filters.status === "all" || ticket.status === filters.status;

    const matchesEvent =
      filters.event === "all" || ticket.Event_Name.includes(filters.event);

    const matchesTicketType =
      filters.ticketType === "all" ||
      ticket.Ticket_Type_Name.includes(filters.ticketType);

    const matchesPrintStatus =
      filters.printStatus === "all" ||
      ticket.PrintStatus_Name === filters.printStatus;

    const matchesTicket_Reserve =
      filters.ticket_Reserve === "all" ||
      (filters.ticket_Reserve === "ติดจอง" && ticket.ticket_Reserve === "R") ||
      (filters.ticket_Reserve === "ซื้อแล้ว" && ticket.ticket_Reserve === "W");

    const matchesPrintStatusName =
      filters.printStatusName === "all" ||
      ticket.PrintStatus_Name === filters.printStatusName;

    const matchesScanStatus =
      filters.scanStatus === "all" ||
      (filters.scanStatus === "แสกนแล้ว" && ticket.check_in_status === 1) ||
      (filters.scanStatus === "ยังไม่แสกน" && ticket.check_in_status === 0);

    // Date range filtering logic
    const eventDate = new Date(ticket.Event_Public_Date);
    const startDateFilter = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : null;
    const endDateFilter = endDate
      ? new Date(endDate).setHours(23, 59, 59, 999)
      : null;
    const matchesDateRange =
      (!startDateFilter || eventDate >= startDateFilter) &&
      (!endDateFilter || eventDate <= endDateFilter);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesEvent &&
      matchesTicketType &&
      matchesPrintStatus &&
      matchesTicket_Reserve &&
      matchesPrintStatusName &&
      matchesScanStatus &&
      matchesDateRange
    );
  });

  const ticketsInCurrentPage = filteredTickets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTickets.length / MAX_ITEMS_PER_PAGE);

  const scannedCount = ticketData.filter(
    (ticket) => ticket.check_in_status === 1
  ).length;
  const printedCount = ticketData.filter(
    (ticket) => ticket.PrintStatus_Name === "ปริ้นแล้ว"
  ).length;

  // if (isLoading) return <CircularProgress />;
  // if (isLoading) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </div>
  //   );
  // }
  return (
    <div className="all-seats-content">
      <Header title="ที่นั่งทั้งหมด" />
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
              <LocalPrintshopIcon
                style={{ color: "black", fontSize: "70px" }}
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
                  <Typography sx={{ fontSize: "23px" }}>แสกนแล้ว</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {scannedCount}
                  </Typography>
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
              <QrCodeScannerIcon style={{ color: "black", fontSize: "70px" }} />

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
                  <Typography sx={{ fontSize: "23px" }}>ปริ้นแล้ว</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {printedCount}{" "}
                  </Typography>
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
            <TextField
              variant="outlined"
              label="ค้นหา"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="ค้นหาโดย ชื่องาน,รหัสที่นั่ง,ชื่อลูกค้า,เบอร์โทร หรือ เลขคำสั่งซื้อ"
              style={{ marginRight: "10px", height: "50px", width: "450px" }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                  },
                },
              }}
            />
            <FormControl variant="outlined" style={{ minWidth: 150 }}>
              <InputLabel>สถานะตั๋ว</InputLabel>
              <Select
                label="สถานะตั๋ว"
                name="ticket_Reserve"
                value={filters.ticket_Reserve}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="ติดจอง">ติดจอง</MenuItem>
                <MenuItem value="ซื้อแล้ว">ซื้อแล้ว</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ minWidth: 150 }}>
              <InputLabel>สถานะการพิมพ์</InputLabel>
              <Select
                label="สถานะการพิมพ์"
                name="printStatus"
                value={filters.printStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="ยังไม่ปริ้น">ยังไม่ปริ้น</MenuItem>
                <MenuItem value="ปริ้นแล้ว">ปริ้นแล้ว</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ minWidth: 150 }}>
              <InputLabel>สถานะการเช็คอิน </InputLabel>
              <Select
                label="สถานะการแสกน"
                name="scanStatus"
                value={filters.scanStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="แสกนแล้ว">แสกนแล้ว</MenuItem>
                <MenuItem value="ยังไม่แสกน">ยังไม่แสกน</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ backgroundColor: "white" }}>
              <DatePicker
                label="วันที่เริ่มต้น"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                format="DD/MM/YYYY"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                      backgroundColor: "white",
                      width: "90px",
                    },
                  },
                }}
              />
            </FormControl>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                justifyContent: "flex-end", // Align items to the right
                flexGrow: 1, // Take up remaining space
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearDates}
                sx={{
                  backgroundColor: "#CFB70B",
                  width: "160px",
                  height: "45px",
                  color: "black",
                  fontSize: "15px",
                  "&:hover": {
                    backgroundColor: "#CFB70B",
                  },
                  flexShrink: 0, // Prevent the button from shrinking
                }}
              >
                ล้างค่าการค้นหา
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
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "10px",
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
                  width: "100px",
                }}
              >
                ชื่องาน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                วันจัดงาน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                ชื่อลูกค้า
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100px",
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
                  width: "50px",
                }}
              >
                รหัสที่นั่ง
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                เลขโต๊ะ
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                เลขที่นั่ง
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "80px",
                }}
              >
                เลขคำสั่งซื้อ
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                สถานะการพิมพ์
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                สถานะการเช็คอิน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                เวลาเช็คอิน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "20px",
                }}
              >
                ครั้งที่พิมพ์
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                QR CODE
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketsInCurrentPage.map((ticket, index) => {
              const formattedEventTime = dayjs(ticket.Event_Time)
                .subtract(7, "hour")
                .locale("th")
                .format("D/M/BBBB HH:mm");
              return (
                <TableRow key={ticket.DT_order_id}>
                  <TableCell
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell style={{ textAlign: "left" }}>
                    {ticket.Event_Name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {formattedEventTime}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.Cust_name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.Cust_tel}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.ticket_running}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.ticket_no}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    ที่นั่ง {ticket.ticket_line}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.Order_no}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        backgroundColor:
                          ticket.PrintStatus_Name === "ยังไม่ปริ้น"
                            ? "orange"
                            : "blue",
                        color: "white",
                        padding: "4px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    >
                      {ticket.PrintStatus_Name}
                    </div>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        backgroundColor:
                          ticket.check_in_status === 0 ? "grey" : "blue",
                        color: "white",
                        padding: "4px",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    >
                      {ticket.check_in_status === 0
                        ? "ยังไม่เช็คอิน"
                        : "เช็คอินแล้ว"}
                    </div>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.Check_In_Datetime}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.print_count}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.ticket_Reserve === "W" ? (
                      <Button
                        onClick={() => handleOpenModal(ticket)}
                        variant="contained"
                        color="secondary"
                      >
                        ดูบัตร
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleOpenModal(ticket)}
                        variant="contained"
                        style={{ backgroundColor: "silver", color: "black" }}
                        disabled
                      >
                        ดูบัตร
                      </Button>
                    )}
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

      {selectedTicket && (
        <QRCodeModal
          open={modalOpen}
          handleClose={handleCloseModal}
          ticketData={selectedTicket}
        />
      )}
    </div>
  );
};

export default AllSeatContent;
