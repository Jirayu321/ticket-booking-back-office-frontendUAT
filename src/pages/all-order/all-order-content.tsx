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
import Header from "../common/header";
import { getOrderH } from "../../services/order-h.service";
import { getOrderD } from "../../services/order-d.service";
import { Link, useNavigate } from "react-router-dom";
import StartEndDatePickers from "../../components/common/input/date-picker/date";
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

const MAX_ITEMS_PER_PAGE = 50;

const AllOrderContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHData, setOrderHData] = useState<any[]>([]);
  const [orderDData, setOrderDData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    startDate: null, // Start date for filtering
    endDate: null,   // End date for filtering
    orderNo: "",
    eventName: "",
    customerName: "",
    customerPhone: "",
    status: "all",
    paymentStatus: "all",
    ticketType: "all",
  });

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const orderH = await getOrderH();
        const orderD = await getOrderD();
        setOrderHData(orderH.filter((order) => order.Net_Price !== null)); // Only include orders with a non-null Net_Price
        setOrderDData(orderD);
      } catch (error) {
        toast.error("Failed to fetch order data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleDateRangeChange = (startDate: any, endDate: any) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleClearDates = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };
  const handleClearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      orderNo: "",
      eventName: "",
      customerName: "",
      customerPhone: "",
      status: "all",
      paymentStatus: "all",
      ticketType: "all",
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  // Combine orderD data with orderH data
  const combinedOrders = orderHData.map((order) => {
    const relatedOrders = orderDData.filter((od) => od.Order_id === order.Order_id);
    const totalQtyBuy = relatedOrders.reduce((acc, cur) => acc + cur.Web_Qty_Buy, 0);
    const totalStc = relatedOrders.reduce((acc, cur) => acc + cur.Total_stc, 0);

    return {
      ...order,
      totalQtyBuy,
      totalStc,
    };
  });

  const filteredOrders = combinedOrders.filter((order) => {
    const matchesSearch =
      order.Event_Name.includes(filters.eventName) &&
      order.Order_no.includes(filters.orderNo) &&
      order.Cust_name.includes(filters.customerName) &&
      order.Cust_tel.includes(filters.customerPhone);
  
    const matchesStatus =
      filters.status === "all" || order.OrderStatus_Name === filters.status;
  
    let paymentStatusLabel;
    if (order.Order_Status === 1) {
      paymentStatusLabel = order.Total_Balance === 0 ? "สำเร็จ" : "ค้างจ่าย";
    } else if (
      order.Order_Status === 2 ||
      order.Order_Status === 13 ||
      order.Order_Status === 3 ||
      order.Order_Status === 4
    ) {
      paymentStatusLabel = "ไม่สำเร็จ";
    } else {
      paymentStatusLabel = "ไม่ระบุ";
    }
  
    const matchesPaymentStatus =
      filters.paymentStatus === "all" || paymentStatusLabel === filters.paymentStatus;
  
    const orderDate = new Date(order.Order_datetime);
    const startDate = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = filters.endDate ? new Date(filters.endDate).setHours(23, 59, 59, 999) : null;
  
    const matchesDateRange =
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= endDate);
  
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  });

  const ordersInCurrentPage = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / MAX_ITEMS_PER_PAGE);

  // Calculate the number of orders with a balance and total orders
  const totalOrders = orderHData.length;
  const ordersWithBalance = orderHData.filter((order) => order.Total_Balance > 0).length;

  // Calculate the total net price and total balance for the overall sales data
  const totalNetPrice = orderHData.reduce((sum, order) => sum + (order.Net_Price || 0), 0);
  const totalPaySum = orderHData.reduce((sum, order) => sum + (order.Total_Pay || 0), 0);
  const navigate = useNavigate();
  
  const handleViewHistoryClick = (orderId: string) => {
    navigate(`/order-detail/${orderId}?tabIndex=1`);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <div className="all-orders-content">
      <Header title="คำสั่งซื้อทั้งหมด" />
      <div className="filter-options">
        <div className="filter-item">
          <img
            src="/cart.svg"
            alt="คำสั่งซื้อทั้งหมด icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">คำสั่งซื้อทั้งหมด</span>
            <span className="filter-number">{totalOrders}</span> {/* Dynamic total order count */}
          </div>
        </div>
        <div className="filter-item">
          <img
            src="/not-pay.svg"
            alt="ค้างชำระ icon"
            className="filter-icon"
          />
          <div className="filter-text-container">
            <span className="filter-text">ค้างชำระ</span>
            <span className="filter-number">{`${ordersWithBalance}/${totalOrders}`}</span> {/* Number of orders with balance / total orders */}
          </div>
        </div>
        <div className="filter-item">
          <img src="/money.svg" alt="ยอดขาย icon" className="filter-icon" />
          <div className="filter-text-container">
            <span className="filter-text" style={{ marginLeft: "-50px" }}>ยอดขาย</span>
            <span className="filter-number" style={{ fontSize: "18px", marginLeft: "-50px" }}>
              {`${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalPaySum)} / 
                ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalNetPrice)}`}
            </span> {/* Net Price / Total Balance formatted in Thai Baht */}
          </div>
        </div>
      </div>
      <div className="filters" style={{ padding: "18px", backgroundColor: "white", borderRadius: "5px", marginBottom: "18px" }}>
        <Stack direction="row" spacing={2}>
          <StartEndDatePickers
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(date) => handleDateRangeChange(date, filters.endDate)}
            onEndDateChange={(date) => handleDateRangeChange(filters.startDate, date)}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClearFilters}
            style={{ marginTop: "8px" }}
          >
            Clear
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} marginTop={2}>
          <TextField
            variant="outlined"
            label="เลขคำสั่งซื้อ"
            name="orderNo"
            value={filters.orderNo}
            onChange={handleSearchChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  border: 'none', // Remove the inner border
                  transform: 'translateY(5px)',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            label="ชื่องาน"
            name="eventName"
            value={filters.eventName}
            onChange={handleSearchChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  border: 'none', // Remove the inner border
                  transform: 'translateY(5px)',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            label="ชื่อลูกค้า"
            name="customerName"
            value={filters.customerName}
            onChange={handleSearchChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  border: 'none', // Remove the inner border
                  transform: 'translateY(5px)',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            label="เบอร์โทร"
            name="customerPhone"
            value={filters.customerPhone}
            onChange={handleSearchChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& input': {
                  border: 'none', // Remove the inner border
                  transform: 'translateY(5px)',
                },
              },
            }}
          />
          <FormControl variant="outlined" style={{ minWidth: 118 }}>
            <InputLabel>สถานะคำสั่งซื้อ</InputLabel>
            <Select
              label="สถานะ"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="สำเร็จ">สำเร็จ</MenuItem>
              <MenuItem value="มีแก้ไข">มีแก้ไข</MenuItem>
              <MenuItem value="ขอคืนเงิน">ขอคืนเงิน</MenuItem>
              <MenuItem value="ไม่สำเร็จเพราะติด R">ไม่สำเร็จเพราะติด R</MenuItem>
              <MenuItem value="ไม่สำเร็จจาก Omise">ไม่สำเร็จจาก Omise</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <InputLabel>สถานะจ่าย</InputLabel>
            <Select
              label="สถานะจ่าย"
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="สำเร็จ">จ่ายครบ</MenuItem>
              <MenuItem value="ค้างจ่าย">ค้างจ่าย</MenuItem>
              <MenuItem value="ไม่สำเร็จ">ไม่สำเร็จ</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </div>

      {/* Table Component */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>ลำดับ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>เลขคำสั่งซื้อ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>ชื่อลูกค้า</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>เบอร์โทร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>ชื่องาน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>จำนวนบัตร</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>จำนวนที่</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px",textAlign:"center"}}>สถานะคำสั่งซื้อ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px",textAlign:"center" }}>สถานะการจ่ายเงิน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>ราคาสุทธิ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px",textAlign:"center" }}>วันที่สั่งซื้อ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px" ,textAlign:"center"}}>ประวัติการชำระเงิน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersInCurrentPage.map((order: any, index: number) => {
              const formattedEventTime = dayjs(order.Order_datetime)
              .subtract(7, 'hour')
              .locale('th')
              .format('D/M/BBBB HH:mm');
              // Order status and background color based on OrderStatus_Name and OrderSetColour
              const statusLabel = order.OrderStatus_Name;
              const bgColor = order.OrderSetColour;

              // Payment status logic based on Order_Status and Total_Balance
              let paymentStatusLabel;
              let paymentStatusBgColor;

              if (order.Order_Status === 1) {
                if (order.Total_Balance === 0) {
                  paymentStatusLabel = "สำเร็จ";
                  paymentStatusBgColor = "#28a745"; // Green for success
                } else if (order.Total_Balance > 0) {
                  paymentStatusLabel = "ค้างจ่าย";
                  paymentStatusBgColor = "#ffc107"; // Yellow for pending payment
                } else {
                  paymentStatusLabel = "ไม่สำเร็จ";
                  paymentStatusBgColor = "#dc3545"; // Red for failure
                }
              } else if (order.Order_Status === 2) {
                paymentStatusLabel = "ไม่สำเร็จ";
                paymentStatusBgColor = "#343a40"; // Blue for modifications
              } else if (order.Order_Status === 13) {
                paymentStatusLabel = "ไม่สำเร็จ";
                paymentStatusBgColor = "#343a40"; // Red for refund
              } else if (order.Order_Status === 3) {
                paymentStatusLabel = "ไม่สำเร็จ";
                paymentStatusBgColor = "#343a40"; // Dark gray for failure due to R
              } else if (order.Order_Status === 4) {
                paymentStatusLabel = "ไม่สำเร็จ";
                paymentStatusBgColor = "#343a40"; // Gray for Omise failure
              } else {
                paymentStatusLabel = "ไม่ระบุ";
                paymentStatusBgColor = "#f8f9fa"; // Light gray for unknown status
              }

              return (
                <TableRow key={order.Order_id}>
                  <TableCell style={{textAlign:"center"}}>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell style={{textAlign:"center"}}>
                    <Link to={`/order-detail/${order.Order_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      {order.Order_no}
                    </Link>
                  </TableCell>
                  <TableCell style={{textAlign:"center"}}>{order.Cust_name}</TableCell>
                  <TableCell style={{textAlign:"center"}}>{order.Cust_tel}</TableCell>
                  <TableCell style={{textAlign:"center"}}>{order.Event_Name}</TableCell>
                  <TableCell style={{textAlign:"center"}}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "4px",
                        textAlign: "center",
                        display: "inline-block",
                        width: "50px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {order.totalQtyBuy} {/* จำนวนบัตร */}
                    </div>
                  </TableCell>
                  <TableCell style={{textAlign:"center"}}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "4px",
                        textAlign: "center",
                        display: "inline-block",
                        width: "50px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {order.totalStc} {/* จำนวนที่ */}
                    </div>
                  </TableCell>
                  <TableCell style={{textAlign:"center"}}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "18px",
                        textAlign: "center",
                        display: "inline-block",
                        width: "100px",
                        backgroundColor: bgColor,
                        color: "#fff",
                      }}
                    >
                      {statusLabel}
                    </div>
                  </TableCell>
                  <TableCell style={{textAlign:"center"}}>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "18px",
                        textAlign: "center",
                        display: "inline-block",
                        width: "100px",
                        backgroundColor: paymentStatusBgColor,
                        color: "#fff",
                      }}
                    >
                      {paymentStatusLabel}
                    </div>
                  </TableCell>
                  <TableCell style={{textAlign:"right"}}>
                    {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(order.Net_Price)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {formattedEventTime}
                  </TableCell>
                  <TableCell style={{textAlign:"center"}}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewHistoryClick(order.Order_id)} // Pass the appropriate order.Order_id
                    >
                      ดูประวัติ
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "18px", display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={currentPage} onChange={(_, page) => handleClick(page)} color="primary" />
      </div>
    </div>
  );
};

export default AllOrderContent;
