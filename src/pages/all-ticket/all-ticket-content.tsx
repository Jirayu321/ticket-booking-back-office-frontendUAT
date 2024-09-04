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
import InventoryIcon from '@mui/icons-material/Inventory';

const MAX_ITEMS_PER_PAGE = 10;

const AllTicketContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventStockData, setEventStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    search: "",
    event: "all",
  });
  const [uniqueEvents, setUniqueEvents] = useState<string[]>([]);
  const [totalTickets, setTotalTickets] = useState<number>(0); // State for total tickets
  const [totalTicketsBuy, setTotalTicketsBuy] = useState<number>(0); // State for total tickets bought
  const [totalTicketsBalance, setTotalTicketsBalance] = useState<number>(0); // State for total remaining tickets

  useEffect(() => {
    async function fetchEventStockData() {
      try {
        const data = await getEventStock(); // Fetch data from the event stock service
        if (data && Array.isArray(data)) {
          setEventStockData(data);

          // Calculate the total number of tickets (sum of Ticket_Qty)
          const totalTicketsSum = data.reduce((sum, item) => sum + (item.Ticket_Qty || 0), 0);
          setTotalTickets(totalTicketsSum);

          // Calculate the total number of tickets bought (sum of Ticket_Qty_Buy)
          const totalTicketsBuySum = data.reduce((sum, item) => sum + (item.Ticket_Qty_Buy || 0), 0);
          setTotalTicketsBuy(totalTicketsBuySum);

          // Calculate the total number of remaining tickets (sum of Ticket_Qty_Balance)
          const totalTicketsBalanceSum = data.reduce((sum, item) => sum + (item.Ticket_Qty_Balance || 0), 0);
          setTotalTicketsBalance(totalTicketsBalanceSum);

          // Extract unique event names safely
          const events = Array.from(new Set(data.map((item: any) => item.Event_Name).filter(Boolean)));
          setUniqueEvents(events);
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

  const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
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
    const matchesSearch = (stock.Event_Name || "").includes(filters.search) || (stock.Ticket_Type_Name || "").includes(filters.search);
    const matchesEvent = filters.event === "all" || (stock.Event_Name || "") === filters.event;
    return matchesSearch && matchesEvent;
  });

  const stocksInCurrentPage = filteredStocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStocks.length / MAX_ITEMS_PER_PAGE);
  const numberFormatter = new Intl.NumberFormat('en-US');

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-orders-content">
      <Header title="บัตรทั้งหมด" />
      <div className="filter-options">
        <div className="filter-item">
          <img
            src="/cart.svg"
            alt="คำสั่งซื้อทั้งหมด icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">บัตรทั้งหมด</span>
            <span className="filter-number">{numberFormatter.format(totalTickets)}</span> {/* Display total tickets */}
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
            <span className="filter-number">{numberFormatter.format(totalTicketsBuy)}</span> {/* Display total tickets bought */}
          </div>
        </div>
        <div className="filter-item">
          <InventoryIcon style={{ fontSize: 80 }} />  
          <div className="filter-text-container">
            <span className="filter-text">บัตรคงเหลือทั้งหมด</span>
            <span className="filter-number">{numberFormatter.format(totalTicketsBalance)}</span> {/* Display total remaining tickets */}
          </div>
        </div>
      </div>
      <div className="filters" style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px", marginBottom: "20px" }}>
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            label="ค้นหา"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="ค้นหาโดย ชื่องาน หรือ ประเภทบัตร"
            style={{ minWidth: 300 ,paddingTop: "10px"}}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent', // Remove the border
                },
                '&:hover fieldset': {
                  borderColor: 'transparent', // Remove the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent', // Remove the border when focused
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
              {uniqueEvents.map((event) => (
                <MenuItem key={event} value={event}>
                  {event}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ลำดับ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ชื่อผังร้าน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ชื่อโซน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ประเภทบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>จำนวนที่/บัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>จำนวนบัตรทั้งหมด</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>จำนวนบัตรที่ซื้อ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>จำนวนบัตรคงเหลือ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>งาน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocksInCurrentPage.map((stock, index) => (
              <TableRow key={stock.Event_STC_Id}>
                <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                <TableCell>{stock.PlanGroup_Name}</TableCell>
                <TableCell>{stock.Plan_Name}</TableCell>
                <TableCell style={{textAlign:"center"}} >{stock.Ticket_Type_Name}</TableCell>
                <TableCell style={{textAlign:"center"}}>{stock.Ticket_Qty_Per}</TableCell>
                <TableCell style={{textAlign:"center"}}>{stock.Ticket_Qty}</TableCell>
                <TableCell style={{textAlign:"center"}}>{stock.Ticket_Qty_Buy}</TableCell>
                <TableCell style={{textAlign:"center"}}>{stock.Ticket_Qty_Balance}</TableCell>
                <TableCell>{stock.Event_Name}</TableCell>
              </TableRow>
            ))}
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

export default AllTicketContent;
