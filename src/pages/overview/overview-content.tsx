import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { authAxiosClient } from "../../config/axios.config";

import Header from "../common/header";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { Container, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

dayjs.extend(buddhistEra);

const formatEventTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return "ยังไม่ระบุ";
  return dayjs(dateTime)
    .subtract(7, "hour")
    .locale("th")
    .format("D/M/YYYY HH:mm");
};

function formatNumberWithCommas(number: number | string): string {
  const bath = `${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} `;
  return bath;
}

// function totalNetPriceWithZeroBalance(data: any) {
//   console.log("data:", data);
//   const filteredPayments = data.filter((payment) => payment.Order_Status === 1);
//   console.log("filteredPayments:", filteredPayments);
//   // console.log("data", filteredPayments);
//   const totalPay = filteredPayments.reduce((sum, payment) => {
//     return sum + (payment.Total_Price || 0);
//   }, 0);
//   console.log("totalPay", totalPay);

//   let res = formatNumberWithCommas(totalPay);
//   return res;
// }

// function OutstandingPayment(data: any, id: any) {
//   const Data2 = data.filter(
//     (payment) => payment.Is_Balance !== 0 || payment.Is_Balance > 1
//   );

//   const totalPay = data.reduce((sum, payment) => {
//     return sum + (payment.Total_Pay || 0);
//   }, 0);

//   const totalOutstandingPayment = Data2?.reduce<number>(
//     (sum, payment) => sum + payment.Total_Pay,
//     0
//   );

//   const totalpayfun = totalPay - totalOutstandingPayment;

//   let res = formatNumberWithCommas(totalpayfun);

//   return res;
// }

// function totalNetPrice(data: any, id: any) {
//   const Data2 = data.filter((payment) => payment.Is_Balance !== 0);
//   const totalNetPriceWithZeroBalance = Data2?.reduce<number>(
//     (sum, payment) => sum + payment.Total_Pay,
//     0
//   );
//   console.log("totalNetPriceWithZeroBalance", totalNetPriceWithZeroBalance);
//   let res = formatNumberWithCommas(totalNetPriceWithZeroBalance);
//   return res;
// }

// function formatCountOrder(data: any | null) {
//   if (!data || !Array.isArray(data)) {
//     console.log("Invalid data");
//     return 0;
//   }

//   const uniqueOrders = data.reduce((acc: any[], current: any) => {
//     const exists = acc.find((order) => order.Order_no === current.Order_no);
//     if (!exists) acc.push(current);
//     return acc;
//   }, []);

//   return uniqueOrders.length;
// }

const OverviewContent: React.FC = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  const [combinedData, setCombinedData] = useState<any[]>([]);
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

  const uniqueOrders = () => {
    if (filteredEvents.length > 1) {
      return filteredEvents.reduce((total, event) => {
        return total + (event.orders?.length || 0);
      }, 0);
    } else {
      return filteredEvents[0]?.orders?.length || 0;
    }
  };

  const totalOrders = uniqueOrders();

  console.log("filteredEvents", filteredEvents);

  // const totalpayBalen = filteredEvents.reduce((total, event) => {
  //   const eventTotalPay = event.payments
  //     .filter((payment) => payment.Is_Balance !== 0)
  //     .reduce((sum, payment) => sum + (payment.Total_Pay || 0), 0);

  //   return eventTotalPay;
  // }, 0);

  // const totalpayfun = totalpay - totalpayBalen;

  const handleOrderClick = (orderNo: any) => {
    setSelectedOrderNo(orderNo);
  };

  // useEffect(() => {
  //   if (isSuccess && Array.isArray(dashboardData) && dashboardData.length > 0) {
  //     processDashboardData(dashboardData);
  //   } else {
  //     console.log("");
  //   }
  // }, [dashboardData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventSummary] = await Promise.all([
          authAxiosClient.get("/api/eventSummary"),
        ]);
        console.log("eventSummary:", eventSummary?.data?.data);
        if (eventSummary?.data?.data) {
          const res = eventSummary?.data?.data;
          console.log("res", res);
          setCombinedData(res);
        }
      } catch (error) {
        console.error("❌ Error loading sales data:", error);
      }
    };

    fetchData();
  }, []);

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
                      {/* {totalpay ? formatNumberWithCommas(totalpay) : 0} */}
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
                      {/* {totalpayBalen
                        ? formatNumberWithCommas(totalpayBalen)
                        : 0} */}
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
                      {/* {totalpayfun ? formatNumberWithCommas(totalpayfun) : 0} */}
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
                const {
                  Event_Id,
                  Event_Name,
                  Event_Time,
                  TotalOrders,
                  TotalNetPrice,
                  TotalPaid,
                  TotalTickets,
                  TotalUnpaid,
                  TotalCheckin
                } = event;
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
                      {TotalOrders
                        ? formatNumberWithCommas(TotalOrders)
                        : "ยังไม่ระบุ"}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {TotalNetPrice
                        ? `${formatNumberWithCommas(TotalNetPrice)} ฿`
                        : "ยังไม่ระบุ"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {TotalPaid
                        ? `${formatNumberWithCommas(TotalPaid)} ฿`
                        : "ยังไม่ระบุ"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {TotalUnpaid
                        ? `${formatNumberWithCommas(TotalUnpaid)} ฿`
                        : "0 ฿"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                      {TotalTickets
                        ? `${formatNumberWithCommas(TotalTickets)} `
                        : "ยังไม่ระบุ"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "black" }}>
                     {TotalCheckin
                        ? `${formatNumberWithCommas(TotalCheckin)} `
                        : "0"}
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
