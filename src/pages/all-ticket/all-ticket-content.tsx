import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../common/header";
import { getOrderD } from "../../services/order-d.service";
import { formatThaiDate } from "../../lib/util";

const MAX_ITEMS_PER_PAGE = 10;

const AllTicketContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderDData, setOrderDData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    date: "",
    status: "all",
    paymentStatus: "all",
    ticketType: "all",
    search: "",
  });

  useEffect(() => {
    async function fetchOrderDData() {
      try {
        const data = await getOrderD();
        setOrderDData(data);
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

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  const filteredOrders = orderDData
    .filter((order) => {
      const matchesSearch = order.Event_Name.includes(filters.search);
      const matchesStatus = filters.status === "all" || order.Order_Status === parseInt(filters.status);
      const matchesPaymentStatus = filters.paymentStatus === "all" || order.Payment_Status === filters.paymentStatus;
      // Add more filter conditions as needed
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

  const ordersInCurrentPage = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / MAX_ITEMS_PER_PAGE);

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-orders-content">
      <Header title="คำสั่งซื้อทั้งหมด" />
      <div className="filter-options">
        <div className="filter-item">
          <img
            src="/รอจัดงาน.svg"
            alt="รอจัดงาน icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">คำสั่งซื้อทั้งหมด</span>
            <span className="filter-number">300</span>
          </div>
        </div>
        <div className="filter-item">
          <img
            src="/เริ่มงานแล้ว.svg"
            alt="เริ่มงานแล้ว icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">เริ่มงานแล้ว</span>
            <span className="filter-number">2</span>
          </div>
        </div>
        <div className="filter-item">
          <img src="/ปิดงาน.svg" alt="ปิดงาน icon" className="filter-icon" />
          <div className="filter-text-container">
            <span className="filter-text">ปิดงาน</span>
            <span className="filter-number">3</span>
          </div>
        </div>
      </div>
      <div className="filters" style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px", marginBottom: "20px" }}>
        <Stack direction="row" spacing={2}>
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel>สถานะ</InputLabel>
            <Select
              label="สถานะ"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="1">สำเร็จ</MenuItem>
              <MenuItem value="2">กำลังดำเนินการ</MenuItem>
              <MenuItem value="3">ยกเลิก</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <InputLabel>สถานะการชำระเงิน</InputLabel>
            <Select
              label="สถานะการชำระเงิน"
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="paid">จ่ายแล้ว</MenuItem>
              <MenuItem value="pending">ยังไม่จ่าย</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <InputLabel>บัตร</InputLabel>
            <Select
              label="บัตร"
              name="ticketType"
              value={filters.ticketType}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทุกประเภท</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
              <MenuItem value="regular">ปกติ</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            label="ค้นหา"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="ค้นหาโดย รหัสสั่งซื้อ, LINE ID, เบอร์โทรฯ"
            style={{ minWidth: 300 }}
          />
        </Stack>
      </div>

      {/* Table Component */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                ลำดับ
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                รหัสคำสั่งซื้อ
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                ชื่องาน
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                จำนวนบัตร
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                จำนวนที่
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                สถานะ
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                ราคาสุทธิ
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                วันที่สั่งซื้อ
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                ประวัติการชำระเงิน
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersInCurrentPage.map((order: any, index: number) => {
              return (
                <TableRow key={order.DT_order_id}>
                  <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell>{order.Order_no}</TableCell>
                  <TableCell>{order.Event_Name}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        display: 'inline-block',
                        width: '50px',
                        backgroundColor: '#f9f9f9',
                      }}
                    >
                      {order.Web_Qty_Buy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        display: 'inline-block',
                        width: '50px',
                        backgroundColor: '#f9f9f9',
                      }}
                    >
                      {order.Total_stc}
                    </div>
                  </TableCell>
                  <TableCell>{order.OrderStatus_Name}</TableCell>
                  <TableCell>{order.Total_Price}</TableCell>
                  <TableCell>
                    {formatThaiDate({
                      date: order.Order_datetime,
                      option: 'datetime',
                    })}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      ดูประวัติ
                    </Button>
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

export default AllTicketContent;
