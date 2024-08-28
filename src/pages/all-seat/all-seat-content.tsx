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
import { Link as RouterLink } from 'react-router-dom';

const MAX_ITEMS_PER_PAGE = 10;

const AllSeatContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketData, setTicketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    event: "all",
  });

  useEffect(() => {
    async function fetchTicketData() {
      try {
        const data = await getViewTicketList(); // Fetch data from your service
        console.log("API Response:", data); // Log the response to see its structure
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

  const filteredTickets = ticketData.filter((ticket) => {
    const matchesSearch = ticket.ticket_no.includes(filters.search);
    const matchesStatus = filters.status === "all" || ticket.status === filters.status;
    const matchesEvent = filters.event === "all" || ticket.event_name.includes(filters.event);
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const ticketsInCurrentPage = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / MAX_ITEMS_PER_PAGE);

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-seats-content">
      <Header title="ที่นั่งทั้งหมด" /> {/* Add the header */}
      <div className="filters" style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px", marginBottom: "20px" }}>
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            label="ค้นหา"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="ค้นหาโดย เลขที่นั่ง"
            style={{ minWidth: 300, paddingTop: "10px" }}
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
            <InputLabel>สถานะ</InputLabel>
            <Select
              label="สถานะ"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="sold">ขายแล้ว</MenuItem>
              <MenuItem value="pending">รอขาย</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <InputLabel>งาน</InputLabel>
            <Select
              label="งาน"
              name="event"
              value={filters.event}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทุกงาน</MenuItem>
              <MenuItem value="ILLSLICK LIVE">ILLSLICK LIVE</MenuItem>
              <MenuItem value="Concert B">Concert B</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ลำดับ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>งาน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>รหัสที่นั่ง</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ชื่อโซน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ประเภทบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>เลขโต๊ะ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ชื่อที่นั่ง</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>รหัสบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>สถานะ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>เวลาแสกน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ครั้งที่พิมพ์</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>QR CODE</TableCell>
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
                <TableCell>{ticket.ticket_qty}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>
                  <Button
                    component={RouterLink}
                    to={`/order-detail/${ticket.order_id}`}
                    variant="contained"
                    color="primary"
                  >
                    ดูคำสั่งซื้อ
                  </Button>
                </TableCell>
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

export default AllSeatContent;
