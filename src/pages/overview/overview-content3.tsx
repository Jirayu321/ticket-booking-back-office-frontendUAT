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
} from "@mui/material";

import { authAxiosClient } from "../../config/axios.config";

// import { useFetchDashboard } from "../../hooks/fetch-data/useFetchDashboard";
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

const OverviewContent: React.FC = () => {
  const [combinedData, setCombinedData] = useState([]);

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

        if (!eventDate.isBetween(startDate, endDate, null, "[]")) {
          return false;
        }
      }

      return true;
    });
  }, [combinedData, filters]);

  const tableCellHeadStyle = {
    color: "white",
    fontWeight: "bold",
    fontSize: "17px",
    textAlign: "center",
  };

  const [selectedOrderNo, setSelectedOrderNo] = useState(null);

  const handleOrderClick = (orderNo: any) => {
    setSelectedOrderNo(orderNo);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTop10] = await Promise.all([
          authAxiosClient.get("/api/top10Event"),
        ]);
        console.log("resTop10:", resTop10?.data?.data);
        if (resTop10?.data?.data) {
          const res = resTop10?.data?.data;
          setCombinedData(res);
        }
      } catch (error) {
        console.error("❌ Error loading sales data:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (isSuccess && Array.isArray(dashboardData) && dashboardData.length > 0) {
  //     processDashboardData(dashboardData);
  //   } else {
  //     console.log("");
  //   }
  // }, [dashboardData]);

  return (
    <div
      className="all-events-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="Top 10 ยอดขาย" />

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
                    flexShrink: 0,
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
          maxWidth: "50vw",
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
            </TableRow>
          </TableHead>
          {combinedData && combinedData.length > 0 ? (
            <TableBody>
              {filteredEvents.map((event: any, eventIndex: number) => (
                <TableRow
                  key={`row-${eventIndex}`} // ใช้ key ที่ไม่ซ้ำกันโดยผสม eventIndex และ index
                  // style={{
                  //   backgroundColor:
                  //     selectedOrderNo ===
                  //     eventIndex *
                  //       Object.entries(event.paymentsByPayByName).length +
                  //       eventIndex +
                  //       1
                  //       ? "lightblue"
                  //       : "inherit",
                  //   cursor: "pointer",
                  // }}
                  // onClick={() =>
                  //   handleOrderClick(
                  //     eventIndex *
                  //       Object.entries(event.paymentsByPayByName).length +
                  //       eventIndex +
                  //       1
                  //   )
                  // }
                >
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {eventIndex + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {event.Event_Name}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {event.TotalSales
                      ? `${formatNumberWithCommas(event.TotalSales)}฿`
                      : "0"}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {event.TotalPaid
                      ? `${formatNumberWithCommas(event.TotalPaid)}฿`
                      : "0"}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {event.TotalUnpaid
                      ? `${formatNumberWithCommas(event.TotalUnpaid)}฿`
                      : "0"}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {" "}
                    {event.TotalSales
                      ? `${formatNumberWithCommas(event.Ticket_Count)}`
                      : "ยังไม่ระบุ"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
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
