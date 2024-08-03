import React, { useState } from 'react';
import Header from '../common/header'; // Assuming you have a reusable Header component
import './all-event-content.css';

const AllEventContent: React.FC = () => {
  const [events] = useState([
    { id: 1, code: 'P24060001', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'รอจัดงาน', publishStatus: 'ไม่เผยแพร่' },
    { id: 2, code: 'P24060002', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'เริ่มงานแล้ว', publishStatus: 'เผยแพร่' },
    { id: 3, code: 'P24060003', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'ปิดงาน', publishStatus: 'เผยแพร่' },
    { id: 4, code: 'P24060004', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'ยกเลิก', publishStatus: 'ไม่เผยแพร่' },
    { id: 5, code: 'P24060005', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'รอจัดงาน', publishStatus: 'เผยแพร่' },
    { id: 6, code: 'P24060006', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'เริ่มงานแล้ว', publishStatus: 'เผยแพร่' },
    { id: 7, code: 'P24060007', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'ปิดงาน', publishStatus: 'ไม่เผยแพร่' },
    { id: 8, code: 'P24060008', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'ยกเลิก', publishStatus: 'เผยแพร่' },
    { id: 9, code: 'P24060009', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'รอจัดงาน', publishStatus: 'ไม่เผยแพร่' },
    { id: 10, code: 'P24060010', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'เริ่มงานแล้ว', publishStatus: 'เผยแพร่' },
    { id: 11, code: 'P24060011', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'ปิดงาน', publishStatus: 'ไม่เผยแพร่' },
    { id: 12, code: 'P24060012', name: 'ILLSLICK LIVE CONCERT AT DEED...', startDate: '31/05/2567', endDate: '31/06/2567', publishDate: '31/05/2567', status: 'ยกเลิก', publishStatus: 'เผยแพร่' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  return (
    <div className="all-events-content">
      <Header title="งานทั้งหมด" />
      <div className="filters">
        <div className="date-picker-container">
          <input type="date" className="date-picker" />
          <span style={{ color: "black", paddingRight: "20px" }}>-</span>
          <input type="date" className="date-picker" />
          <a href="/create-event" className="create-event-button">สร้างงานใหม่ +</a>
        </div>
        <div className="filter-options">
          <div className="filter-item">
              <img src="/รอจัดงาน.svg" alt="รอจัดงาน icon" className="filter-icon" />
              <div className="filter-text-container">
                  <span className="filter-text">รอจัดงาน</span>
                  <span className="filter-number">15</span>
              </div>
          </div>
          <div className="filter-item">
              <img src="/เริ่มงานแล้ว.svg" alt="เริ่มงานแล้ว icon" className="filter-icon" />
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
      </div>
      <div className="event-list">
        <div className="event-list-header">
          <div className="column">ลำดับ</div>
          <div className="column">รหัสงาน</div>
          <div className="column">ชื่องาน</div>
          <div className="column">วันที่เผยแพร่</div>
          <div className="column">วันจัดงาน</div>
          <div className="column">เผยแพร่</div>
          <div className="column">สถานะ</div>
          <div className="column">รายละเอียด</div>
        </div>
        {currentItems.map((event, index) => (
          <div key={event.id} className="event-list-item">
            <div className="column" style={{fontWeight:"bold"}}>{indexOfFirstItem + index + 1}.</div>
            <div className="column">{event.code}</div>
            <div className="column">{event.name}</div>
            <div className="column">{event.startDate}</div>
            <div className="column">{event.endDate}</div>
            <div className={`column ${event.publishStatus === 'เผยแพร่' ? 'publish' : 'unpublish'}`}>{event.publishStatus}</div>
            <div className={`column ${event.status === 'รอจัดงาน' ? 'pending' : event.status === 'เริ่มงานแล้ว' ? 'active' : 'closed'}`}>{event.status}</div>
            <div className="column"><button className="details-button">รายละเอียด</button></div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
      </div>
    </div>
  );
};

export default AllEventContent;