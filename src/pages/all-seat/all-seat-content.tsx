import React, { useState, useEffect } from "react";
import {
  // CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

import Header from "../common/header";
import QRCodeModal from "./QRCodeModal";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

import {
  selectedColor,
  PrintStatusColor1,
  PrintStatusColor0,
  check_in_statusColor1,
  check_in_statusColor0,
  ticketReserveStatusColorR,
  ticketReserveStatusColorW,
} from "../../lib/util";

dayjs.extend(buddhistEra);

import { useFetchgetTicketList } from "../../hooks/fetch-data/useFetchEventList";

const AllSeatContent: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("filtersSeat");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          search: "",
          event: "all",
          eventName: "",
          ticketType: "all",
          printStatus: "all",
          scanStatus: "all",
          ticket_Reserve: "all",
          ticket_pay: "all",
          ticketNo: "",
        };
  });

  // const { data: Data, refetch } = useFetchgetTicketList({
  //   eventId: null,
  // });

  const [seats, setSeats] = useState<any[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { refetch } = useFetchgetTicketList({ eventId: null });

  useEffect(() => {
    if (seats) {
      console.log("ข้อมูล data เปลี่ยนไป:", seats);
    }
  }, [seats]);

  useEffect(() => {
    if (isFetching) {
      console.log("กำลังดึงข้อมูล...");
    } else if (seats) {
      console.log("ข้อมูลโหลดเสร็จแล้ว");
    }
  }, [isFetching, seats]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setIsFetching(true);

    setSeats(null);

    const result = await refetch();
    if (result?.data) {
      setSeats(result.data);
      console.log("ข้อมูล data เปลี่ยนไป:", result.data);
    }
    setIsFetching(false);
  };

  const handleClearFilters = () => {
    setFilters((prevFilters) => ({
      search: prevFilters.search !== "" ? prevFilters.search : "",
      event: prevFilters.event !== "all" ? prevFilters.event : "all",
      eventName: prevFilters.eventName !== "" ? prevFilters.eventName : "",
      ticketType:
        prevFilters.ticketType !== "all" ? prevFilters.ticketType : "all",
      printStatus:
        prevFilters.printStatus !== "all" ? prevFilters.printStatus : "all",
      scanStatus:
        prevFilters.scanStatus !== "all" ? prevFilters.scanStatus : "all",
      ticket_Reserve:
        prevFilters.ticket_Reserve !== "all"
          ? prevFilters.ticket_Reserve
          : "all",
      ticket_pay:
        prevFilters.ticket_pay !== "all" ? prevFilters.ticket_pay : "all",

      ticketNo: prevFilters.ticketNo !== "" ? prevFilters.ticketNo : "",
    }));
    setStartDate(dayjs().startOf("month"));
    setEndDate(dayjs().endOf("month"));

    initialize();
  };

  const dataEvent = seats?.dataEvent || {};
  const dataTicketStock = seats?.dataTicketList || [];
  const TicketTypes = seats?.dataTicketTypes || [];
  const evntDetail =
    dataEvent.events?.filter((event: any) => event?.Event_Public === "Y") || [];
  const ticketData = Array.isArray(dataTicketStock?.ticketList)
    ? dataTicketStock.ticketList
    : [];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [name]: value,
      };
      localStorage.setItem("filtersSeat", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  };

  const handleSearchChange = (event) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        search: event.target.value,
      };
      localStorage.setItem("filtersSeat", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  };
  const handleSearchChange2 = (event) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        ticketNo : event.target.value,
      };
      localStorage.setItem("filtersSeat", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
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
        current.Cust_tel?.toLowerCase().includes(searchValue) ||
        current.Plan_Name?.toLowerCase().includes(searchValue);

      const matchesTicketNo = String(current.ticket_no)
        .toLowerCase()
        .includes(filters.ticketNo?.toLowerCase() || "");

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
        (filters.scanStatus === "เช็คอินแล้ว" &&
          current.check_in_status === 1) ||
        (filters.scanStatus === "ยังไม่เช็คอิน" &&
          current.check_in_status === 0);

      const matchesTicketReserve =
        filters.ticket_Reserve === "all" ||
        (filters.ticket_Reserve === "ติดจอง" &&
          current.ticket_Reserve === "R") ||
        (filters.ticket_Reserve === "ปกติ" && current.ticket_Reserve === "W");

      const matchesTicketPay =
        filters.ticket_pay === "all" ||
        (filters.ticket_pay === "ชำระครบ" && current.Is_Balance === 0) ||
        (filters.ticket_pay === "ค้างจ่าย" && current.Is_Balance > 0);

      const matchesEventName =
        filters.eventName === "" ||
        (filters.eventName &&
          current.Event_Name &&
          current.Event_Name.toLowerCase().includes(
            filters.eventName.toLowerCase()
          ));

      if (
        matchesSearch &&
        matchesEvent &&
        matchesTicketType &&
        matchesPrintStatus &&
        matchesScanStatus &&
        matchesTicketReserve &&
        matchesEventName &&
        matchesTicketPay &&
        matchesTicketNo
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
  console.log("ticketData", ticketData);
  const filteredTickets = applyFilters(ticketData);
  console.log("filteredTickets", filteredTickets);
  const totalCount = filteredTickets?.length;
  const scannedCount = filteredTickets.filter(
    (ticket) => ticket.check_in_status === 1
  ).length;

  const printedCount = filteredTickets.filter(
    (ticket) => ticket.PrintStatus_Name === "พิมพ์แล้ว"
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
  const tableCount = countSeatsPerTable(ticketData);

  let previousTableNumber = "";
  let seatIndexInTable = 0;

  const formatTableDisplay = (tableNumber, seatIndex, totalSeats, ticket) => {
    // console.log("ticket", ticket);
    // console.log("TicketTypes", TicketTypes);

    if (TicketTypes.length !== 0) {
      const matchingType = TicketTypes?.ticketTypes.find(
        (type) => type.Ticket_Type_Id === ticket.Ticket_Type_Id
      );

      if (matchingType && matchingType.Ticket_Type_Cal === "N") {
        return `${tableNumber} (${1}/${1})`; // 1/1
      } else {
        return `${tableNumber} (${seatIndex}/${
          ticket.Total_stc / ticket.Web_Qty_Buy
        })`;
      }
    }
  };

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
  };

  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const handleticketClick = (orderNo: any) => {
    setSelectedOrderNo(orderNo);
  };

  return (
    <div
      className="all-seats-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="ที่นั่งทั้งหมด" />

      <Container
        maxWidth={false}
        sx={{
          padding: 1,
          display: "grid",
          margin: "5px 0px",
        }}
      >
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
                justifyContent: "space-evenly",
              }}
            >
              <QrCodeScannerIcon style={{ color: "black", fontSize: "70px" }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  // paddingLeft: "60px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>เช็คอินแล้ว</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {filters.eventName !== ""
                      ? `${scannedCount} / ${totalCount} `
                      : ``}
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
                justifyContent: "space-evenly",
              }}
            >
              <LocalPrintshopIcon
                style={{ color: "black", fontSize: "70px" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  // paddingLeft: "60px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>พิมพ์แล้ว</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {filters.eventName !== ""
                      ? `${printedCount} / ${totalCount} `
                      : ``}
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
            <FormControl variant="outlined" style={{ minWidth: 150 }}>
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
              placeholder="ค้นหาโดย ชื่องาน,รหัสที่นั่ง,ชื่อลูกค้า,เบอร์โทร,โซน หรือ เลขคำสั่งซื้อ"
              style={{ marginRight: "10px", width: "450px" }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                    height: 30,
                  },
                },
              }}
            />
            <TextField
              variant="outlined"
              label="ค้นหาเบอร์โต๊ะ"
              value={filters.ticketNo}
              onChange={handleSearchChange2}
              placeholder="ค้นหาโดยเบอร์โต๊ะ"
              style={{ marginRight: "10px", width: "150px" }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    border: "none",
                    transform: "translateY(5px)",
                    height: 30,
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
                <MenuItem value="ปกติ">ปกติ</MenuItem>
                <MenuItem value="ติดจอง">ติดจอง</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ minWidth: 150 }}>
              <InputLabel>สถานะการจ่าย</InputLabel>
              <Select
                label="สถานะการจ่าย"
                name="ticket_pay"
                value={filters.ticket_pay}
                onChange={handleFilterChange}
              >
                <MenuItem value="all">ทั้งหมด</MenuItem>
                <MenuItem value="ชำระครบ">ชำระครบ</MenuItem>
                <MenuItem value="ค้างจ่าย">ค้างจ่าย</MenuItem>
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
                <MenuItem value="ยังไม่ปริ้น">ยังไม่พิมพ์</MenuItem>
                <MenuItem value="ปริ้นแล้ว">พิมพ์แล้ว</MenuItem>
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
                <MenuItem value="เช็คอินแล้ว">เช็คอินแล้ว</MenuItem>
                <MenuItem value="ยังไม่เช็คอิน">ยังไม่เช็คอิน</MenuItem>
              </Select>
            </FormControl>
            <div style={{ color: "black", display: "flex" }}>
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
                ค้นหา
              </Button>
              {filteredTickets?.length === 0 ? (
                <p style={{ color: "red", marginLeft: 10 }}>
                  ผลการค้นหา 0 รายการ
                </p>
              ) : (
                <p style={{}}></p>
              )}
            </div>
          </Stack>
        </Container>
      </div>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "0", maxHeight: "72vh" }}
      >
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "10px",
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
                  color: "white",
                  fontSize: "17px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "100px",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
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
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                QR CODE
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTickets.map((ticket, index) => {
              const formattedEventTime = dayjs(ticket.Event_Time)
                .subtract(7, "hour")
                .locale("th")
                .format("D/M/BBBB HH:mm");

              const formattedEventTime2 = dayjs(ticket.Check_In_Datetime)
                .subtract(7, "hour")
                .locale("th")
                .format("D/M/BBBB HH:mm:ss");

              if (ticket.ticket_no !== previousTableNumber) {
                seatIndexInTable = 1; // Start counting from 1 for the new table
                previousTableNumber = ticket.ticket_no; // Update the previous table number
              } else {
                seatIndexInTable += 1; // Increment seat index for the same table
              }
              return (
                <TableRow
                  key={ticket.DT_order_id}
                  style={{
                    backgroundColor:
                      selectedOrderNo === ticket.ticket_running
                        ? `${selectedColor}`
                        : "inherit",
                    cursor: "pointer",
                  }}
                  onClick={() => handleticketClick(ticket.ticket_running)}
                >
                  <TableCell
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
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
                      tableCount[ticket.ticket_no] || 0,
                      ticket
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
                          ticket.PrintStatus_Name === "ยังไม่พิมพ์"
                            ? `${PrintStatusColor1}`
                            : `${PrintStatusColor0}`,
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
                          ticket.check_in_status === 0
                            ? `${check_in_statusColor1}`
                            : `${check_in_statusColor0}`,
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
                    {ticket.Check_In_Datetime ? `${formattedEventTime2}` : null}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.print_count}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ticket.ticket_Reserve === "W" &&
                    ticket.Is_Balance === 0 ? (
                      <Button
                        onClick={() => handleOpenModal(ticket)}
                        variant="contained"
                        color={ticketReserveStatusColorW}
                      >
                        ดูบัตร
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: `${ticketReserveStatusColorR}`,
                          color: "black",
                        }}
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

      {/* <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handleClick(page)}
          color="primary"
        />
      </div> */}

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
