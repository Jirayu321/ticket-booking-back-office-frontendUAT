import React from 'react';
import { Link } from 'react-router-dom';
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
            <Link to="/overview">
              <span className="icon">🔄</span>
              ภาพรวม
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/all-events">
              <span className="icon">🛒</span>
              งานทั้งหมด
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/all-orders">
              <span className="icon">📦</span>
              คำสั่งซื้อทั้งหมด
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/all-tickets">
              <span className="icon">💳</span>
              บัตรทั้งหมด
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/all-seats">
              <span className="icon">🎫</span>
              ที่นั่งทั้งหมด
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/scan-tickets">
              <span className="icon">📍</span>
              แสกนบัตร
            </Link>
          </li>
          <h2 className="sidebarTitle">จัดการร้าน</h2>
          <li className="menu-item">
            <Link to="/store-layout">
              <span className="icon">🔄</span>
              ผังร้าน
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/zones">
              <span className="icon">🏪</span>
              โซน
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/ticket-types">
              <span className="icon">📍</span>
              ประเภทบัตร
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/company-settings">
              <span className="icon">📄</span>
              ตั้งค่าบริษัท
            </Link>
          </li>
          <h2 className="sidebarTitle">ทั่วไป</h2>
          <li className="menu-item">
            <Link to="/profile">
              <span className="icon">🏢</span>
              Profile
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/role-settings">
              <span className="icon">👤</span>
              Role setting
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/settings">
              <span className="icon">⚙️</span>
              Setting
            </Link>
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