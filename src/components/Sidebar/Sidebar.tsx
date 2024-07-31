import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">TICKET</h1>
      </div>
      <div className="menu">
        <ul>
          <li className="menu-item active">
            <span className="icon">🔄</span>
            ภาพรวม
          </li>
          <li className="menu-item">
            <span className="icon">🛒</span>
            งานทั้งหมด
          </li>
          <li className="menu-item">
            <span className="icon">📦</span>
            คำสั่งซื้อทั้งหมด
          </li>
          <li className="menu-item">
            <span className="icon">💳</span>
            การชำระเงิน
          </li>
          <li className="menu-item">
            <span className="icon">🎫</span>
            บัตรทั้งหมด
          </li>
          <li className="menu-item">
            <span className="icon">📍</span>
            ที่นั่งทั้งหมด
          </li>
          <li className="menu-item">
            <span className="icon">🔄</span>
            แลกเปลี่ยนบัตร
          </li>
          <li className="menu-item">
            <span className="icon">🏪</span>
            ผังร้าน
          </li>
          <li className="menu-item">
            <span className="icon">📍</span>
            โซน
          </li>
          <li className="menu-item">
            <span className="icon">📄</span>
            ปริมาณบัตร
          </li>
          <li className="menu-item">
            <span className="icon">🏢</span>
            Restaurant Detail
          </li>
          <li className="menu-item">
            <span className="icon">👤</span>
            Profile
          </li>
          <li className="menu-item">
            <span className="icon">⚙️</span>
            Role Setting
          </li>
          <li className="menu-item">
            <span className="icon">⚙️</span>
            Setting
          </li>
        </ul>
      </div>
      <div className="logout">
        <button>Log-out</button>
      </div>
    </div>
  );
};

export default Sidebar;
