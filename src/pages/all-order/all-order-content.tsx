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
import { getOrderH } from "../../services/order-h.service";
import { getOrderD } from "../../services/order-d.service";
import { formatThaiDate } from "../../lib/util";
import { Link } from 'react-router-dom';

const MAX_ITEMS_PER_PAGE = 10;

const AllOrderContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHData, setOrderHData] = useState<any[]>([]);
  const [orderDData, setOrderDData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const navigate = useNavigate();

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
    // Determine the status based on the Order_Status and Total_Balance
    let statusLabel;
    let paymentStatusLabel;
  
    if (order.Order_Status === 1 && order.Total_Balance === 0) {
      statusLabel = "สำเร็จ";
      paymentStatusLabel = "จ่ายครบ"; // Paid in full
    } else if (order.Order_Status === 1 && order.Total_Balance > 0) {
      statusLabel = "ค้างจ่าย";
      paymentStatusLabel = "ค้างจ่าย"; // Payment pending
    } else if (order.Order_Status === 2) {
      statusLabel = "มีแก้ไข";
      paymentStatusLabel = order.Total_Balance > 0 ? "ค้างจ่าย" : "จ่ายครบ";
    } else if (order.Order_Status === 13) {
      statusLabel = "ขอคืนเงิน";
      paymentStatusLabel = "ค้างจ่าย"; // Assuming refund is treated as pending
    } else if (order.Order_Status === 3) {
      statusLabel = "ไม่สำเร็จเพราะติด R";
      paymentStatusLabel = "ค้างจ่าย";
    } else if (order.Order_Status === 4) {
      statusLabel = "ไม่สำเร็จจาก Omise";
      paymentStatusLabel = "ค้างจ่าย";
    } else {
      statusLabel = "ไม่ระบุ";
      paymentStatusLabel = "ค้างจ่าย"; // Default to pending if status is unknown
    }
  
    const matchesSearch =
      order.Event_Name.includes(filters.eventName) &&
      order.Order_no.includes(filters.orderNo) &&
      order.Cust_name.includes(filters.customerName) &&
      order.Cust_tel.includes(filters.customerPhone);
  
    const matchesStatus =
      filters.status === "all" || statusLabel === filters.status;
  
    const matchesPaymentStatus =
      filters.paymentStatus === "all" ||
      paymentStatusLabel === filters.paymentStatus;
  
    // Add date range filtering here if needed
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const ordersInCurrentPage = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / MAX_ITEMS_PER_PAGE);

  // Calculate the number of orders with a balance and total orders
  const totalOrders = orderHData.length;
  const ordersWithBalance = orderHData.filter((order) => order.Total_Balance > 0).length;
  
  // Calculate the total net price and total balance for the overall sales data
  const totalNetPrice = orderHData.reduce((sum, order) => sum + (order.Net_Price || 0), 0);
  const totalBalanceSum = orderHData.reduce((sum, order) => sum + (order.Total_Balance || 0), 0);

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
            <span className="filter-text" style={{marginLeft:"-50px"}}>ยอดขาย</span>
            <span className="filter-number" style={{fontSize:"20px",marginLeft:"-50px"}}>
              {`${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalBalanceSum)} / 
                ${new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalNetPrice)}`}
            </span> {/* Net Price / Total Balance formatted in Thai Baht */}
          </div>
        </div>
      </div>
      <div className="filters" style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px", marginBottom: "20px" }}>
        <Stack direction="row" spacing={2}>
        <TextField
            variant="outlined"
            label="ช่วงเวลาสั่งซื้อ จาก"
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleSearchChange}
            InputLabelProps={{
              shrink: true,
            }}
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
          <TextField
            variant="outlined"
            label="ถึง"
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleSearchChange}
            InputLabelProps={{
              shrink: true,
            }}
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
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel>สถานะ</InputLabel>
            <Select
              label="สถานะ"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="สำเร็จ">สำเร็จ</MenuItem>
              <MenuItem value="ค้างจ่าย">ค้างจ่าย</MenuItem>
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
              <MenuItem value="จ่ายครบ">จ่ายครบ</MenuItem>
              <MenuItem value="ค้างจ่าย">ค้างจ่าย</MenuItem>
            </Select>
          </FormControl>

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
                เลขคำสั่งซื้อ
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                ชื่อลูกค้า
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "20px" }}>
                เบอร์โทร
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
              <TableCell style={{ fontWeight: "bold", fontSize: "20px", paddingLeft:"40px"}}>
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
              // Determine the status based on the Order_Status and Total_Balance
              let statusLabel;
              let bgColor;

              if (order.Order_Status === 1 && order.Total_Balance === 0) {
                statusLabel = "สำเร็จ";
                bgColor = "#28a745"; // Green for success
              } else if (order.Order_Status === 1 && order.Total_Balance > 0) {
                statusLabel = "ค้างจ่าย";
                bgColor = "#ffc107"; // Yellow for pending payment
              } else if (order.Order_Status === 2) {
                statusLabel = "มีแก้ไข";
                bgColor = "#17a2b8"; // Blue for modifications
              } else if (order.Order_Status === 13) {
                statusLabel = "ขอคืนเงิน";
                bgColor = "#dc3545"; // Red for refund
              } else if (order.Order_Status === 3) {
                statusLabel = "ไม่สำเร็จเพราะติด R";
                bgColor = "#343a40"; // Dark gray for failure due to R
              } else if (order.Order_Status === 4) {
                statusLabel = "ไม่สำเร็จจาก Omise";
                bgColor = "#6c757d"; // Gray for Omise failure
              } else {
                statusLabel = "ไม่ระบุ";
                bgColor = "#f8f9fa"; // Light gray for unknown status
              }

              return (
                <TableRow key={order.Order_id}>
                  <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell>
                    <Link to={`/order-detail/${order.Order_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {order.Order_no}
                    </Link>
                  </TableCell>
                  <TableCell>{order.Cust_name}</TableCell>
                  <TableCell>{order.Cust_tel}</TableCell>
                  <TableCell>{order.Event_Name}</TableCell>
                  <TableCell>
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
                  <TableCell>
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
                  <TableCell>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "20px",
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
                  <TableCell style={{ paddingLeft: "40px" }}>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(order.Net_Price)}
                  </TableCell>
                  <TableCell>
                    {formatThaiDate({
                      date: order.Order_datetime,
                      option: "datetime",
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

export default AllOrderContent;

