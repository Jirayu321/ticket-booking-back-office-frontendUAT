import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  // CircularProgress,
  // Pagination,
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
  Modal,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import Header from "../common/header";
import OrderDetailContent from "../order-detail/order-detail-content";
// import { getOrderH } from "../../services/order-h.service";
// import { getOrderD } from "../../services/order-d.service";

import { getOrderAll } from "../../services/order-all.service";
import { getAllEventList } from "../../services/event-list.service";

import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import "moment/locale/th";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const MAX_ITEMS_PER_PAGE = 50;

const AllOrderContent: React.FC = () => {
  moment.locale("th");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderHData, setOrderHData] = useState<any[]>([]);
  const [orderDData, setOrderDData] = useState<any[]>([]);
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [orderHispayDetail, setOrderHispayDetail] = useState<any[]>([]);
  const [evntDetail, setEvntDetail] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
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

    // อัปเดต state filters
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [name as string]: value,
      };

      // เก็บค่า filters ใหม่ใน localStorage
      localStorage.setItem("filters", JSON.stringify(updatedFilters));

      return updatedFilters;
    });
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start ?? undefined); // ตรวจสอบว่าค่าเป็น null หรือ undefined
    setEndDate(end ?? undefined);
  };

  console.log("handleDateRangeChange", startDate, endDate);
  // const handleClearDates = () => {
  //   setStartDate(null);
  //   setEndDate(null);
  // };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [event.target.name]: event.target.value,
      };

      // เก็บค่า filters ใหม่ใน localStorage
      localStorage.setItem("filters", JSON.stringify(updatedFilters));

      return updatedFilters;
    });
  };

  // const handleClick = (pageNumber: number) => {
  //   setCurrentPage(pageNumber);
  // };

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

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
        String(order.Event_Name)
          .toLowerCase()
          .includes(filters.eventName.toLowerCase()) &&
        String(order.Order_no)
          .toLowerCase()
          .includes(filters.orderNo.toLowerCase()) &&
        String(order.Cust_name)
          .toLowerCase()
          .includes(filters.customerName.toLowerCase()) &&
        String(order.Cust_tel)
          .toLowerCase()
          .includes(filters.customerPhone.toLowerCase());

      const mstchesStatusOrder =
        (filters.status === "สำเร็จ" && order.Order_Status === 1) ||
        (filters.status === "มีแก้ไข" && order.Order_Status === 2) ||
        (filters.status === "ขอคืนเงิน" && order.Order_Status === 13) ||
        (filters.status === "ไม่สำเร็จเพราะติด R" &&
          order.Order_Status === 3) ||
        (filters.status === "ไม่สำเร็จจาก Omise" && order.Order_Status === 4) ||
        filters.status === "all";

      const mstchesStatusPayment =
        (filters.paymentStatus === "สำเร็จ" && order.Total_Balance === 0) ||
        (filters.paymentStatus === "ค้างจ่าย" && order.Total_Balance !== 0) ||
        filters.paymentStatus === "all";

      return matchesSearch && mstchesStatusOrder && mstchesStatusPayment;
    })
    .reduce((acc, current) => {
      const existingOrder = acc.find(
        (order) => order.Order_id === current.Order_id
      );

      if (existingOrder) {
        const existingPaymentDate = new Date(existingOrder.Payment_Date7);
        const currentPaymentDate = new Date(current.Payment_Date7);

        if (currentPaymentDate > existingPaymentDate) {
          return acc.map((order) =>
            order.Order_id === current.Order_id ? current : order
          );
        }
      } else {
        acc.push(current);
      }

      return acc;
    }, []);

  // const navigate = useNavigate();

  const handleViewHistoryClick = (orderId: string) => {
    localStorage.setItem("orderId", orderId);
    setModalOpen(true);
    // navigate(`/order-detail/${orderId}`);
  };

  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  const handletime = (x) => {
    const adjustedDate = dayjs(x).subtract(7, "hour");
    const formattedDateTime = adjustedDate.format("DD/MM/BBBB - HH:mm น.");
    return formattedDateTime;
  };

  const handleOrderClick = (orderNo: any) => {
    localStorage.setItem("orderDetail", orderNo);
    setSelectedOrderNo(orderNo);
    console.log("orderHData", orderHData);

    const latestOrders = Object.values(
      orderHData
        .filter((order) => order.Order_no === orderNo)
        .reduce((acc, current) => {
          const key = current.Event_Stc_id;

          if (!acc[key]) {
            acc[key] = current;
          } else {
            const existingPaymentDate = new Date(acc[key].Payment_Date7);
            const currentPaymentDate = new Date(current.Payment_Date7);
            if (currentPaymentDate > existingPaymentDate) {
              acc[key] = current;
            }
          }

          return acc;
        }, {})
    );

    console.log("latestOrder:", latestOrders);
    setOrderDetail(latestOrders);

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

  const handleOrderprevData = (orderNo: any, data: any, orderDData: any) => {
    localStorage.setItem("orderDetail", orderNo);
    setSelectedOrderNo(orderNo);
    console.log("orderHData", orderHData);

    const latestOrder = data
      .filter((order) => order.Order_no === orderNo) // ต้องคืนค่าเงื่อนไขใน filter
      .reduce((acc, current) => {
        const existingOrder = acc.find(
          (order) => order.Order_id === current.Order_id
        );

        if (existingOrder) {
          const existingPaymentDate = new Date(existingOrder.Payment_Date7);
          const currentPaymentDate = new Date(current.Payment_Date7);

          if (currentPaymentDate > existingPaymentDate) {
            return acc.map((order) =>
              order.Order_id === current.Order_id ? current : order
            );
          } else {
            return acc;
          }
        } else {
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
    const bath = `${number
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿`;
    return bath;
  }

  async function fetchOrderData() {
    try {
      const OrderAll = await getOrderAll();
      const evntDetailAll = await getAllEventList();
      console.log("fetchOrderData", OrderAll);
      console.log("evntDetailAll:", evntDetailAll);

      setEvntDetail(
        evntDetailAll?.events.filter((event: any) => event.Event_Public === "Y")
      );
      setOrderHData(
        OrderAll?.orderAll.filter((order: any) => order.Net_Price !== null)
      );

      setOrderDData(
        OrderAll?.hisPayment.filter((order: any) => order.Net_Price !== null)
      );
      const savedOrderDetail = localStorage.getItem("orderDetail");
      const savedOrderDetailFilter = localStorage.getItem("filters");
      if (savedOrderDetail && savedOrderDetailFilter) {
        const x = OrderAll?.orderAll.filter(
          (order: any) => order.Net_Price !== null
        );
        const y = OrderAll?.hisPayment.filter(
          (order: any) => order.Net_Price !== null
        );
        setFilters(JSON.parse(savedOrderDetailFilter));
        handleOrderprevData(savedOrderDetail, x, y);
      } else if (savedOrderDetail) {
        console.log("hi2");
        const x = OrderAll?.orderAll.filter(
          (order: any) => order.Net_Price !== null
        );
        const y = OrderAll?.hisPayment.filter(
          (order: any) => order.Net_Price !== null
        );
        handleOrderprevData(savedOrderDetail, x, y);
      } else if (savedOrderDetailFilter) {
        setFilters(JSON.parse(savedOrderDetailFilter));
      }
    } catch (error) {
      toast.error("Failed to fetch order data");
    } finally {
      console.log("มาหน้านี้โหลดข้อมูลเสร็จละ");
    }
  }

  useEffect(() => {
    fetchOrderData();
  }, []);

  const totalOrders = filteredOrders?.length;

  const OutstandingPayment = filteredOrders
    .filter((order) => order.Total_Balance !== 0)
    .reduce((sum, order) => sum + order.Total_Balance, 0);

  const dataP = Object.values(
    orderHData
      .filter((order) => order.Event_Id === filteredOrders[0]?.Event_Id)
      .reduce((acc, current) => {
        const key = current.DT_order_id;

        if (!acc[key]) {
          acc[key] = current;
        } else {
          const existingPaymentDate = new Date(acc[key].Payment_Date7);
          const currentPaymentDate = new Date(current.Payment_Date7);
          if (currentPaymentDate > existingPaymentDate) {
            acc[key] = current;
          }
        }

        return acc;
      }, {})
  );

  const totalNetPriceWithZeroBalance = dataP?.reduce<number>(
    (sum, order) => sum + order.Web_Qty_Buy * order.Total_Price,
    0
  );

  console.log(
    "totalNetPriceWithZeroBalance",
    totalNetPriceWithZeroBalance,
    dataP
  );

  console.log("totalNetPriceWithNonZeroBalance", OutstandingPayment);

  const totalNetPrice = totalNetPriceWithZeroBalance - OutstandingPayment;

  console.log("totalNetPrice", totalNetPrice);

  const handleClearFilters = () => {
    setStartDate((prevStartDate) =>
      prevStartDate !== null ? prevStartDate : null
    );

    setFilters((prevFilters) => ({
      orderNo: prevFilters.orderNo !== "" ? prevFilters.orderNo : "",
      eventName: prevFilters.eventName !== "" ? prevFilters.eventName : "",
      customerName:
        prevFilters.customerName !== "" ? prevFilters.customerName : "",
      customerPhone:
        prevFilters.customerPhone !== "" ? prevFilters.customerPhone : "",
      status: prevFilters.status !== "all" ? prevFilters.status : "all",
      paymentStatus:
        prevFilters.paymentStatus !== "all" ? prevFilters.paymentStatus : "all",
      ticketType:
        prevFilters.ticketType !== "all" ? prevFilters.ticketType : "all",
    }));
    // setSelectedOrderNo(null);
    // setOrderDetail([]);
    // setOrderHispayDetail([]);
    // localStorage.removeItem("orderDetail");

    fetchOrderData();
  };

  const totalSeats = orderDetail?.reduce(
    (sum, order) => sum + order.Total_stc,
    0
  );
  const totalPrice = orderDetail?.reduce(
    (sum, order) => sum + order.Total_Price,
    0
  );

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    const formatBuddhistYear = (dateString) => {
      console.log("Input dateString:", dateString);

      // แยกวันที่ช่วงวันที่ออกจากกัน (ถ้ามี)
      const [startDateStr, endDateStr] = dateString.split(" - ");

      // ตรวจสอบว่ามีค่า startDateStr หรือไม่
      if (!startDateStr) {
        return "Invalid date";
      }

      // แปลง startDateStr เป็น moment object
      const parsedStartDate = moment(
        startDateStr,
        ["YYYY-MM-DD", "DD/MM/YYYY"],
        true
      );
      if (!parsedStartDate.isValid()) {
        console.error("Invalid start date format detected for:", startDateStr);
        return "Invalid date"; // แสดง error ถ้า startDateStr ไม่สามารถแปลงได้
      }

      // แปลง endDateStr เป็น moment object ถ้ามีค่า
      let parsedEndDate = null;
      if (endDateStr) {
        parsedEndDate = moment(endDateStr, ["YYYY-MM-DD", "DD/MM/YYYY"], true);
        if (!parsedEndDate.isValid()) {
          console.error("Invalid end date format detected for:", endDateStr);
          return ""; // แสดง error ถ้า endDateStr ไม่สามารถแปลงได้
        }
      }

      console.log("Parsed startDate using moment:", parsedStartDate);
      if (parsedEndDate) {
        console.log("Parsed endDate using moment:", parsedEndDate);
      }

      const formattedStartDate = parsedStartDate
        .format("DD/MM/YYYY")
        .replace(/\d{4}/, (year) => (parseInt(year) + 543).toString());

      let formattedEndDate = null;
      if (parsedEndDate) {
        formattedEndDate = parsedEndDate
          .format("DD/MM/YYYY")
          .replace(/\d{4}/, (year) => (parseInt(year) + 543).toString());
      }

      if (formattedEndDate) {
        return `${formattedStartDate} - ${formattedEndDate}`;
      }

      return formattedStartDate;
    };

    return (
      <input
        style={{
          padding: "10px",
          borderRadius: "4px",
          border: "none",
          fontSize: "16px",
          width: "200px",
          height: "30px",
          textAlign: "start",
          outline: "none",
        }}
        onClick={onClick}
        ref={ref}
        value={value ? formatBuddhistYear(value) : ""}
        readOnly
      />
    );
  });

  // const formattedDate = format(new Date(), "MMMM", { locale: th });

  return (
    <div
      className="all-orders-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
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
                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {totalOrders}
                    </Typography>
                  ) : null}
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

                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {formatNumberWithCommas(totalNetPrice)}
                    </Typography>
                  ) : null}
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
                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {formatNumberWithCommas(OutstandingPayment)}
                    </Typography>
                  ) : null}
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
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                style={{ minWidth: 125 }}
              >
                <InputLabel>ชื่องาน</InputLabel>
                <Select
                  label="ชื่องาน"
                  name="eventName"
                  value={filters.eventName}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {evntDetail.map((item, index) => (
                    <MenuItem key={index + 1} value={item.Event_Name}>
                      {item.Event_Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <FormControl sx={{ backgroundColor: "white" }}> */}
              {/* <DatePicker
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
                        height: 30,
                      },
                    },
                  }}
                /> */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #bebebf",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  position: "relative",
                  minWidth: "0",
                  padding: "0",
                  margin: "0",
                }}
              >
                <label
                  htmlFor="custom-datepicker"
                  style={{
                    fontSize: "1rem",
                    marginBottom: "0px",
                    fontWeight: 400,
                    color: "rgba(0, 0, 0, 0.6)",
                    fontFamily: '"Noto Sans Thai", sans-serif',
                    lineHeight: "1.4375em",
                    padding: 0,
                    position: "absolute",
                    display: "block",
                    transformOrigin: "top left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    left: "0px",
                    top: "0px",
                    transform: "translate(14px, -9px) scale(0.75)",
                    background: "#f6f7f7",
                    width: "fit-content",
                    zIndex: 1,
                  }}
                >
                  ช่วงระยะเวลา
                </label>

                <DatePicker
                  id="custom-datepicker"
                  selected={startDate}
                  onChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  locale={th}
                  // isClearable={true}
                  selectsRange
                  customInput={<CustomInput />}
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div
                      style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        style={{ fontSize: 18 }}
                      >
                        {"<"}
                      </button>
                      <span style={{ fontSize: 16 }}>
                        {format(date, "MMMM", { locale: th })}{" "}
                        {moment(date).year() + 543}
                      </span>
                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        style={{ fontSize: 18 }}
                      >
                        {">"}
                      </button>
                    </div>
                  )}
                />
              </div>

              {/* </FormControl> */}
              <FormControl sx={{ backgroundColor: "white" }}>
                {/* <DatePicker
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
                        height: 30,
                      },
                    },
                  }}
                /> */}
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
                        height: 30,
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
                        height: 30,
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
                        height: 30,
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
                ค้นหา
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
          maxHeight: "70vh",
          overflowY: "auto",
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
            <Table
              sx={{
                tableLayout: "fixed", // บังคับให้ตารางใช้ layout แบบ fixed
                width: "100%", // กำหนดความกว้างของตารางให้เต็ม
              }}
            >
              <TableHead sx={{ backgroundColor: "#11131A" }}>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      width: "40px", // กำหนดความกว้างให้แคบ
                      minWidth: "40px", // ความกว้างขั้นต่ำ
                      maxWidth: "40px", // ความกว้างสูงสุด
                      padding: "5px", // ลด padding เพื่อให้คอลัมน์เล็กลง
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
                      width: "20%", // ใช้ความกว้างแบบสัดส่วน
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
                      width: "20%",
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
                      width: "20%",
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
                      width: "15%",
                    }}
                  >
                    เบอร์โทร
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      width: "15%",
                    }}
                  >
                    สถานะการจ่ายเงิน
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order: any, index: number) => {
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
                      key={index}
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
                          width: "40px",
                          padding: "5px", // ลด padding เพื่อให้ช่องลำดับแคบลง
                        }}
                      >
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.Event_Name}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {order.Order_no}
                      </TableCell>
                      <TableCell
                        style={{ textAlign: "center", whiteSpace: "nowrap" }}
                      >
                        {order.Cust_name}
                      </TableCell>
                      <TableCell
                        style={{ textAlign: "center", whiteSpace: "nowrap" }}
                      >
                        {order.Cust_tel}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <div
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            borderRadius: "18px",
                            textAlign: "center",
                            display: "inline-block",
                            width: "60px",
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
                      gridTemplateColumns: "auto auto auto auto auto  auto",
                      marginBottom: 20,
                      justifyItems: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {/* <p>
                      <strong>ชื่อโซน:</strong>
                      <br />
                      {orderDetail.at(0)?.Plan_Name}
                    </p> */}
                    {/* <p>
                      <strong>
                        ชื่อ
                        {orderDetail.at(0)?.Ticket_Type_Name}:
                      </strong>
                      <br />
                      {orderDetail.at(0)?.TicketNo_List}
                    </p> */}
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
                    <p style={{ textAlign: "center" }}>
                      <strong>จำนวนที่นั่ง:</strong>
                      <br />
                      {totalSeats}
                    </p>
                    <p>
                      <strong>ยอดสุทธิ:</strong>
                      <br />
                      {formatNumberWithCommas(totalPrice)}
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
                      สถานะการจ่ายเงิน
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
                      ช่องทางการจ่าย
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
                        <TableCell
                          style={{
                            textAlign: "center",
                          }}
                          // onClick={() => handleOrderClick(order.Order_no)}
                        >
                          {order.Order_no}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {handletime(order.Payment_Date7)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Pay_By_Name}
                        </TableCell>
                        {/* <TableCell style={{ textAlign: "center" }}>
                          {formatNumberWithCommas(order.Net_Price)}
                        </TableCell> */}
                        <TableCell style={{ textAlign: "center" }}>
                          {formatNumberWithCommas(order.Total_Pay)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {formatNumberWithCommas(order.Total_Balance)}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Pay_By_BankName}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Charge_Id}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {order.Ref_Number1}
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

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <div>
            <OrderDetailContent />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AllOrderContent;
