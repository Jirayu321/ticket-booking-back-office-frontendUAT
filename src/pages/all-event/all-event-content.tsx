import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useFetchEventList } from "../../hooks/fetch-data/useFetchEventList";
import Header from "../common/header";
import "./all-event-content.css";
import { formatThaiDate } from "../../lib/util";
import { useNavigate } from "react-router-dom";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";

const AllEventContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data: events, isPending: isLoadingEventList } = useFetchEventList({
    eventId: null,
  });

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil((events?.length ?? 0) / itemsPerPage);

  function handleCopyEventLink(eventId: number) {
    const eventLink = `${import.meta.env.VITE_CUSTOMER_URL}/event/${eventId}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("คัดลอกลิงก์งานสำเร็จ");
  }

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
              <span className="filter-text">รอจัดงาน</span>
              <span className="filter-number">15</span>
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
              <span className="filter-number">15</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/ปิดงาน.svg" alt="ปิดงาน icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">ปิดงาน</span>
              <span className="filter-number">15</span>
            </div>
          </div>
          <div className="filter-item">
            <img src="/ยกเลิก.svg" alt="ยกเลิก icon" className="filter-icon" />
            <div className="filter-text-container">
              <span className="filter-text">ยกเลิก</span>
              <span className="filter-number">15</span>
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
              <option value="event-code">รหัสงาน</option>
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
          <div className="filter-group search-group">
            <input
              type="text"
              placeholder="รหัสงาน/ชื่องาน"
              className="search-box"
            />
            <button className="search-button">ค้นหา</button>
          </div>

          <div className="date-picker-container">
            <input type="date" className="date-picker" />
            <span style={{ color: "black", paddingRight: "20px" }}>-</span>
            <input type="date" className="date-picker" />
          </div>
        </div>
      </div>
      <div className="event-list">
        <div className="event-list-header">
          <div className="column">ลำดับ</div>
          <div className="column">รหัสงาน</div>
          <div className="column">สถานที่</div>
          <div className="column">วันที่เผยแพร่</div>
          <div className="column">วันจัดงาน</div>
          <div className="column">เผยแพร่</div>
          <div className="column">สถานะ</div>
          <div className="column">Link</div>
          <div className="column">รายละเอียด</div>
        </div>
        {events.map((event: any, index: number) => {
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
            <div key={Event_Id} className="event-list-item">
              <div className="column" style={{ fontWeight: "bold" }}>
                {indexOfFirstItem + index + 1}.
              </div>
              <div className="column">{Event_Name}</div>
              <div className="column">{Event_Addr}</div>
              <div className="column">
                {Event_Public_Date
                  ? formatThaiDate({
                      date: Event_Public_Date,
                      option: "datetime",
                    })
                  : "ยังไม่ระบุ"}
              </div>
              <div className="column">
                {Event_Time
                  ? formatThaiDate({
                      date: Event_Time,
                      option: "datetime",
                    })
                  : "ยังไม่ระบุ"}
              </div>
              <div
                className={`column ${
                  Event_Public === "Y" ? "publish" : "unpublish"
                }`}
              >
                {Event_Public === "Y" ? "เผยแพร่" : "ไม่เผยแพร่"}
              </div>
              <div
                className={`column ${
                  Event_Status === 1
                    ? "pending"
                    : Event_Status === 2
                    ? "active"
                    : Event_Status === 3
                    ? "closed"
                    : "cancelled"
                }`}
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
              <div className="column">
                <FaCopy onClick={() => handleCopyEventLink(Event_Id)} />
              </div>
              <div className="column">
                <button
                  onClick={() => navigate(`/edit-event/${Event_Id}`)}
                  className="details-button"
                >
                  รายละเอียด
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AllEventContent;
