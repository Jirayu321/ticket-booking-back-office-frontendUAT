import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import toast from "react-hot-toast";
import { useFetchDashboard } from "../../hooks/fetch-data/useFetchDashboard";
import Header from "../common/header";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { Container, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

dayjs.extend(buddhistEra);

const formatEventTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return "ยังไม่ระบุ";
  return dayjs(dateTime).subtract(7, "hour").locale("th").format("D/M/YYYY HH:mm");
};

function formatNumberWithCommas(number: number | string): string {
  const bath = `${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ฿`;
  return bath;
}

function totalNetPriceWithZeroBalance(data: any, id: any) {
  const Data = data.filter(
    (order) => order.Event_Id === id && order.Is_Balance === 0
  );

  const totalNetPriceWithZeroBalance = Data?.reduce<number>(
    (sum, order) => sum + order.Web_Qty_Buy * order.Plan_Price,
    0
  );
  let res = formatNumberWithCommas(totalNetPriceWithZeroBalance);
  return res;
}

function OutstandingPayment(data: any, id: any) {
  const Data2 = data.filter(
    (order) => order.Event_Id === id && order.Is_Balance !== 0
  );
  const totalOutstandingPayment = Data2?.reduce<number>(
    (sum, order) => sum + order.Is_Balance,
    0
  );

  let res = formatNumberWithCommas(totalOutstandingPayment);

  return res;
}

function totalNetPrice(data: any, id: any) {
  console.log("totalNetPrice", data);
  const Data = data.filter(
    (order) => order.Event_Id === id && order.Is_Balance === 0
  );

  const Data2 = data.filter(
    (order) => order.Event_Id === id && order.Is_Balance !== 0
  );

  const totalNetPriceWithZeroBalance = Data?.reduce<number>(
    (sum, order) => sum + order.Web_Qty_Buy * order.Plan_Price,
    0
  );

  const totalOutstandingPayment = Data2?.reduce<number>(
    (sum, order) => sum + order.Is_Balance,
    0
  );

  const x = totalNetPriceWithZeroBalance - totalOutstandingPayment;
  // console.log("total", x);

  let res = formatNumberWithCommas(x);
  return res;
}

function formatCountOrder(data: any | null) {
  if (!data || !Array.isArray(data)) {
    console.log("Invalid data");
    return 0;
  }

  const uniqueOrders = data.reduce((acc: any[], current: any) => {
    const exists = acc.find((order) => order.Order_no === current.Order_no);
    if (!exists) acc.push(current);
    return acc;
  }, []);

  // console.log("Unique Orders:", uniqueOrders);
  return uniqueOrders.length;
}

const OverviewContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  // console.log("combinedData", combinedData);

  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("event");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          sortBy: "publish-date",
          publishStatus: "all",
          status: "all",
          search: "",
          startDate: null as string | null,
          endDate: null as string | null,
          dateFilterType: "publish-date",
        };
  });

  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
    dayjs().startOf("month")
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
    dayjs().endOf("month")
  );
  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  const { data: dashboardData, isSuccess } = useFetchDashboard({
    eventId: null,
  });

  console.log("dashboardData", dashboardData);

  const processDashboardData = async (dashboardData: any) => {
    if (!dashboardData || dashboardData.length === 0) {
      console.error("Dashboard data is empty or undefined");
      return;
    }
    // console.log("dashboardData", dashboardData);

    const { dataAllEvent, dataAllOrder } = dashboardData[0] ?? {};

    if (!dataAllEvent || !dataAllOrder) {
      console.error("dataAllEvent or dataAllOrder is missing or undefined");
      console.log("dataAllEvent:", dataAllEvent);
      console.log("dataAllOrder:", dataAllOrder);
      return;
    }

    console.log("dataAllOrder:", dataAllOrder);
    const { events } = dataAllEvent;
    const { orderAll, hisPayment } = dataAllOrder;
    // console.log("hisPayment", hisPayment);

    if (!events || !orderAll || !hisPayment) {
      console.error("events, orderAll, or hisPayment is missing");
      // console.log("events:", events);
      // console.log("orderAll:", orderAll);
      // console.log("hisPayment:", hisPayment);
      return;
    }

    // ดำเนินการต่อหลังจากโหลดข้อมูลครบแล้ว
    const filteredHisPayment = hisPayment.reduce((acc, current) => {
      const exists = acc.find((order) => order.Event_Id === current.Event_Id);
      if (exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    const combinedData = events.map((event) => {
      const relatedOrders = orderAll.filter(
        (order) => order.Event_Id === event.Event_Id
      );

      // console.log("filteredHisPayment", filteredHisPayment);

      return {
        ...event,
        orders: relatedOrders,
        payments: filteredHisPayment,
      };
    });

    setCombinedData(combinedData);
  };
  // console.log("combinedData", combinedData);

  useEffect(() => {
    if (isSuccess && Array.isArray(dashboardData) && dashboardData.length > 0) {
      processDashboardData(dashboardData);
    } else {
      console.log("");
    }
  }, [dashboardData]);

  const filteredEvents = useMemo(() => {
    return combinedData.filter((event) => {
      if (
        filters.search &&
        !event.Event_Name?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      // const publishDate = dayjs(event.Event_Public_Date).subtract(7, "hour");
      const eventDate = dayjs(event.Event_Time).subtract(7, "hour");

      if (filters.startDate && filters.endDate) {
        const startDate = dayjs(filters.startDate);
        const endDate = dayjs(filters.endDate);

        // Use the already declared eventDate here
        if (!eventDate.isBetween(startDate, endDate, null, "[]")) {
          return false;
        }
      }

      return true;
    });
  }, [combinedData, filters]);

  // const handleClick = (pageNumber: number) => {
  //   setCurrentPage(pageNumber);
  // };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    localStorage.setItem("event", JSON.stringify(updatedFilters));
  };

  // const handleUpdateFilters = (event: SelectChangeEvent<string>) => {
  //   const { name, value } = event.target;

  //   const updatedFilters = {
  //     ...filters,
  //     [name]: value,
  //   };

  //   setFilters(updatedFilters);
  //   localStorage.setItem("event", JSON.stringify(updatedFilters));
  // };

  const handleDateRangeChange = (
    startDate: dayjs.Dayjs | null,
    endDate: dayjs.Dayjs | null
  ) => {
    const adjustedStartDate = startDate
      ? startDate.hour(0).minute(1).second(0)
      : null;
    const adjustedEndDate = endDate
      ? endDate.hour(23).minute(59).second(59)
      : null;

    const updatedFilters = {
      ...filters,
      startDate: adjustedStartDate
        ? adjustedStartDate.format("YYYY-MM-DD HH:mm:ss")
        : null,
      endDate: adjustedEndDate
        ? adjustedEndDate.format("YYYY-MM-DD HH:mm:ss")
        : null,
    };

    setFilters(updatedFilters);
    localStorage.setItem("event", JSON.stringify(updatedFilters));
  };

  const handleStartDateChange = (newValue: dayjs.Dayjs | null) => {
    setStartDate(newValue);
    handleDateRangeChange(newValue, endDate);
  };

  const handleEndDateChange = (newValue: dayjs.Dayjs | null) => {
    setEndDate(newValue);
    handleDateRangeChange(startDate, newValue);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: "publish-date",
      publishStatus: "all",
      status: "all",
      search: "",
      startDate: null,
      endDate: null,
      dateFilterType: "publish-date",
    });
    localStorage.setItem("event", JSON.stringify(filters));
  };

  const tableCellHeadStyle = {
    color: "white",
    fontWeight: "bold",
    fontSize: "17px",
    textAlign: "center",
  };

  const uniqueOrders = filteredEvents
    .flatMap((event) => event.orders)
    .reduce((acc, current) => {
      const exists = acc.find((order) => order.Order_no === current.Order_no);
      if (!exists) acc.push(current);
      return acc;
    }, []);

  const totalOrders = uniqueOrders.length;

  const totalpay = filteredEvents.reduce((total, event) => {
    const eventTotalPay = event.orders
      .filter((order) => order.Event_Id === event.Event_Id)
      .reduce(
        (sum, payment) => sum + (payment.Web_Qty_Buy * payment.Plan_Price || 0),
        0
      );
    return total + eventTotalPay;
  }, 0);

  const totalPayByEvent = filteredEvents.reduce((acc, event) => {
    // ตรวจสอบว่ามี payment ที่ Event_Id ตรงกับ Event_Id ของ event หรือไม่
    const matchingPayments = event.payments.filter(
      (payment) => payment.Event_Id === event.Event_Id
    );

    // คำนวณยอดรวม Total_Pay สำหรับ payments ที่ตรงกัน
    const eventTotalPay = matchingPayments.reduce(
      (sum, payment) => sum + (payment.Total_Pay || 0),
      0
    );

    // เพิ่มยอดรวมของ Event_Id นี้ใน acc
    if (eventTotalPay > 0) {
      acc[event.Event_Id] = (acc[event.Event_Id] || 0) + eventTotalPay;
    }

    return acc;
  }, {});

  const totalpayBalen = filteredEvents.reduce((total, event) => {
    const eventTotalPay = event.orders
      .filter((order) => order.Event_Id === event.Event_Id)
      .reduce(
        (sum, payment) => sum + (payment.Web_Qty_Buy * payment.Plan_Price || 0),
        0
      );
    const eventTotalPay2 = event.orders
      .filter(
        (order) => order.Event_Id === event.Event_Id && order.Is_Balance !== 0
      )
      .reduce((sum, payment) => sum + (payment.Is_Balance || 0), 0);
    let x = eventTotalPay - eventTotalPay2;
    return total + x;
  }, 0);

  const totalpayfun = totalpay - totalpayBalen;

  const handleOrderClick = (orderNo: any) => {
    setSelectedOrderNo(orderNo);
  };

  return (
    <div
      className="all-events-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="สรุปยอดทั้งหมด" />

      <div
        style={{
          backgroundColor: "#f7f7f7",
        }}
      >
        <Container maxWidth={false} sx={{ padding: 2, marginTop: "10px" }}>
          <Grid
            container
            spacing={2}
            sx={{ marginBottom: "15px ", justifyContent: "space-between" }}
          >
            <Grid item xs={2} sm={2} md={2}>
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
                  src="/รอจัดงาน.svg"
                  alt="รอจัดงาน icon"
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
                      จำนวนอีเว้นทั้งหมด
                    </Typography>
                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {Array.isArray(filteredEvents)
                        ? filteredEvents.length
                        : 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={2} sm={2} md={2}>
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

                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {totalOrders ? totalOrders : 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={2} sm={2} md={2}>
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

                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {/* {Array.isArray(events)
                        ? events.filter((event) => event?.Event_Status === 3)
                            .length
                        : 0} */}
                      {totalpay ? formatNumberWithCommas(totalpay) : 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={2} sm={2} md={2}>
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

                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {totalpayBalen ? formatNumberWithCommas(totalpayBalen) : 0}
                   
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={2} sm={2} md={2}>
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

                    <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                      {/* {Array.isArray(events)
                        ? events.filter((event) => event?.Event_Status === 13)
                            .length
                        : 0} */}
                           {totalpayfun ? formatNumberWithCommas(totalpayfun) : 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

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
              <TextField
                name="search"
                value={filters.search}
                onChange={handleTextFieldChange}
                variant="outlined"
                label="ค้นจากชื่องาน"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      border: "none",
                      transform: "translateY(5px)",
                      backgroundColor: "white",
                    },
                  },
                }}
              />

              <FormControl sx={{ backgroundColor: "white" }}>
                <DatePicker
                  label="วันที่เริ่มต้น"
                  value={startDate}
                  onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
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
                    flexShrink: 0, // Prevent the button from shrinking
                  }}
                >
                  ค้นหา
                </Button>
                {filteredEvents?.length === 0 ? (
                  <p style={{ color: "red", marginLeft: 10 }}>
                    ผลการค้นหา 0 รายการ
                  </p>
                ) : (
                  <p style={{}}></p>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "0",
          maxHeight: "68vh",
          overflowY: "auto",
          width: "60vw",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead
            sx={{
              backgroundColor: "#11131A",
              zIndex: (theme) => theme.zIndex.modal,
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ลำดับ
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ชื่องาน
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                วันจัดงาน
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                คำสั่งซื้อทั้งหมด
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ยอดขายทั้งหมด
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ชำระแล้ว
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                ค้างชำระ
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                จำนวนบัตรทั้งหมด
              </TableCell>

              <TableCell
                sx={{
                  ...tableCellHeadStyle,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#11131A",
                  zIndex: 2,
                }}
              >
                เช็คอิน
              </TableCell>
            </TableRow>
          </TableHead>

          {combinedData && combinedData.length > 0 ? (
            <TableBody>
              {filteredEvents.map((event: any, index: number) => {
                const { Event_Id, Event_Name, Event_Time, payments, orders } =
                  event;
                return (
                  <TableRow
                    key={Event_Id}
                    style={{
                      backgroundColor:
                        selectedOrderNo === Event_Id ? "lightblue" : "inherit",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOrderClick(Event_Id)}
                  >
                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {Event_Name}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {Event_Time ? formatEventTime(Event_Time) : "ยังไม่ระบุ"}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {orders ? formatCountOrder(orders) : "ยังไม่ระบุ"}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {orders
                        ? totalNetPriceWithZeroBalance(orders, Event_Id)
                        : "ยังไม่ระบุ"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {orders ? totalNetPrice(orders, Event_Id) : "ยังไม่ระบุ"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {orders
                        ? OutstandingPayment(orders, Event_Id)
                        : "ยังไม่ระบุ"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {orders?.at(0)?.UnCheckin_By_Event
                        ? orders?.at(0)?.UnCheckin_By_Event +
                          orders.at(0)?.Checkin_By_Event
                        : ""}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {orders ? orders.at(0)?.Checkin_By_Event : ""}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={11} sx={{ textAlign: "center" }}>
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default OverviewContent;
