import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="ticketIcon"></div>
        <h1 className="logo">TICKET</h1>
      </div>
      <div className="menu">
        <ul>
          <h2 className="sidebarTitle">เมนูหลัก</h2>
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
            บัตรทั้งหมด
          </li>
          <li className="menu-item">
            <span className="icon">🎫</span>
            ที่นั่งทั้งหมด
          </li>
          <li className="menu-item">
            <span className="icon">📍</span>
            แสกนบัตร
          </li>
          <h2 className="sidebarTitle" >จัดการร้าน</h2>
          <li className="menu-item">
            <span className="icon">🔄</span>
            ผังร้าน
          </li>
          <li className="menu-item">
            <span className="icon">🏪</span>
            โซน
          </li>
          <li className="menu-item">
            <span className="icon">📍</span>
            ประเภทบัตร
          </li>
          <li className="menu-item">
            <span className="icon">📄</span>
            ตั้งค่าบริษัท
          </li>
          <h2 className="sidebarTitle">ทั่วไป</h2>
          <li className="menu-item">
            <span className="icon">🏢</span>
            Profile
          </li>
          <li className="menu-item">
            <span className="icon">👤</span>
            Role setting
          </li>
          <li className="menu-item">
            <span className="icon">⚙️</span>
            Setting
          </li>
        </ul>
      </div>
      <div className="logout">
        <button>
          Log-out
          <div className="logoutIcon"></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;