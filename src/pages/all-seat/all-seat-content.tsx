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
} from "@mui/material";
import { getViewTicketList } from "../../services/view-tikcet-list.service";
import toast from "react-hot-toast";
import Header from "../common/header";
import QRCodeModal from "./QRCodeModal"; // Adjust the path as necessary
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const MAX_ITEMS_PER_PAGE = 10;

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
    printStatusName: "all", // Filter for PrintStatus_Name
    scanStatus: "all", // New filter for Scan Status
  });

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
      } finally {
        setIsLoading(false);
      }
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

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  const filteredTickets = ticketData.filter((ticket) => {
    const matchesSearch =
      ticket.ticket_running.includes(filters.search) ||
      ticket.Order_no.includes(filters.search);
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
    const matchesPrintStatusName =
      filters.printStatusName === "all" ||
      ticket.PrintStatus_Name === filters.printStatusName;
    const matchesScanStatus =
      filters.scanStatus === "all" ||
      (filters.scanStatus === "แสกนแล้ว" && ticket.check_in_status === 1) ||
      (filters.scanStatus === "ยังไม่แสกน" && ticket.check_in_status === 0);
    return (
      matchesSearch &&
      matchesStatus &&
      matchesEvent &&
      matchesTicketType &&
      matchesPrintStatus &&
      matchesPrintStatusName &&
      matchesScanStatus
    );
  });

  const ticketsInCurrentPage = filteredTickets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTickets.length / MAX_ITEMS_PER_PAGE);

  const uniqueEventNames = Array.from(
    new Set(ticketData.map((ticket) => ticket.Event_Name))
  );
  // const uniquePrintStatusNames = Array.from(new Set(ticketData.map(ticket => ticket.PrintStatus_Name)));

  // Calculate the number of tickets with specific statuses
  const scannedCount = ticketData.filter(
    (ticket) => ticket.check_in_status === 1
  ).length;
  const printedCount = ticketData.filter(
    (ticket) => ticket.PrintStatus_Name === "ปริ้นแล้ว"
  ).length;

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-seats-content">
      <Header title="ที่นั่งทั้งหมด" />
      <div className="filter-options">
        <div className="filter-item">
          <LocalPrintshopIcon style={{ color: "black", fontSize: "80px" }} />
          <div className="filter-text-container">
            <span className="filter-text">แสกนแล้ว</span>
            <span className="filter-number">{scannedCount}</span>{" "}
            {/* Dynamic total count for scanned tickets */}
          </div>
        </div>
        <div className="filter-item">
          <QrCodeScannerIcon style={{ color: "black", fontSize: "80px" }} />
          <div className="filter-text-container">
            <span className="filter-text">ปริ้นแล้ว</span>
            <span className="filter-number">{printedCount}</span>{" "}
            {/* Dynamic total count for printed tickets */}
          </div>
        </div>
      </div>
      <div
        className="filters"
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            label="ค้นหา"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="ค้นหาโดย เลขที่นั่ง หรือ รหัสบัตร"
            style={{ minWidth: 300, paddingTop: "10px" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent", // Remove the border
                },
                "&:hover fieldset": {
                  borderColor: "transparent", // Remove the border on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent", // Remove the border when focused
                },
              },
            }}
          />
          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <InputLabel>งาน</InputLabel>
            <Select
              label="งาน"
              name="event"
              value={filters.event}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทุกงาน</MenuItem>
              {uniqueEventNames.map((eventName) => (
                <MenuItem key={eventName} value={eventName}>
                  {eventName}
                </MenuItem>
              ))}
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
            <InputLabel>สถานะการแสกน</InputLabel>
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
        </Stack>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>งาน</TableCell>
              <TableCell>รหัสที่นั่ง</TableCell>
              <TableCell>ชื่อโซน</TableCell>
              <TableCell>ประเภทบัตร</TableCell>
              <TableCell>เลขโต๊ะ</TableCell>
              <TableCell>ชื่อที่นั่ง</TableCell>
              <TableCell>รหัสบัตร</TableCell>
              <TableCell>สถานะการพิมพ์</TableCell>
              <TableCell>สถานะการแสกน</TableCell>
              <TableCell>เวลาแสกน</TableCell>
              <TableCell>ครั้งที่พิมพ์</TableCell>
              <TableCell>QR CODE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketsInCurrentPage.map((ticket, index) => (
              <TableRow key={ticket.DT_order_id}>
                <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                <TableCell>{ticket.Event_Name}</TableCell>
                <TableCell>{ticket.ticket_running}</TableCell>
                <TableCell>{ticket.Plan_Name}</TableCell>
                <TableCell>{ticket.Ticket_Type_Name}</TableCell>
                <TableCell>{ticket.ticket_no}</TableCell>
                <TableCell>ที่นั่ง {ticket.ticket_line}</TableCell>
                <TableCell>{ticket.Order_no}</TableCell>
                <TableCell>
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
                <TableCell>
                  <div
                    style={{
                      backgroundColor:
                        ticket.check_in_status === 0 ? "grey" : "blue",
                      color: "white", // Ensure text is readable
                      padding: "4px",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    {ticket.check_in_status === 0 ? "ยังไม่แสกน" : "แสกนแล้ว"}
                  </div>
                </TableCell>
                <TableCell>{ticket.Print_Datetime}</TableCell>
                <TableCell>{ticket.print_count}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenModal(ticket)}
                    variant="contained"
                    color="secondary"
                  >
                    ดูบัตร
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
