import React, { useState, useEffect } from "react";
import {
  Button,
  // CircularProgress,
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
  // Stack,
  Container,
  Grid,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import Header from "../common/header";
// import { getOrderH } from "../../services/order-h.service";
// import { getOrderD } from "../../services/order-d.service";

import { getOrderAll } from "../../services/order-all.service";

import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { DatePicker } from "@mui/x-date-pickers";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

dayjs.extend(buddhistEra);

const MAX_ITEMS_PER_PAGE = 50;

const AllOrderContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHData, setOrderHData] = useState<any[]>([]);
  const [orderDData, setOrderDData] = useState<any[]>([]);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [orderHispayDetail, setOrderHispayDetail] = useState<any[]>([]);
  console.log("orderHispayDetail", orderHispayDetail);

  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [filters, setFilters] = useState({
    orderNo: "",
    eventName: "",
    customerName: "",
    customerPhone: "",
    status: "all",
    paymentStatus: "all",
    ticketType: "all",
  });

  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleDateRangeChange = (start: any, end: any) => {
    setStartDate(start);
    setEndDate(end);
  };

  // const handleClearDates = () => {
  //   setStartDate(null);
  //   setEndDate(null);
  // };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters({
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

  // const handleClick = (pageNumber: number) => {
  //   setCurrentPage(pageNumber);
  // };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  // Combine orderD data with orderH data
  // const combinedOrders = orderHData.map((order) => {
  //   const relatedOrders = order.filter((od) => od.Order_id === order.Order_id);
  //   const totalQtyBuy = relatedOrders.reduce(
  //     (acc, cur) => acc + cur.Web_Qty_Buy,
  //     0
  //   );
  //   const totalStc = relatedOrders.reduce((acc, cur) => acc + cur.Total_stc, 0);
  //   return {
  //     ...order,
  //     totalQtyBuy,
  //     totalStc,
  //   };
  // });

  // Mapping for Order_Status to text
  const statusMap = {
    1: "สำเร็จ",
    2: "มีแก้ไข",
    13: "ขอคืนเงิน",
    3: "ไม่สำเร็จเพราะติด R",
    4: "ไม่สำเร็จจาก Omise",
  };

  const filteredOrders = orderHData
    .filter((order) => {
      const matchesSearch =
        String(order.Event_Name).includes(filters.eventName) &&
        String(order.Order_id).includes(filters.orderNo) &&
        String(order.Cust_name).includes(filters.customerName) &&
        String(order.Cust_tel).includes(filters.customerPhone);

      return matchesSearch;
    })
    .reduce((acc, current) => {
      // Check if we already have an order with the same Order_id
      const existingOrder = acc.find(
        (order) => order.Order_id === current.Order_id
      );

      if (existingOrder) {
        // Compare Payment_Date7, keep the latest one
        const existingPaymentDate = new Date(existingOrder.Payment_Date7);
        const currentPaymentDate = new Date(current.Payment_Date7);

        if (currentPaymentDate > existingPaymentDate) {
          // Replace with the latest order if the current one is newer
          return acc.map((order) =>
            order.Order_id === current.Order_id ? current : order
          );
        }
      } else {
        // If no order with the same Order_id exists, add the current order
        acc.push(current);
      }

      return acc;
    }, []);

  // const filteredOrders2 = orderDData.filter((order) => {
  //   const matchesSearch =
  //     String(order.Event_Name).includes(filters.eventName) &&
  //     String(order.Order_id).includes(filters.orderNo) &&
  //     String(order.Cust_name).includes(filters.customerName) &&
  //     String(order.Cust_tel).includes(filters.customerPhone);
  //   // const mappedStatus = statusMap[order.Order_Status] || "ไม่ระบุ";

  //   // const matchesStatus =
  //   //   filters.status === "all" || mappedStatus === filters.status;

  //   // Payment status logic based on Order_Status and Total_Balance
  //   // let paymentStatusLabel;
  //   // if (order.Order_Status === 1) {
  //   //   paymentStatusLabel = order.Total_Balance === 0 ? "สำเร็จ" : "ค้างจ่าย";
  //   // } else if ([2, 13, 3, 4].includes(order.Order_Status)) {
  //   //   paymentStatusLabel = "ไม่สำเร็จ";
  //   // } else {
  //   //   paymentStatusLabel = "ไม่ระบุ";
  //   // }

  //   // const matchesPaymentStatus =
  //   //   filters.paymentStatus === "all" ||
  //   //   paymentStatusLabel === filters.paymentStatus;

  //   // const orderDate = new Date(order.Order_datetime);
  //   // const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
  //   // const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

  //   // const matchesDateRange =
  //   //   (!start || orderDate >= start) && (!end || orderDate <= end);

  //   return matchesSearch;
  // });

  // const ordersInCurrentPage = filteredOrders.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );

  // const totalPages = Math.ceil(filteredOrders.length / MAX_ITEMS_PER_PAGE);

  // const totalOrders = orderHData.length;

  // const ordersWithBalance = orderHData.filter(
  //   (order) => order.Total_Balance > 0
  // ).length;

  // const totalNetPrice = orderHData.reduce(
  //   (sum, order) => sum + (order.Net_Price || 0),
  //   0
  // );

  // const totalPaySum = orderHData.reduce(
  //   (sum, order) => sum + (order.Total_Pay || 0),
  //   0
  // );

  const navigate = useNavigate();

  const handleViewHistoryClick = (orderId: string) => {
    navigate(`/order-detail/${orderId}`);
  };

  // if (isLoading) return <CircularProgress />;

  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  const handletime = (x) => {
    const adjustedDate = dayjs(x).subtract(7, "hour");
    const formattedDateTime = adjustedDate.format("DD/MM/BBBB - HH:mm น.");
    return formattedDateTime;
  };

  const handleOrderClick = (orderNo) => {
    setSelectedOrderNo(orderNo);

    const latestOrder = orderHData
      .filter((order) => order.Order_no === orderNo) // ต้องคืนค่าเงื่อนไขใน filter
      .reduce((acc, current) => {
        // Check if we already have an order with the same Order_id
        const existingOrder = acc.find(
          (order) => order.Order_id === current.Order_id
        );

        if (existingOrder) {
          // Compare Payment_Date7, keep the latest one
          const existingPaymentDate = new Date(existingOrder.Payment_Date7);
          const currentPaymentDate = new Date(current.Payment_Date7);

          if (currentPaymentDate > existingPaymentDate) {
            // Replace with the latest order if the current one is newer
            return acc.map((order) =>
              order.Order_id === current.Order_id ? current : order
            );
          } else {
            return acc; // Keep the existing order if it's newer or the same
          }
        } else {
          // If no order with the same Order_id exists, add the current order
          acc.push(current);
        }

        return acc;
      }, []);

    console.log("latestOrder:", latestOrder);
    setOrderDetail(latestOrder);

    const h = orderDData
      .filter((order) => order.Order_no === orderNo)
      .sort(
        (a, b) =>
          new Date(a.Payment_Date7).getTime() -
          new Date(b.Payment_Date7).getTime()
      );

    console.log("h:", h);
    setOrderHispayDetail(h);
  };

  function formatNumberWithCommas(number: number | string): string {
    const bath = `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿`;
    return bath;
  }
  // const Numberofseats = orderDetail
  // const Plan_Name = orderDetail
  // const Ticket_Type_Name && TicketNo_List = orderDetail
  // const Event_Name = orderDetail
  // const Event_Time = orderDetail
  // const สถานะคำสั่งซื้อ = orderDetail

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const OrderAll = await getOrderAll();
        console.log("hi:", OrderAll);

        setOrderHData(
          OrderAll?.orderAll.filter((order: any) => order.Net_Price !== null)
        );

        setOrderDData(
          OrderAll?.hisPayment.filter((order: any) => order.Net_Price !== null)
        );
      } catch (error) {
        toast.error("Failed to fetch order data");
      } finally {
        const savedOrderDetail = localStorage.getItem("orderDetail");

        if (savedOrderDetail) {
          handleOrderClick(savedOrderDetail); // เรียก `handleOrderClick` ทันทีหากมีข้อมูลใน `localStorage`
        }
      }
    }

    fetchOrderData();
  }, []);

  return (
    <div className="all-orders-content">
      <Header title="คำสั่งซื้อทั้งหมด" />
      <Container maxWidth={false} sx={{ padding: 1, marginTop: "5px" }}>
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
              }}
            >
              <ShoppingCartIcon
                sx={{ width: 70, height: 70 }}
                alt="คำสั่งซื้อทั้งหมด"
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingLeft: "60px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>
                    คำสั่งซื้อทั้งหมด
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {/* {totalOrders} */}
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
              }}
            >
              <Avatar
                src="/not-pay.svg"
                alt="ค้างชำระ"
                className="filter-icon"
                sx={{ width: 70, height: 70 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingLeft: "60px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>ค้างชำระ</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {/* {`${ordersWithBalance}/${totalOrders}`} */}
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
              }}
            >
              <Avatar
                src="/money.svg"
                alt="ยอดขาย"
                className="filter-icon"
                sx={{ width: 70, height: 70 }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingLeft: "60px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>ยอดขาย</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {/* {`${new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(totalPaySum)} / 
                ${new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalNetPrice)}`} */}
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
        <Container maxWidth={false} sx={{ padding: 2, marginTop: "10px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl sx={{ backgroundColor: "white" }}>
                <DatePicker
                  label="วันที่เริ่มต้น"
                  value={startDate}
                  onChange={(date) => handleDateRangeChange(date, endDate)}
                  format="DD/MM/YYYY"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                        backgroundColor: "white",
                        width: "90px",
                      },
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ backgroundColor: "white" }}>
                <DatePicker
                  label="วันที่สิ้นสุด"
                  value={endDate}
                  onChange={(date) => handleDateRangeChange(startDate, date)}
                  format="DD/MM/YYYY"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                        backgroundColor: "white",
                        width: "90px",
                      },
                    },
                  }}
                />
              </FormControl>

              <Box sx={{ display: "flex", gap: 2 }}>
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
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none",
                        transform: "translateY(5px)",
                        width: "120px",
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
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none", // Remove the inner border
                        transform: "translateY(5px)",
                        width: "120px",
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
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none", // Remove the inner border
                        transform: "translateY(5px)",
                        width: "120px",
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
                    "& .MuiOutlinedInput-root": {
                      "& input": {
                        border: "none", // Remove the inner border
                        transform: "translateY(5px)",
                        width: "120px",
                      },
                    },
                  }}
                />
                <FormControl
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                  style={{ minWidth: 125 }}
                >
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
                    <MenuItem value="ไม่สำเร็จเพราะติด R">
                      ไม่สำเร็จเพราะติด R
                    </MenuItem>
                    <MenuItem value="ไม่สำเร็จจาก Omise">
                      ไม่สำเร็จจาก Omise
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  variant="outlined"
                  sx={{ backgroundColor: "white" }}
                  style={{ minWidth: 125 }}
                >
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
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                  flexShrink: 0,
                }}
              >
                ล้างค่าการค้นหา
              </Button>
            </Box>
          </Box>
        </Container>
      </div>

      {/* Table Component */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40% auto",
          marginLeft: 10,
        }}
      >
        <div>
          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            คำสั่งซื้อทั้งหมด
          </p>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: "0" }}
            style={{ maxHeight: "100vh" }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#11131A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    ลำดับ
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    ชื่องาน
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    เลขคำสั่งซื้อ
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    ชื่อลูกค้า
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    เบอร์โทร
                  </TableCell>
                  {/* <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    สถานะคำสั่งซื้อ
                  </TableCell> */}
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    สถานะการจ่ายเงิน
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order: any, index: number) => {
                  // const formattedEventTime = dayjs(order.Order_datetime)
                  //   .subtract(7, "hour")
                  //   .locale("th")
                  //   .format("D/M/BBBB HH:mm");
                  // const statusLabel =
                  //   statusMap[order.Order_Status] || "ไม่ระบุ"; // Map numeric status to text

                  let paymentStatusLabel;
                  let paymentStatusBgColor;

                  if (order.Order_Status === 1) {
                    if (order.Total_Balance === 0) {
                      paymentStatusLabel = "ชำระครบ";
                      paymentStatusBgColor = "#28a745"; // Green for success
                    } else if (order.Total_Balance > 0) {
                      paymentStatusLabel = "ค้างจ่าย";
                      paymentStatusBgColor = "#ffc107"; // Yellow for pending payment
                    } else {
                      paymentStatusLabel = "ไม่สำเร็จ";
                      paymentStatusBgColor = "#dc3545"; // Red for failure
                    }
                  } else if ([2, 13, 3, 4].includes(order.Order_Status)) {
                    paymentStatusLabel = "ไม่สำเร็จ";
                    paymentStatusBgColor = "#343a40"; // Gray for failure
                  } else {
                    paymentStatusLabel = "ไม่ระบุ";
                    paymentStatusBgColor = "#f8f9fa"; // Light gray for unknown status
                  }

                  return (
                    <TableRow
                      key={order.index}
                      style={{
                        backgroundColor:
                          selectedOrderNo === order.Order_no
                            ? "lightblue"
                            : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOrderClick(order.Order_no)}
                    >
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {order.Event_Name}
                      </TableCell>

                      <TableCell
                        style={{
                          textAlign: "center",
                        }}
                        // onClick={() => handleOrderClick(order.Order_no)}
                      >
                        {order.Order_no}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {order.Cust_name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {order.Cust_tel}
                      </TableCell>
                      {/* <TableCell style={{ textAlign: "center" }}>
                        <div
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            borderRadius: "18px",
                            textAlign: "center",
                            display: "inline-block",
                            width: "100px",
                            backgroundColor: `${order.OrderSetColour}`,
                            color: "#fff",
                            // width: "10px",
                          }}
                        >
                          <p style={{ margin: 0 }}>
                            {order.OrderSetColour === "#13A10E" ? `สำเร็จ` : ""}
                          </p>
                        </div>
                      </TableCell> */}
                      <TableCell style={{ textAlign: "center" }}>
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ marginLeft: 30 }}>
          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            รายละเอียด
          </p>
          <div>
            {orderDetail ? (
              <div>
                <div
                  style={{
                    color: "#000",
                    border: " 1px solid ",
                    padding: 20,
                    width: "45vw",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto auto",
                      marginBottom: 20,
                      justifyItems: "flex-start",
                    }}
                  >
                    <p>
                      <strong>จำนวนที่นั่ง:</strong>
                      <br />
                      {orderDetail.at(0)?.Total_stc}
                    </p>
                    <p>
                      <strong>ชื่อโซน:</strong>
                      <br />
                      {orderDetail.at(0)?.Plan_Name}
                    </p>
                    <p>
                      <strong>
                        ชื่อ
                        {orderDetail.at(0)?.Ticket_Type_Name}:
                      </strong>
                      <br />
                      {orderDetail.at(0)?.TicketNo_List}
                    </p>
                    <p>
                      <strong>ชื่องาน:</strong>
                      <br />
                      {orderDetail.at(0)?.Event_Name}
                    </p>
                    <p>
                      <strong>เวลาเริ่มงาน:</strong>
                      <br />
                      {orderDetail?.length === 0
                        ? ``
                        : handletime(orderDetail.at(0)?.Event_Time)}
                    </p>
                    <p>
                      <strong>สถานะคำสั่งซื้อ:</strong>
                      <br />
                      <span
                        style={{
                          color:
                            orderDetail.at(0)?.OrderStatus_Name === "สำเร็จ"
                              ? "green"
                              : orderDetail.at(0)?.OrderStatus_Name ===
                                "รอดำเนินการ"
                              ? "orange"
                              : orderDetail.at(0)?.OrderStatus_Name ===
                                "จ่ายไม่สำเร็จ"
                              ? "red"
                              : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {orderDetail.at(0)?.OrderStatus_Name}
                      </span>
                    </p>
                  </div>
                  <div
                  // style={{display:"flex",justifyContent:"flex-end"}}
                  >
                    {orderDetail.length !== 0 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleViewHistoryClick(orderDetail.at(0)?.Order_id)
                        }
                      >
                        ดูรายละเอียด
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            ประวัติการชำระเงิน
          </p>
          <div
            style={{
              display: "inline-block",
              maxWidth: "48vw",
              overflowX: "auto",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "0" }}
              style={{ maxHeight: 300, width: "max-content" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#11131A" }}>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ลำดับ
                    </TableCell>

                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      เลขคำสั่งซื้อ
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ยอดสุทธิ
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ยอดจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ยอดค้างจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ประเภทการจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      Charge_Id
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      Ref_Number1
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      วันที่เวลาจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      ธนาคาร
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      สถานะการจ่ายเงิน
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orderHispayDetail.map((order: any, index: number) => {
                    // const formattedEventTime = dayjs(order.Order_datetime)
                    //   .subtract(7, "hour")
                    //   .locale("th")
                    //   .format("D/M/BBBB HH:mm");
                    // const statusLabel =
                    //   statusMap[order.Order_Status] || "ไม่ระบุ"; // Map numeric status to text

                    let paymentStatusLabel;
                    let paymentStatusBgColor;

                    if (order.Order_Status === 1) {
                      if (order.Total_Balance === 0) {
                        paymentStatusLabel = "ชำระครบ";
                        paymentStatusBgColor = "#28a745";
                      } else if (order.Total_Balance > 0) {
                        paymentStatusLabel = "ค้างจ่าย";
                        paymentStatusBgColor = "#ffc107";
                      } else {
                        paymentStatusLabel = "ไม่สำเร็จ";
                        paymentStatusBgColor = "#dc3545";
                      }
                    } else if ([2, 13, 3, 4].includes(order.Order_Status)) {
                      paymentStatusLabel = "ไม่สำเร็จ";
                      paymentStatusBgColor = "#343a40";
                    } else {
                      paymentStatusLabel = "ไม่ระบุ";
                      paymentStatusBgColor = "#f8f9fa";
                    }

                    return (
                      <TableRow
                        key={order.index}
                        style={{
                          // backgroundColor:
                          //   selectedOrderNo === order.Order_no
                          //     ? "lightblue"
                          //     : "inherit",
                          cursor: "pointer",
                        }}
                        // onClick={() => handleOrderClick(order.Order_no)}
                      >
                        <TableCell
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                          }}
                          // onClick={() => handleOrderClick(order.Order_no)}
                        >
                          {order.Order_no}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {formatNumberWithCommas(order.Net_Price)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {formatNumberWithCommas(order.Total_Pay)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {formatNumberWithCommas(order.Total_Balance)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Pay_By_Name}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Charge_Id}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Ref_Number1}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {handletime(order.Payment_Date7)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Pay_By_BankName}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      <div
        style={{ marginTop: "18px", display: "flex", justifyContent: "center" }}
      >
        {/* <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => handleClick(page)}
          color="primary"
        /> */}
      </div>
    </div>
  );
};

export default AllOrderContent;
