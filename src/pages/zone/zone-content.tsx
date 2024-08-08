import React, { useState } from 'react';
import Header from '../common/header'; // Assuming you have a reusable Header component
import './zone-content.css';

const ZoneContent: React.FC = () => {
  const [zones] = useState([
    { id: 1, code: 'Z001', name: 'โซนสีแดง', status: 'พร้อมใช้งาน', startDate: '31/05/2567' },
    { id: 2, code: 'Z002', name: 'โซนสีเขียว', status: 'พร้อมใช้งาน', startDate: '31/05/2567' },
    // Add more zones as needed
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = zones.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(zones.length / itemsPerPage);

  return (
    <div className="zone-content">
      <Header title="โซน" />
      <div className="filters">
        <a href="/create-zone" className="create-zone-button">เพิ่มรายการ +</a>
        <div className="additional-filters">
          <div className="filter-group search-group">
            <input type="text" placeholder="ค้นหา" className="search-box" />
            <button className="search-button">ค้นหา</button>
          </div>
        </div>
      </div>
      <div className="zone-list">
        <div className="zone-list-header">
          <div className="column">ลำดับ</div>
          <div className="column">รหัสโซน</div>
          <div className="column">ชื่อโซน</div>
          <div className="column">สถานะ</div>
          <div className="column">วันที่เริ่มใช้งาน</div>
          <div className="column">รายละเอียด</div>
        </div>
        {currentItems.map((zone, index) => (
          <div key={zone.id} className="zone-list-item">
            <div className="column" style={{ fontWeight: 'bold' }}>{indexOfFirstItem + index + 1}.</div>
            <div className="column">{zone.code}</div>
            <div className="column">{zone.name}</div>
            <div className={`column ${zone.status === 'พร้อมใช้งาน' ? 'active' : 'inactive'}`}>{zone.status}</div>
            <div className="column">{zone.startDate}</div>
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

export default ZoneContent;
