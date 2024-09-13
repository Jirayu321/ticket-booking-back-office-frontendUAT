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
} from "@mui/material";
import { getEventStock } from "../../services/event-stock.service"; // Import the correct service
import toast from "react-hot-toast";
import Header from "../common/header"; // Assuming you have a Header component
import InventoryIcon from "@mui/icons-material/Inventory";

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
    eventStatus: "*", // Added filter for event status
    publicStatus: "*", // Added filter for public status
  });
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [totalTicketsBuy, setTotalTicketsBuy] = useState<number>(0);
  const [totalTicketsBalance, setTotalTicketsBalance] = useState<number>(0);

  useEffect(() => {
    async function fetchEventStockData() {
      try {
        const data = await getEventStock(); // Fetch data from the event stock service
        if (data && Array.isArray(data)) {
          setEventStockData(data);

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
      } catch (error) {
        toast.error("Failed to fetch event stock data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventStockData();
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: event.target.value,
    }));
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  const filteredStocks = eventStockData.filter((stock) => {
    const matchesSearch =
      (stock.Event_Name || "").includes(filters.search) ||
      (stock.Plan_Name || "").includes(filters.search);

    const matchesEventStatus =
      filters.eventStatus === "*" || stock.Event_Status == filters.eventStatus;

    const matchesPublicStatus =
      filters.publicStatus === "*" || stock.Event_Public === filters.publicStatus;

    return matchesSearch && matchesEventStatus && matchesPublicStatus;
  });

  const stocksInCurrentPage = filteredStocks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStocks.length / MAX_ITEMS_PER_PAGE);
  const numberFormatter = new Intl.NumberFormat("en-US");

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-orders-content">
      <Header title="สต๊อกทั้งหมด" />
      <div className="filter-options">
        {/* Total tickets, bought tickets, and balance display */}
        <div className="filter-item">
          <img
            src="/cart.svg"
            alt="คำสั่งซื้อทั้งหมด icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">บัตรทั้งหมด</span>
            <span className="filter-number">
              {numberFormatter.format(totalTickets)}
            </span>
          </div>
        </div>
        <div className="filter-item">
          <img
            src="/not-pay.svg"
            alt="บัตรที่ขายไปแล้ว icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">บัตรที่ขายไปแล้ว</span>
            <span className="filter-number">
              {numberFormatter.format(totalTicketsBuy)}
            </span>
          </div>
        </div>
        <div className="filter-item">
          <InventoryIcon style={{ fontSize: 80 }} />
          <div className="filter-text-container">
            <span className="filter-text">บัตรคงเหลือทั้งหมด</span>
            <span className="filter-number">
              {numberFormatter.format(totalTicketsBalance)}
            </span>
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
          />
          {/* Filter by Event Status */}
          <FormControl variant="outlined" style={{ minWidth: 150 }}>
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
          {/* Filter by Public Status */}
          <FormControl variant="outlined" style={{ minWidth: 150 }}>
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
        </Stack>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>ลำดับ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>ชื่องาน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>ชื่อโซน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>ประเภทบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>จำนวนบัตรทั้งหมด</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>จำนวนที่/บัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>จำนวนบัตรที่ถูกซื้อ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>จำนวนบัตรคงเหลือ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>จำนวนที่นั่งคงเหลือ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>สถานะ Event</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>สถานะเผยแพร่</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocksInCurrentPage.map((stock, index) => {
              const { label, backgroundColor } = getStatusDetails(stock.Event_Status);
              const { label: publicLabel, backgroundColor: publicBgColor } = getPublicStatusDetails(stock.Event_Public);

              return (
                <TableRow key={stock.Event_STC_Id}>
                  <TableCell style={{ textAlign: "center" }}>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Event_Name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Plan_Name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Ticket_Type_Name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Ticket_Qty}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Ticket_Qty_Per}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Ticket_Qty_Buy}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.Ticket_Qty_Balance}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{stock.STC_Total_Balance}</TableCell>
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

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
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
