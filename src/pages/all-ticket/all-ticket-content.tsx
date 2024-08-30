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
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { getOrderD } from "../../services/order-d.service";
import toast from "react-hot-toast";
import Header from "../common/header"; // Assuming you have a Header component
import { Link as RouterLink } from 'react-router-dom';

const MAX_ITEMS_PER_PAGE = 10;

const AllTicketContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderDData, setOrderDData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    event: "all",
  });
  const [uniqueEvents, setUniqueEvents] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOrderDData() {
      try {
        const data = await getOrderD(); // Fetch data from your service
        
        // Filter out orders where Net_Price is null
        const filteredData = data.filter(order => order.Net_Price !== null);
        
        setOrderDData(filteredData);
        
        // Extract unique event names
        const events = Array.from(new Set(filteredData.map((order: any) => order.Event_Name)));
        setUniqueEvents(events);
      } catch (error) {
        toast.error("Failed to fetch order data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDData();
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

  const filteredOrders = orderDData.filter((order) => {
    const matchesSearch = order.Order_no.includes(filters.search);
    const matchesStatus = filters.status === "all" || order.OrderStatus_Name === filters.status;
    const matchesEvent = filters.event === "all" || order.Event_Name === filters.event;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const ordersInCurrentPage = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / MAX_ITEMS_PER_PAGE);

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-orders-content">
      <Header title="บัตรทั้งหมด" /> {/* Add the header */}
      <div className="filter-options">
        <div className="filter-item">
          <img
            src="/cart.svg"
            alt="คำสั่งซื้อทั้งหมด icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">บัตรทั้งหมด</span>
            <span className="filter-number">{filteredOrders.length}</span> {/* Dynamic total order count */}
          </div>
        </div>
        <div className="filter-item">
          <img
            src="/not-pay.svg"
            alt="ค้างชำระ icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">บัตรที่เปิดขาย</span>
            <span className="filter-number">{`${filteredOrders.length}`}</span> {/* Number of orders with balance / total orders */}
          </div>
        </div>
        <div className="filter-item">
          <img src="/money.svg" alt="ยอดขาย icon" className="filter-icon" />
          <div className="filter-text-container">
            <span className="filter-text" style={{marginLeft:"-50px"}}>บัตรแสกนแล้ว</span>
            <span className="filter-number" style={{fontSize:"20px",marginLeft:"-50px"}}>
              {/* Add logic for scanned tickets here */}
            </span> {/* Net Price / Total Balance formatted in Thai Baht */}
          </div>
        </div>
        <div className="filter-item">
          <img src="/money.svg" alt="ยอดขาย icon" className="filter-icon" />
          <div className="filter-text-container">
            <span className="filter-text" style={{marginLeft:"-50px"}}>ยอดขายรวม</span>
            <span className="filter-number" style={{fontSize:"20px",marginLeft:"-50px"}}>
              {/* Add logic for total sales here */}
            </span> {/* Net Price / Total Balance formatted in Thai Baht */}
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
            placeholder="ค้นหาโดย รหัสสั่งซื้อ"
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
            <InputLabel>สถานะ</InputLabel>
            <Select
              label="สถานะ"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="ขายแล้ว">ขายแล้ว</MenuItem>
              <MenuItem value="รอขาย">รอขาย</MenuItem>
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
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>เลขที่บัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ชื่อบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ประเภทบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>จำนวนที่/บัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ราคาต่อใบ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ราคาทั้งหมด</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>ดูคำสั่งซื้อ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" }}>งาน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersInCurrentPage.map((order, index) => (
              <TableRow key={order.DT_order_id}>
                <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                <TableCell>{order.DT_order_id}</TableCell>
                <TableCell>{order.ticket_no}</TableCell>
                <TableCell>{order.Ticket_Type_Name}</TableCell>
                <TableCell>{order.Ticket_Qty_Per}</TableCell>
                <TableCell>{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(order.Plan_Price)}</TableCell>
                <TableCell>{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(order.Total_Price)}</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/order-detail/${order.Order_id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%', height: '100%' }}
                  >
                    {order.Order_no}
                  </Link>
                </TableCell>
                <TableCell>{order.Event_Name}</TableCell>
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
