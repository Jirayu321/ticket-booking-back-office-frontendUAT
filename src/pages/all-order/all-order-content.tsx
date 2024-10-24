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
import Header from "../common/header";
import OrderDetailContent from "../order-detail/order-detail-content";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import "moment/locale/th";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useFetchOrdertList } from "../../hooks/fetch-data/useFetchEventList";

import {
  selectedColor,
  paymentStatusBgColor0,
  paymentStatusBgColor1,
  paymentStatusBgUnknown,
} from "../../lib/util";

moment.locale("th");
const AllOrderContent: React.FC = () => {
  const [orderDetail, setOrderDetail] = useState<any[]>([]);
  const [orderHispayDetail, setOrderHispayDetail] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [count, setCount] = useState<boolean>(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);
  const [events, setEvents] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { refetch } = useFetchOrdertList({ count });

  useEffect(() => {
    if (events) {
      console.log("ข้อมูล data เปลี่ยนไป:", events);
    }
  }, [events]);

  useEffect(() => {
    if (isFetching) {
      console.log("กำลังดึงข้อมูล...");
    } else if (events) {
      console.log("ข้อมูลโหลดเสร็จแล้ว");
      setCount(true);
    }
  }, [isFetching, events]);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setIsFetching(true);
    const result = await refetch();
    if (result?.data) {
      setEvents(result.data);
      console.log("ข้อมูล data เปลี่ยนไป:", result.data);
    }
    setIsFetching(false);
  };

  const evntDetail = events?.dataEvent?.events.filter(
    (event: any) => event?.Event_Public === "Y"
  );

  const orderHData =
    events?.dataOrder?.orderAll?.filter(
      (order: any) => order?.DT_order_id !== null
    ) || [];

  const orderDData =
    events?.dataOrder?.hisPayment?.filter(
      (order: any) => order?.Net_Price !== null
    ) || [];

  const OrderAll = events?.dataOrder;

  const handleOrderprevData = (
    orderNo: any,
    data: any = [],
    orderDData: any = []
  ) => {
    if (!data.length || !orderDData.length) {
      return;
    }

    localStorage.setItem("orderDetail", orderNo);
    setSelectedOrderNo(orderNo);

    const latestOrder = data
      .filter((order) => order.Order_no === orderNo)
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

    setOrderDetail(latestOrder);

    const h = orderDData
      .filter((order) => order.Order_no === orderNo)
      .sort(
        (a, b) =>
          new Date(a.Payment_Date7).getTime() -
          new Date(b.Payment_Date7).getTime()
      );

    setOrderHispayDetail(h);
  };

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
      setCount(true);
      return updatedFilters;
    });
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start ?? undefined); // ตรวจสอบว่าค่าเป็น null หรือ undefined
    setEndDate(end ?? undefined);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    refetch();
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

  const initializeFilters = () => {
    const savedOrderDetail = localStorage.getItem("orderDetail");
    const savedOrderDetailFilter = localStorage.getItem("filters");

    if (savedOrderDetail && savedOrderDetailFilter) {
      const x = OrderAll?.orderAll.filter(
        (order: any) => order?.Net_Price !== null
      );
      const y = OrderAll?.hisPayment.filter(
        (order: any) => order?.Net_Price !== null
      );
      handleOrderprevData(savedOrderDetail, x, y);
      return JSON.parse(savedOrderDetailFilter);
    } else if (savedOrderDetail) {
      const x = OrderAll?.orderAll.filter(
        (order: any) => order?.Net_Price !== null
      );
      const y = OrderAll?.hisPayment.filter(
        (order: any) => order?.Net_Price !== null
      );
      handleOrderprevData(savedOrderDetail, x, y);
      return {
        orderNo: "",
        eventName: "",
        customerName: "",
        customerPhone: "",
        status: "all",
        paymentStatus: "all",
        ticketType: "all",
      };
    } else if (savedOrderDetailFilter) {
      return JSON.parse(savedOrderDetailFilter);
    } else {
      return {
        orderNo: "",
        eventName: "",
        customerName: "",
        customerPhone: "",
        status: "all",
        paymentStatus: "all",
        ticketType: "all",
      };
    }
  };

  const [filters, setFilters] = useState(initializeFilters);

  const handleViewHistoryClick = (orderId: string) => {
    localStorage.setItem("orderId", orderId);
    setModalOpen(true);
  };

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
        ?.filter((order) => order.Order_no === orderNo)
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
      ?.filter((order) => order.Order_no === orderNo)
      .sort(
        (a, b) =>
          new Date(a.Payment_Date7).getTime() -
          new Date(b.Payment_Date7).getTime()
      );

    // console.log("h:", h);
    setOrderHispayDetail(h);
  };

  function formatNumberWithCommas(number: number | string): string {
    const bath = `${number
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿`;
    return bath;
  }

  const filteredOrders = orderHData
    ?.filter((order) => {
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

      const matchesStatusOrder =
        (filters.status === "สำเร็จ" && order.Order_Status === 1) ||
        (filters.status === "มีแก้ไข" && order.Order_Status === 2) ||
        (filters.status === "ขอคืนเงิน" && order.Order_Status === 13) ||
        (filters.status === "ไม่สำเร็จเพราะติด R" &&
          order.Order_Status === 4) ||
        (filters.status === "ไม่สำเร็จจาก Omise" && order.Order_Status === 5) ||
        filters.status === "all";

      const matchesStatusPayment =
        (filters.paymentStatus === "สำเร็จ" && order.Is_Balance === 0) ||
        (filters.paymentStatus === "ค้างจ่าย" && order.Is_Balance !== 0) ||
        filters.paymentStatus === "all";

      const orderDatetime = new Date(order.Order_datetime);
      const normalizedStartDate = startDate
        ? new Date(startDate.setHours(0, 0, 0, 0))
        : null;
      const normalizedEndDate = endDate
        ? new Date(endDate.setHours(23, 59, 59, 999))
        : null;

      const matchesDate =
        (!normalizedStartDate || orderDatetime >= normalizedStartDate) &&
        (!normalizedEndDate || orderDatetime <= normalizedEndDate);

      return (
        matchesSearch &&
        matchesStatusOrder &&
        matchesStatusPayment &&
        matchesDate
      );
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

  const totalOrders = filteredOrders?.length;

  // const OutstandingPayment = filteredOrders
  //   ?.filter((order) => order.Order_Status === 4)
  //   .reduce((sum, order) => sum + order.Total_Price * order.Web_Qty_Buy, 0);

  // const OutstandingPayment2 = filteredOrders
  //   .filter((order) => order.Total_Balance !== 0 && order.Order_Status === 1)
  //   .reduce((sum, order) => sum + order.Total_Balance, 0);

  // const OutstandingPayment3 = OutstandingPayment + OutstandingPayment2;

  const dataP = Object.values(
    orderDData.filter((order) => order.Event_Id === filteredOrders[0]?.Event_Id)
  );

  const totalNetPriceWithZeroBalance = dataP?.reduce<number>(
    (sum, order) => sum + order.Total_Pay,
    0
  );
  

  const OutstandingPayment3 =  dataP?.reduce<number>(
    (sum, order) => sum + order.Total_Balance,
    0
  );
  

  console.log("totalNetPriceWithZeroBalance", dataP);

  const totalNetPrice = totalNetPriceWithZeroBalance - OutstandingPayment3;

  const handleClearFilters = () => {
    setEvents(null);
    setIsFetching(false);
    initialize();
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
      // console.log("Input dateString:", dateString);

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

      // console.log("Parsed startDate using moment:", parsedStartDate);
      if (parsedEndDate) {
        // console.log("Parsed endDate using moment:", parsedEndDate);
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
                justifyContent: "space-evenly",
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
                justifyContent: "space-evenly",
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
                    ยอดขายทั้งหมด
                  </Typography>

                  {filters.eventName !== "" ? (
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {formatNumberWithCommas(totalNetPriceWithZeroBalance)}
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
                justifyContent: "space-evenly",
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "23px" }}>ชำระแล้ว</Typography>

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
                justifyContent: "space-evenly",
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
                      {formatNumberWithCommas(OutstandingPayment3)}
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
                  {evntDetail?.map((item, index) => (
                    <MenuItem key={index + 1} value={item.Event_Name}>
                      {item.Event_Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
                  ช่วงวันที่ใบสั่งซื้อ
                </label>

                <DatePicker
                  className="custom-datepicker"
                  selected={startDate}
                  onChange={handleDateRangeChange}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  locale={th}
                  isClearable
                  showMonthDropdown
                  useShortMonthInDropdown
                  dropdownMode="select"
                  selectsRange
                  customInput={<CustomInput />}
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div>
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
                      <div
                        style={{
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Dropdown สำหรับเลือกเดือน */}
                        <select
                          value={date.getMonth()}
                          onChange={({ target: { value } }) =>
                            changeMonth(Number(value))
                          }
                          style={{
                            fontSize: 16,
                            margin: "0 5px",
                            height: 40,
                            width: "auto",
                          }}
                        >
                          {Array.from({ length: 12 }, (_, index) => {
                            const monthDate = new Date(
                              date.getFullYear(),
                              index,
                              1
                            );
                            return (
                              <option key={index} value={index}>
                                {format(monthDate, "MMMM", { locale: th })}
                              </option>
                            );
                          })}
                        </select>

                        {/* Dropdown สำหรับเลือกปี */}
                        <select
                          value={date.getFullYear()}
                          onChange={({ target: { value } }) =>
                            changeYear(Number(value))
                          }
                          style={{
                            fontSize: 16,
                            margin: "0 5px",
                            height: 40,
                            width: "auto",
                          }}
                        >
                          {Array.from({ length: 20 }, (_, index) => {
                            const year = moment().year() - 5 + index; // ปรับช่วงปีที่ต้องการให้เลือก
                            return (
                              <option key={index} value={year}>
                                {year + 543}{" "}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                />
              </div>

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
              {filteredOrders?.length === 0 ? (
                <p style={{ color: "red", marginLeft: 10 }}>
                  ผลการค้นหา 0 รายการ
                </p>
              ) : (
                <p style={{}}></p>
              )}
            </Box>
          </Box>
        </Container>
      </div>

      {/* Table Component */}
      <div
        style={{
          display: "flex",
          maxHeight: "70vh",
        }}
      >
        <div style={{ width: "920px" }}>
          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            คำสั่งซื้อทั้งหมด
          </p>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: "0" }}
            style={{ maxHeight: "68vh", overflowY: "auto" }}
          >
            <Table
              stickyHeader
              sx={{
                tableLayout: "fixed",
                display: "table-cell",
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
                      minWidth: "60px",
                      maxWidth: "60px",
                      padding: "5px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
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
                      minWidth: "170px",
                      maxWidth: "400px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2, // ใช้ความกว้างแบบสัดส่วน
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
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                      minWidth: "85px",
                      maxWidth: "85px",
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
                      minWidth: "130px",
                      maxWidth: "130px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
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
                      minWidth: "80px",
                      maxWidth: "80px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
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
                      minWidth: "65px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    สถานะ Order
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: "65px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#11131A",
                      zIndex: 2,
                    }}
                  >
                    สถานะจ่าย
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((order: any, index: number) => {
                  let paymentStatusLabel;
                  let paymentStatusBgColor;

                  if (order.Order_Status === 1) {
                    if (order.Is_Balance === 0) {
                      paymentStatusLabel = "ชำระครบ";
                      paymentStatusBgColor = `${paymentStatusBgColor0}`;
                    } else if (order.Is_Balance > 0) {
                      paymentStatusLabel = "ค้างจ่าย";
                      paymentStatusBgColor = `${paymentStatusBgColor1}`;
                    }
                  } else {
                    paymentStatusLabel = "ไม่ระบุ";
                    paymentStatusBgColor = `${paymentStatusBgUnknown}`;
                  }

                  return (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor:
                          selectedOrderNo === order.Order_no
                            ? `${selectedColor}`
                            : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOrderClick(order.Order_no)}
                    >
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          minWidth: "60px",
                          maxWidth: "60px",
                          padding: "5px",
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "left",
                          fontWeight: "bold",
                          minWidth: "180px",
                          maxWidth: "180px",
                        }}
                      >
                        {order.Event_Name}
                      </TableCell>
                      <TableCell
                        style={{
                          width: "900px",
                        }}
                      >
                        {order.Order_no}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "left",
                          minWidth: "130px",
                          maxWidth: "130px",
                        }}
                      >
                        {order.Cust_name}
                      </TableCell>
                      <TableCell style={{ textAlign: "center", width: "50px" }}>
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
                            width: "65px",
                            minWidth: "65px",
                            maxWidth: "65px",
                            backgroundColor: `${order.OrderSetColour}`,
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.OrderStatus_Name}
                        </div>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <div
                          style={{
                            border:
                              paymentStatusLabel === "ไม่ระบุ"
                                ? "transparent"
                                : "1px solid #ccc",
                            padding: "8px",
                            borderRadius: "18px",
                            textAlign: "center",
                            display: "inline-block",
                            width: "65px",
                            minWidth: "65px",
                            maxWidth: "65px",
                            backgroundColor:
                              paymentStatusLabel === "ไม่ระบุ"
                                ? "transparent"
                                : paymentStatusBgColor,
                            color: "#fff",
                          }}
                        >
                          {paymentStatusLabel === "ไม่ระบุ"
                            ? ``
                            : paymentStatusLabel}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div style={{ marginLeft: 10, maxWidth: "35vw" }}>
          <p style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
            รายละเอียด
          </p>
          <div style={{ width: "auto" }}>
            {orderDetail ? (
              <div>
                <div
                  style={{
                    color: "#000",
                    border: " 1px solid ",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80% auto",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "30% 26% 30% 15% 11%",
                        marginBottom: 20,
                        justifyItems: "flex-start",
                        alignItems: "center",
                        width: "25vw",
                      }}
                    >
                      <p>
                        <strong>ชื่องาน:</strong>
                        <br />
                        {orderDetail.at(0)?.Event_Name}
                      </p>
                      <p>
                        <strong>เวลาเริ่มงาน:</strong>
                        <br />
                        <span style={{ width: 100 }}>
                          {orderDetail?.length === 0
                            ? ``
                            : handletime(orderDetail.at(0)?.Event_Time)}
                        </span>
                      </p>

                      <p>
                        <strong>Plan_Name:</strong>
                        <br />
                        <span>
                          {orderDetail?.length === 0
                            ? ``
                            : `${orderDetail?.map((data) => data?.Plan_Name)}`}
                        </span>
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
                            color: ` ${orderDetail.at(0)?.OrderSetColour}`,
                            fontWeight: "bold",
                          }}
                        >
                          {orderDetail.at(0)?.OrderStatus_Name}
                        </span>
                      </p>
                      <p>
                        <strong>เลขคำสั่งซื้อ:</strong>
                        <br />
                        <span
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {orderDetail.at(0)?.Order_no}
                        </span>
                      </p>
                      <p>
                        <strong>เวลาสั่งซื้อ:</strong>
                        <br />
                        {orderDetail?.length === 0
                          ? ``
                          : handletime(orderDetail.at(0)?.Order_datetime)}
                      </p>

                      <p>
                        <strong>line_id:</strong>
                        <br />
                        {orderDetail?.length === 0
                          ? ``
                          : `${orderDetail.at(0)?.Cust_line}`}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        justifyContent: "flex-end",
                        alignContent: "flex-end",
                      }}
                    >
                      {orderDetail.length !== 0 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleViewHistoryClick(orderDetail.at(0)?.Order_id)
                          }
                          style={{ width: 110, height: 50 }}
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
              maxWidth: "35vw",
              overflowX: "auto",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "0" }}
              style={{ maxHeight: 300, width: "auto" }}
            >
              <Table style={{ display: "grid", width: "min-content" }}>
                <TableHead sx={{ backgroundColor: "#11131A" }}>
                  <TableRow style={{ display: "flex", width: "100%" }}>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        minWidth: "75px",
                        maxWidth: "75px",
                      }}
                    >
                      สถานะจ่าย
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        textAlign: "center",
                        color: "#fff",
                        minWidth: "140px",
                        maxWidth: "140px",
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
                        minWidth: "91px",
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
                        whiteSpace: "nowrap",
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
                        whiteSpace: "nowrap",
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
                        minWidth: "175px",
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
                    let paymentStatusLabel;
                    let paymentStatusBgColor;

                    if (order.Order_Status === 1) {
                      if (order.Total_Balance === 0) {
                        paymentStatusLabel = "ชำระครบ";
                        paymentStatusBgColor = "#28a745";
                      } else if (order.Total_Balance > 0) {
                        paymentStatusLabel = "ค้างจ่าย";
                        paymentStatusBgColor = "#ffc107";
                      }
                    } else {
                      paymentStatusLabel = "ไม่ระบุ";
                      paymentStatusBgColor = "#f8f9fa";
                    }

                    return (
                      <TableRow
                        key={order.index}
                        style={{
                          display: "flex",
                          width: "max-content",
                          cursor: "pointer",
                        }}
                      // onClick={() => handleOrderClick(order.Order_no)}
                      >
                        <TableCell style={{ textAlign: "center" }}>
                          <div
                            style={{
                              border:
                                paymentStatusLabel === "ไม่ระบุ"
                                  ? "transparent"
                                  : "1px solid #ccc",
                              padding: "8px",
                              borderRadius: "18px",
                              textAlign: "center",
                              display: "inline-block",
                              width: "65px",
                              backgroundColor:
                                paymentStatusLabel === "ไม่ระบุ"
                                  ? "transparent"
                                  : paymentStatusBgColor,
                              color: "#fff",
                            }}
                          >
                            {paymentStatusLabel === "ไม่ระบุ"
                              ? ``
                              : paymentStatusLabel}
                          </div>
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                            minWidth: "140px",
                            maxWidth: "140px",
                          }}
                        >
                          {handletime(order.Payment_Date7)}
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                            minWidth: "91px",
                          }}
                        >
                          {order.Pay_By_Name}
                        </TableCell>
                        <TableCell
                          style={{
                            textAlign: "center",
                            minWidth: "60px",
                          }}
                        >
                          {formatNumberWithCommas(order.Total_Pay)}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "60px" }}
                        >
                          {formatNumberWithCommas(order.Total_Balance)}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "100px" }}
                        >
                          {order.Pay_By_BankName}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "60px" }}
                        >
                          {order.Charge_Id}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "center", minWidth: "60px" }}
                        >
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
            <OrderDetailContent
              orderD={orderDetail}
              hispay={orderHispayDetail}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AllOrderContent;
