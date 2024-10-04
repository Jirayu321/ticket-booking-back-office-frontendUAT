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
  Box,
  Typography,
} from "@mui/material";
import { getViewTicketList } from "../../services/view-tikcet-list.service";
import toast from "react-hot-toast";
import Header from "../common/header";
import QRCodeModal from "./QRCodeModal";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

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
    event: "all",
    ticketType: "all",
    printStatus: "all",
    scanStatus: "all",
    ticket_Reserve: "all",
  });
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const data = await getViewTicketList();
        console.log("data", data);
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
    };

    fetchTicketData();
  }, []);

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

  const handleClearFilters = () => {
    setFilters({
      search: "",
      event: "all",
      ticketType: "all",
      printStatus: "all",
      scanStatus: "all",
      ticket_Reserve: "all",
    });
    setStartDate(dayjs().startOf("month"));
    setEndDate(dayjs().endOf("month"));
  };

  const applyFilters = (tickets) => {
    return tickets.reduce((acc, current) => {
      const searchValue = filters.search.toLowerCase();

      const matchesSearch =
        current.ticket_running?.toLowerCase().includes(searchValue) ||
        current.Order_no?.toLowerCase().includes(searchValue) ||
        current.ticket_no?.toLowerCase().includes(searchValue) ||
        current.Event_Name?.toLowerCase().includes(searchValue) ||
        current.Cust_name?.toLowerCase().includes(searchValue) ||
        current.Cust_tel?.toLowerCase().includes(searchValue);

      const matchesEvent =
        filters.event === "all" || current.Event_Name.includes(filters.event);

      const matchesTicketType =
        filters.ticketType === "all" ||
        current.Ticket_Type_Name.includes(filters.ticketType);

      const matchesPrintStatus =
        filters.printStatus === "all" ||
        (filters.printStatus === "ยังไม่ปริ้น" && current.print_status === 0) ||
        (filters.printStatus === "ปริ้นแล้ว" && current.print_status === 1);

      const matchesScanStatus =
        filters.scanStatus === "all" ||
        (filters.scanStatus === "แสกนแล้ว" && current.check_in_status === 1) ||
        (filters.scanStatus === "ยังไม่แสกน" && current.check_in_status === 0);

      const matchesTicketReserve =
        filters.ticket_Reserve === "all" ||
        (filters.ticket_Reserve === "ติดจอง" &&
          current.ticket_Reserve === "R") ||
        (filters.ticket_Reserve === "ชำระครบ" &&
          current.ticket_Reserve === "W" &&
          current.Total_Balance === 0) ||
        (filters.ticket_Reserve === "ค้างชำระ" &&
          current.ticket_Reserve === "W" &&
          current.Total_Balance !== 0);

      // Combine all conditions
      if (
        matchesSearch &&
        matchesEvent &&
        matchesTicketType &&
        matchesPrintStatus &&
        matchesScanStatus &&
        matchesTicketReserve
      ) {
        // Check if we already have a ticket with the same ID
        const existingTicket = acc.find(
          (ticket) => ticket.ticket_running === current.ticket_running
        );

        // If we find one, check if the current ticket is newer
        if (existingTicket) {
          const existingEventTime = new Date(existingTicket.Event_Time);
          const currentEventTime = new Date(current.Event_Time);
          if (currentEventTime > existingEventTime) {
            return acc.map((ticket) =>
              ticket.ticket_running === current.ticket_running
                ? current
                : ticket
            );
          }
        } else {
          acc.push(current);
        }
      }

      return acc;
    }, []);
  };

  const filteredTickets = applyFilters(ticketData);
  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

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

  const countSeatsPerTable = (tickets: any[]) => {
    const tableCount: { [key: string]: number } = {};
    let previousTableNumber = ""; // ตัวแปรสำหรับเก็บ ticket_no ก่อนหน้า
    let seatIndexInTable = 0; // ตัวแปรนับที่นั่งในโต๊ะ

    tickets.forEach((ticket) => {
      // เช็คว่าถ้า ticket_no เปลี่ยนให้เริ่มนับใหม่
      if (ticket.ticket_no !== previousTableNumber) {
        seatIndexInTable = 1; // เริ่มนับที่นั่งใหม่เมื่อ ticket_no เปลี่ยน
        previousTableNumber = ticket.ticket_no; // อัพเดท ticket_no ใหม่
      } else {
        seatIndexInTable += 1; // ถ้าเป็น ticket_no เดิม ให้นับที่นั่งเพิ่มขึ้น
      }

      // ใช้ ticket_no เป็น key แทน table_number
      if (!tableCount[ticket.ticket_no]) {
        tableCount[ticket.ticket_no] = 1;
      } else {
        tableCount[ticket.ticket_no] += 1;
      }
    });

    return tableCount;
  };
  // Count the total number of seats per table
  const tableCount = countSeatsPerTable(ticketData);

  let previousTableNumber = ""; // Keeps track of the previous table number
  let seatIndexInTable = 0; // Index for seat in the table

  const formatTableDisplay = (tableNumber, seatIndex, totalSeats) => {
    if (tableNumber === "บัตรเสริม") {
      return `${tableNumber} (1/1)`; // กรณีบัตรเสริม แสดง (1/1)
    }
    return `${tableNumber} (${seatIndex}/${totalSeats})`;
  };

  console.log(
    "ticketsInCurrentPage",
    ticketsInCurrentPage.filter((ticket) => ticket.ticket_no === "0")
  );
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
                    {printedCount}
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
                <MenuItem value="ชำระครบ">ชำระครบ</MenuItem>
                <MenuItem value="ค้างชำระ">ค้างชำระ</MenuItem>
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
              <InputLabel>สถานะการเช็คอิน</InputLabel>
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
              }}
            >
              ล้างค่าการค้นหา
            </Button>
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
                โซน
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

              if (ticket.ticket_no !== previousTableNumber) {
                seatIndexInTable = 1; // Start counting from 1 for the new table
                previousTableNumber = ticket.ticket_no; // Update the previous table number
              } else {
                seatIndexInTable += 1; // Increment seat index for the same table
              }
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
                    {formatTableDisplay(
                      ticket.ticket_no,
                      seatIndexInTable,
                      tableCount[ticket.ticket_no] || 0
                    )}
                    {ticket.ticket_Reserve === "R" ? (
                      <span style={{ marginLeft: "10px" }}>R</span>
                    ) : null}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.Plan_Name}
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
                    {ticket.ticket_Reserve === "W" &&
                    ticket.Total_Balance === 0 ? (
                      <Button
                        onClick={() => handleOpenModal(ticket)}
                        variant="contained"
                        color="secondary"
                      >
                        ดูบัตร
                      </Button>
                    ) : (
                      <Button
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
