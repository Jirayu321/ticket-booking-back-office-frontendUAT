import React, { useState } from "react";
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
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import Header from "../common/header";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { Container, Grid, Box, Typography, Avatar } from "@mui/material";

import "./all-event-content.css";
import { DatePicker } from "@mui/x-date-pickers";

dayjs.extend(buddhistEra);

const MAX_ITEMS_PER_PAGE = 50;

const formatEventTime = (dateTime: string | null) => {
  if (!dateTime) return "ยังไม่ระบุ";
  return dayjs(dateTime)
    .subtract(7, "hour")
    .locale("th")
    .format("D/M/BBBB HH:mm");
};

const AllEventContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
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
  
  const { data: events, isPending: isLoadingEventList } = useFetchEventList({
    eventId: null,
  });

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * MAX_ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - MAX_ITEMS_PER_PAGE;

  const totalPages = Math.ceil((events?.length ?? 0) / MAX_ITEMS_PER_PAGE);

  function handleCopyEventLink(eventId: number) {
    const eventLink = `https://deedclub.appsystemyou.com/event/${eventId}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("คัดลอกลิงก์งานสำเร็จ");
  }

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
  
  const handleUpdateFilters = (event: SelectChangeEvent<string>) => {
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
    setFilters((prevFilters) => ({
      sortBy:
        prevFilters.sortBy !== "publish-date"
          ? prevFilters.sortBy
          : "publish-date",
      publishStatus:
        prevFilters.publishStatus !== "all" ? prevFilters.publishStatus : "all",
      status: prevFilters.status !== "all" ? prevFilters.status : "all",
      search: prevFilters.search !== "" ? prevFilters.search : "",
      startDate: prevFilters.startDate !== null ? prevFilters.startDate : null,
      endDate: prevFilters.endDate !== null ? prevFilters.endDate : null,
      dateFilterType:
        prevFilters.dateFilterType !== "publish-date"
          ? prevFilters.dateFilterType
          : "publish-date",
    }));
  };

  const filteredEvents = events
    ?.filter((event) => {
      if (
        filters.search &&
        !event.Event_Name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (filters.publishStatus !== "all") {
        const isPublished = filters.publishStatus === "published" ? "Y" : "N";
        if (event.Event_Public !== isPublished) {
          return false;
        }
      }

      if (
        filters.status !== "all" &&
        event.Event_Status !== parseInt(filters.status)
      ) {
        return false;
      }

      const publishDate = dayjs(event.Event_Public_Date).subtract(7, "hour");
      const eventDate = dayjs(event.Event_Time).subtract(7, "hour");

      // Compare using dayjs objects
      if (filters.startDate && filters.endDate) {
        const startDate = dayjs(filters.startDate);
        const endDate = dayjs(filters.endDate);

        const dateToCompare =
          filters.dateFilterType === "publish-date" ? publishDate : eventDate;

        // Check if the event date is within the selected range
        if (!dateToCompare.isBetween(startDate, endDate, null, "[]")) {
          return false;
        }
      }

      return true;
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      className="all-events-content"
      style={{ display: "grid", height: "100%", alignContent: "baseline" }}
    >
      <Header title="งานทั้งหมด" />

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
              <Avatar
                src="/รอจัดงาน.svg"
                alt="รอจัดงาน icon"
                className="filter-icon"
                sx={{ width: 70, height: 70 }} // Adjust the size as needed
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
                  <Typography sx={{ fontSize: "23px" }}>รอเริ่มงาน</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {events?.filter((event) => event.Event_Status === 1).length}
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
                src="/เริ่มงานแล้ว.svg"
                alt="เริ่มงานแล้ว icon"
                className="filter-icon"
                sx={{ width: 70, height: 70 }} // Adjust the size as needed
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
                    เริ่มงานแล้ว
                  </Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {events?.filter((event) => event.Event_Status === 2).length}
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
                src="/ปิดงาน.svg"
                alt="ปิดงาน icon"
                className="filter-icon"
                sx={{ width: 70, height: 70 }} // Adjust the size as needed
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
                  <Typography sx={{ fontSize: "23px" }}>ปิดงาน</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {events?.filter((event) => event.Event_Status === 3).length}
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
                src="/ยกเลิก.svg"
                alt="ยกเลิก icon"
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
                  <Typography sx={{ fontSize: "23px" }}>ยกเลิก</Typography>
                  <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
                    {
                      events?.filter((event) => event.Event_Status === 13)
                        .length
                    }
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
              <FormControl>
                <InputLabel htmlFor="publish-status">สถานะเผยแพร่</InputLabel>
                <Select
                  id="publish-status"
                  name="publishStatus"
                  value={filters.publishStatus}
                  onChange={handleUpdateFilters}
                  label="สถานะเผยแพร่"
                  sx={{
                    height: "50px",
                    width: "125px",
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="all">ทั้งหมด</MenuItem>
                  <MenuItem value="published">เผยแพร่</MenuItem>
                  <MenuItem value="unpublished">ไม่เผยแพร่</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="status">สถานะ Event</InputLabel>
                <Select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleUpdateFilters}
                  label="สถานะ Event"
                  sx={{
                    height: "50px",
                    width: "125px",
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="all">ทั้งหมด</MenuItem>
                  <MenuItem value="1">รอเริ่มงาน</MenuItem>
                  <MenuItem value="2">เริ่มงานแล้ว</MenuItem>
                  <MenuItem value="3">ปิดงาน</MenuItem>
                  <MenuItem value="13">ยกเลิก</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="date-filter-type">
                  ตัวกรองวันที่
                </InputLabel>
                <Select
                  id="date-filter-type"
                  name="dateFilterType"
                  value={filters.dateFilterType}
                  onChange={handleUpdateFilters}
                  label="ตัวกรองวันที่"
                  sx={{ height: "50px", backgroundColor: "white" }}
                >
                  <MenuItem value="publish-date">วันที่เผยแพร่</MenuItem>
                  <MenuItem value="event-date">วันจัดงาน</MenuItem>
                </Select>
              </FormControl>
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
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              href="/all-events/create-event"
              sx={{
                backgroundColor: "green",
                width: "160px",
                height: "45px",
                fontSize: "15px",
                "&:hover": {
                  backgroundColor: "darkgreen",
                  color: "white",
                },
                flexShrink: 0,
              }}
            >
              + สร้าง Event ใหม่
            </Button>
          </Box>
        </Container>
      </div>
      {/* Table Component */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "0", maxHeight: "68vh", overflowY: "auto" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#11131A" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                ลำดับ
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                ชื่องาน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                สถานที่
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                วันที่เผยแพร่
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                วันจัดงาน
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                เผยแพร่
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                สถานะ
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                Link
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "17px",
                  textAlign: "center",
                }}
              >
                รายละเอียด
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents?.map((event: any, index: number) => {
              const {
                Event_Id,
                Event_Public,
                Event_Status,
                Event_Name,
                Event_Addr,
                Event_Time,
                Event_Public_Date,
              } = event;
              return (
                <TableRow key={Event_Id}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {Event_Name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left", color: "black" }}>
                    {Event_Addr}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", color: "black" }}>
                    {Event_Public_Date
                      ? formatEventTime(Event_Public_Date)
                      : "ยังไม่ระบุ"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {Event_Time ? formatEventTime(Event_Time) : "ยังไม่ระบุ"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      sx={{
                        backgroundColor:
                          Event_Public === "Y" ? "green" : "#11131A1F",
                        padding: "4px 15px",
                        borderRadius: "30px",
                        "&:hover": {
                          backgroundColor:
                            Event_Public === "Y" ? "green" : "#11131A1F",
                        },
                      }}
                      className={Event_Public === "Y" ? "publish" : "unpublish"}
                    >
                      {Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                    </Button>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      // variant="contained"
                      style={{
                        // padding: "4px 15px",
                        borderRadius: "30px",
                        backgroundColor: "#0094FF",
                        color: "white",
                      }}
                      className={
                        Event_Status === 1
                          ? "pending"
                          : Event_Status === 2
                          ? "active"
                          : Event_Status === 3
                          ? "closed"
                          : "cancelled"
                      }
                    >
                      {Event_Status === 1
                        ? "รอเริ่มงาน"
                        : Event_Status === 2
                        ? "เริ่มงาน"
                        : Event_Status === 3
                        ? "ปิดงาน"
                        : Event_Status === 13
                        ? "ยกเลิก"
                        : ""}
                    </Button>
                  </TableCell>
                  <TableCell style={{ textAlign: "center", cursor: "pointer" }}>
                    <FaCopy onClick={() => handleCopyEventLink(Event_Id)} />
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      // color="primary"
                      onClick={() => navigate(`/edit-event/${Event_Id}`)}
                      style={{
                        padding: "4px 15px",
                        borderRadius: "4px",
                        backgroundColor: "#CFB70B",
                        color: "black",
                      }}
                    >
                      รายละเอียด
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

export default AllEventContent;
