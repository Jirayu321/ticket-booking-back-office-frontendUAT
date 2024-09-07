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
import StartEndDatePickers from "../../components/common/input/date-picker/date"; // Import the date picker component

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
    printStatusName: "all", // Filter for PrintStatus_Name
    scanStatus: "all", // New filter for Scan Status
    startDate: null, // Add startDate filter
    endDate: null,   // Add endDate filter
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

  // Handle date range change
  const handleDateRangeChange = (startDate, endDate) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  // Clear date range filter
  const handleClearDates = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  const filteredTickets = ticketData.filter((ticket) => {
    const searchValue = filters.search.toLowerCase();
    const matchesSearch =
      ticket.ticket_running?.toLowerCase().includes(searchValue) ||
      ticket.Order_no?.toLowerCase().includes(searchValue) ||
      ticket.ticket_no?.toLowerCase().includes(searchValue) ||
      ticket.Event_Name?.toLowerCase().includes(searchValue);
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

    // Date range filtering logic
    const eventDate = new Date(ticket.Event_Public_Date);
    const startDate = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = filters.endDate ? new Date(filters.endDate).setHours(23, 59, 59, 999) : null;
    const matchesDateRange =
      (!startDate || eventDate >= startDate) &&
      (!endDate || eventDate <= endDate);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesEvent &&
      matchesTicketType &&
      matchesPrintStatus &&
      matchesPrintStatusName &&
      matchesScanStatus &&
      matchesDateRange // Apply date range filter
    );
  });

  const ticketsInCurrentPage = filteredTickets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTickets.length / MAX_ITEMS_PER_PAGE);

  function formatDate(dateString) {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 7); // Subtract 7 hours from the event time
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

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
          backgroundColor: "white",
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
            placeholder="ค้นหาโดย ชื่องาน,รหัสที่นั่ง, หรือ เลขคำสั่งซื้อ"
            style={{ marginRight: "10px", height: "50px", width: "300px" }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  border: 'none',
                  transform: 'translateY(5px)',
                },
              },
            }}
          />
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
            <InputLabel>สถานะการเช็คอิน	</InputLabel>
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

        {/* Date Picker Filter */}
        <Stack direction="row" spacing={2} marginTop={2}>
          <StartEndDatePickers
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(date) => handleDateRangeChange(date, filters.endDate)}
            onEndDateChange={(date) => handleDateRangeChange(filters.startDate, date)}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClearDates}
            style={{ marginTop: "8px" }}
          >
            Clear Dates
          </Button>
        </Stack>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "10px" }}>ลำดับ</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "100px" }}>ชื่องาน</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "100px" }}>วันจัดงาน</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "50px" }}>รหัสที่นั่ง</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "50px" }}>เลขโต๊ะ</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "50px" }}>เลขที่นั่ง</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "80px" }}>เลขคำสั่งซื้อ</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "100px" }}>สถานะการพิมพ์</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "100px" }}>สถานะการเช็คอิน</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "50px" }}>เวลาเช็คอิน</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "20px" }}>ครั้งที่พิมพ์</TableCell>
              <TableCell style={{ color: "black", fontSize: "18px", fontWeight: "bold", textAlign: "center", width: "50px" }}>QR CODE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketsInCurrentPage.map((ticket, index) => (
              <TableRow key={ticket.DT_order_id}>
                <TableCell style={{ textAlign: "center" }}>{indexOfFirstItem + index + 1}</TableCell>
                <TableCell style={{ textAlign: "left" }}>{ticket.Event_Name}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {ticket.Event_Public_Date ? formatDate(ticket.Event_Time) : 'ยังไม่ระบุ'}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{ticket.ticket_running}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{ticket.ticket_no}</TableCell>
                <TableCell style={{ textAlign: "center" }}>ที่นั่ง {ticket.ticket_line}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{ticket.Order_no}</TableCell>
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
                    {ticket.check_in_status === 0 ? "ยังไม่เช็คอิน" : "เช็คอินแล้ว"}
                  </div>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>{ticket.Check_In_Datetime}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{ticket.print_count}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
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
