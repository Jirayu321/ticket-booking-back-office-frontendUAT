import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [activePath, setActivePath] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="ticketIcon"></div>
        <h1 className="logo">TICKET</h1>
      </div>
      <div className="menu">
        <ul>
          <h2 className="sidebarTitle">เมนูหลัก</h2>
          <li className={`menu-item ${activePath === '/overview' ? 'active' : ''}`}>
            <Link to="/overview">
              <span className="icon">🔄</span>
              ภาพรวม
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/all-events' ? 'active' : ''}`}>
            <Link to="/all-events">
              <span className="icon">🛒</span>
              Event ทั้งหมด
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/all-orders' || activePath.startsWith('/order-detail') ? 'active' : ''}`}>
            <Link to="/all-orders">
              <span className="icon">📦</span>
              คำสั่งซื้อทั้งหมด
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/all-tickets' ? 'active' : ''}`}>
            <Link to="/all-tickets">
              <span className="icon">💳</span>
              บัตรทั้งหมด
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/all-seats' ? 'active' : ''}`}>
            <Link to="/all-seats">
              <span className="icon">🎫</span>
              ที่นั่งทั้งหมด
            </Link>
          </li>
          <h2 className="sidebarTitle">จัดการร้าน</h2>
          <li className={`menu-item ${activePath === '/zone-group' ? 'active' : ''}`}>
            <Link to="/zone-group">
              <span className="icon">🔄</span>
              ผังร้าน
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/zone' ? 'active' : ''}`}>
            <Link to="/zone">
              <span className="icon">🏪</span>
              โซน
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/ticket-type' ? 'active' : ''}`}>
            <Link to="/ticket-type">
              <span className="icon">📍</span>
              ประเภทบัตร
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/pay-by' ? 'active' : ''}`}>
            <Link to="/pay-by">
              <span className="icon">📍</span>
              วิธีการจ่ายเงิน
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/pay-option' ? 'active' : ''}`}>
            <Link to="/pay-option">
              <span className="icon">📍</span>
              ตัวเลือกการจ่ายเงิน
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/company-settings' ? 'active' : ''}`}>
            <Link to="/company-settings">
              <span className="icon">📄</span>
              ตั้งค่าบริษัท
            </Link>
          </li>
          <h2 className="sidebarTitle">ทั่วไป</h2>
          <li className={`menu-item ${activePath === '/profile' ? 'active' : ''}`}>
            <Link to="/profile">
              <span className="icon">🏢</span>
              Profile
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/role-settings' ? 'active' : ''}`}>
            <Link to="/role-settings">
              <span className="icon">👤</span>
              Role setting
            </Link>
          </li>
          <li className={`menu-item ${activePath === '/settings' ? 'active' : ''}`}>
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
