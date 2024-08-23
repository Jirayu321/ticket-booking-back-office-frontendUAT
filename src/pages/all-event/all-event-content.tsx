import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import { formatThaiDate } from "../../lib/util";
import Header from "../common/header";
import "./all-event-content.css";
import { formatThaiDate } from "../../lib/util";
import { useNavigate } from "react-router-dom";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";

const MAX_ITEMS_PER_PAGE = 10;

const AllEventContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "publish-date",
    publishStatus: "all",
    status: "all",
    search: "",
  });

  function handleUpdateFilters(event: React.ChangeEvent<any>) {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

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

  const eventCounts = events?.reduce(
    (acc, event) => {
      if (event.Event_Status === 1) {
        acc.pending += 1;
      } else if (event.Event_Status === 2) {
        acc.active += 1;
      } else if (event.Event_Status === 3) {
        acc.closed += 1;
      } else if (event.Event_Status === 13) {
        acc.cancelled += 1;
      }
      return acc;
    },
    { pending: 0, active: 0, closed: 0, cancelled: 0 }
  );

  const eventsInCurrentPage =
    events
      ?.slice(indexOfFirstItem, indexOfLastItem)
      .filter((event: any) => event.Event_Name.includes(filters.search)) ?? [];

  if (isLoadingEventList) return <CircularProgress />;

  return (
    <div className="all-events-content">
      <Header title="งานทั้งหมด" />
      <div className="filters">
        <a href="/all-events/create-event" className="create-event-button">
          สร้าง Event ใหม่ +
        </a>
        <div className="filter-options">
          <div className="filter-item">
            <img
              src="/รอจัดงาน.svg"
              alt="รอจัดงาน icon"
              className="filter-icon"
            />
            <div className="filter-text-container">
              <span className="filter-text">รอเริ่มงาน</span>
              <span className="filter-number">{eventCounts?.pending}</span>
            </div>
          </div>
          <div className="filter-item">
            <img
              src="/เริ่มงานแล้ว.svg"
              alt="เริ่มงานแล้ว icon"
              className="filter-icon"
            />
            <div className="filter-text-container">
              <span className="filter-text">เริ่มงานแล้ว</span>
              <span className="filter-number">{eventCounts?.active}</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/ปิดงาน.svg" alt="ปิดงาน icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">ปิดงาน</span>
              <span className="filter-number">{eventCounts?.closed}</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/ยกเลิก.svg" alt="ยกเลิก icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">ยกเลิก</span>
              <span className="filter-number">{eventCounts?.cancelled}</span>
            </div>
          </div>
        </div>

        <div className="additional-filters">
          <div className="filter-group">
            <label htmlFor="sort-by">เรียงตาม:</label>
            <select id="sort-by" className="filter-select">
              <option value="publish-date">วันที่เผยแพร่</option>
              <option value="order">ลำดับ</option>
              <option value="event-date">วันจัดงาน</option>
              <option value="event-code">ชื่องาน</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="publish-status">เผยแพร่:</label>
            <select id="publish-status" className="filter-select">
              <option value="all">ทั้งหมด</option>
              <option value="published">เผยแพร่</option>
              <option value="unpublished">ไม่เผยแพร่</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="status">สถานะ:</label>
            <select id="status" className="filter-select">
              <option value="pending">รอจัดงาน</option>
              <option value="active">เริ่มงานแล้ว</option>
              <option value="cancelled">ยกเลิก</option>
              <option value="closed">ปิดงาน</option>
            </select>
          </div>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <input
              name="search"
              value={filters.search}
              onChange={handleUpdateFilters}
              type="text"
              placeholder="รหัสงาน/ชื่องาน"
              className="search-box"
            />
          </Stack>

          <div className="date-picker-container">
            <input type="date" className="date-picker" />
            <span style={{ color: "black", paddingRight: "20px" }}>-</span>
            <input type="date" className="date-picker" />
          </div>
        </div>
      </div>

      {/* Table Component */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>ลำดับ</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>ชื่องาน</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>สถานที่</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>วันที่เผยแพร่</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>วันจัดงาน</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>เผยแพร่</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>สถานะ</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>Link</TableCell>
              <TableCell style={{fontWeight:"bold",fontSize:"20px"}}>รายละเอียด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventsInCurrentPage.map((event: any, index: number) => {
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
                  <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                  <TableCell>{Event_Name}</TableCell>
                  <TableCell>{Event_Addr}</TableCell>
                  <TableCell>
                    {Event_Public_Date
                      ? formatThaiDate({
                          date: Event_Public_Date,
                          option: "datetime",
                        })
                      : "ยังไม่ระบุ"}
                  </TableCell>
                  <TableCell>
                    {Event_Time
                      ? formatThaiDate({
                          date: Event_Time,
                          option: "datetime",
                        })
                      : "ยังไม่ระบุ"}
                  </TableCell>
                  <TableCell
                    style={{color:"black"}}
                    className={Event_Public === "Y" ? "publish" : "unpublish"}
                  >
                    {Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
                  </TableCell>
                  <TableCell
                  style={{color:"white"}}
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
                  </TableCell>
                  <TableCell>
                    <FaCopy onClick={() => handleCopyEventLink(Event_Id)} />
                  </TableCell>
                  <TableCell>
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
