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
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import { formatThaiDate } from "../../lib/util";
import Header from "../common/header";
import StartEndDatePickers from "../../components/common/input/date-picker/date";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./all-event-content.css";

// Extend dayjs with timezone and utc plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const MAX_ITEMS_PER_PAGE = 50;

// Helper function to format date in Bangkok timezone (UTC+7) and subtract 7 hours
const formatAndSubtract7Hours = (date: string): string => {
  return dayjs(date).subtract(7, "hour").tz("Asia/Bangkok").format("YYYY-MM-DD");
};

const formatDateStringInBangkok = (date: Dayjs | null): string | null => {
  return date ? date.tz("Asia/Bangkok").format("YYYY-MM-DD") : null;
};

const AllEventContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "publish-date", // Default filter by publish date
    publishStatus: "all",
    status: "all",
    search: "",
    startDate: null as string | null,
    endDate: null as string | null,
    dateFilterType: "publish-date", // Default to publish date
  });

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
    const eventLink = `${import.meta.env.VITE_CUSTOMER_URL}/event/${eventId}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("คัดลอกลิงก์งานสำเร็จ");
  }

  const handleUpdateFilters = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (startDate: Dayjs | null, endDate: Dayjs | null) => {
    setFilters((prev) => ({
      ...prev,
      startDate: formatDateStringInBangkok(startDate),
      endDate: formatDateStringInBangkok(endDate),
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: "publish-date",
      publishStatus: "all",
      status: "all",
      search: "",
      startDate: null,
      endDate: null,
      dateFilterType: "publish-date", // Reset to default filter type
    });
  };

  const filteredEvents = events
    ?.filter((event) => {
      // Filter by search
      if (filters.search && !event.Event_Name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filter by publish status
      if (filters.publishStatus !== "all") {
        const isPublished = filters.publishStatus === "published" ? "Y" : "N";
        if (event.Event_Public !== isPublished) {
          return false;
        }
      }

      // Filter by event status
      if (filters.status !== "all" && event.Event_Status !== parseInt(filters.status)) {
        return false;
      }

      // Subtract 7 hours from event dates before comparing
      const publishDate = formatAndSubtract7Hours(event.Event_Public_Date);
      const eventDate = formatAndSubtract7Hours(event.Event_Time);

      // Filter by date range based on selected date filter type (Publish Date or Event Date)
      if (filters.startDate && filters.endDate) {
        const eventDateToCompare =
          filters.dateFilterType === "publish-date"
            ? publishDate
            : eventDate;

        if (eventDateToCompare < filters.startDate || eventDateToCompare > filters.endDate) {
          return false;
        }
      }

      return true;
    })
    .slice(indexOfFirstItem, indexOfLastItem);

  if (isLoadingEventList) return <CircularProgress />;

  return (
    <div className="all-events-content">
      <Header title="งานทั้งหมด" />
      <div className="filters">
        <a href="/all-events/create-event" className="create-event-button">
          สร้าง Event ใหม่ +
        </a>

        <div className="filter-options">
          {/* Filter icons */}
          <div className="filter-item">
            <img src="/รอจัดงาน.svg" alt="รอจัดงาน icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">รอเริ่มงาน</span>
              <span className="filter-number">{events?.filter((event) => event.Event_Status === 1).length}</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/เริ่มงานแล้ว.svg" alt="เริ่มงานแล้ว icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">เริ่มงานแล้ว</span>
              <span className="filter-number">{events?.filter((event) => event.Event_Status === 2).length}</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/ปิดงาน.svg" alt="ปิดงาน icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">ปิดงาน</span>
              <span className="filter-number">{events?.filter((event) => event.Event_Status === 3).length}</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/ยกเลิก.svg" alt="ยกเลิก icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">ยกเลิก</span>
              <span className="filter-number">{events?.filter((event) => event.Event_Status === 13).length}</span>
            </div>
          </div>
        </div>

        {/* Date range and other filters */}
        <div className="additional-filters" style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "10px" }}>
          {/* Row 1: Search by event name, publish status, and event status */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            {/* Search Box */}
            <div style={{ width: "250px" }}>
              <input
                name="search"
                value={filters.search}
                onChange={handleUpdateFilters}
                type="text"
                placeholder="ค้นจากชื่องาน"
                className="search-box"
                style={{ height: "35px", width: "100%" }}
              />
            </div>

            {/* Publish Status */}
            <div className="filter-group" style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "3px", height: "100px" }}>
              <label htmlFor="publish-status" style={{ color: "black", marginRight: "5px" }}>สถานะเผยแพร่</label>
              <select
                id="publish-status"
                name="publishStatus"
                className="filter-select"
                value={filters.publishStatus}
                onChange={handleUpdateFilters}
                style={{ height: "50px" }}
              >
                <option value="all">ทั้งหมด</option>
                <option value="published">เผยแพร่</option>
                <option value="unpublished">ไม่เผยแพร่</option>
              </select>
            </div>

            {/* Event Status */}
            <div className="filter-group" style={{ paddingTop: "3px", height: "100px" }}>
              <label htmlFor="status" style={{ color: "black", marginRight: "5px" }}>สถานะ Event</label>
              <select
                id="status"
                name="status"
                className="filter-select"
                value={filters.status}
                onChange={handleUpdateFilters}
                style={{ height: "50px" }}
              >
                <option value="all">ทั้งหมด</option>
                <option value="1">รอเริ่มงาน</option>
                <option value="2">เริ่มงานแล้ว</option>
                <option value="3">ปิดงาน</option>
                <option value="13">ยกเลิก</option>
              </select>
            </div>
          </div>

          {/* Row 2: Date Filter */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", paddingLeft: "25px", paddingRight: "150px" }}>
            <div className="filter-group">
              <label htmlFor="date-filter-type" style={{ color: "black", marginRight: "5px" }}>ตัวกรองวันที่</label>
              <select
                id="date-filter-type"
                name="dateFilterType"
                className="filter-select"
                value={filters.dateFilterType}
                onChange={handleUpdateFilters}
                style={{ height: "50px" }}
              >
                <option value="publish-date">วันที่เผยแพร่</option>
                <option value="event-date">วันจัดงาน</option>
              </select>
            </div>

            {/* Date Picker */}
            <div style={{paddingTop:"25px"}}>
            <StartEndDatePickers
              startDate={filters.startDate ? dayjs(filters.startDate) : null}
              endDate={filters.endDate ? dayjs(filters.endDate) : null}
              onStartDateChange={(newValue) => handleDateRangeChange(newValue, filters.endDate ? dayjs(filters.endDate) : null)}
              onEndDateChange={(newValue) => handleDateRangeChange(filters.startDate ? dayjs(filters.startDate) : null, newValue)}
            />
            </div>
  
          </div>

          {/* Clear All Filters Button */}
          <div style={{ marginTop: "-10px", marginBottom: "0px", marginLeft: "25px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClearFilters}
              style={{ height: "40px" }}
            >
              ล้างการค้นหาทั้งหมด
            </Button>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>ลำดับ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>ชื่องาน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>สถานที่</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>วันที่เผยแพร่</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>วันจัดงาน</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>เผยแพร่</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>สถานะ</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>Link</TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", textAlign: "center" }}>รายละเอียด</TableCell>
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
                  <TableCell style={{ textAlign: "center" }}>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{Event_Name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{Event_Addr}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {Event_Public_Date
                      ? formatThaiDate({ date: Event_Public_Date, option: "datetime" })
                      : "ยังไม่ระบุ"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {Event_Time
                      ? formatThaiDate({ date: Event_Time, option: "datetime" })
                      : "ยังไม่ระบุ"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        border: "1px solid black",
                        borderRadius: "4px",
                      }}
                      className={Event_Public === "Y" ? "publish" : "unpublish"}
                    >
                      {Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                    </div>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        border: "1px solid black",
                        borderRadius: "4px",
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
                    </div>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <FaCopy onClick={() => handleCopyEventLink(Event_Id)} />
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/edit-event/${Event_Id}`)}
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

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
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
