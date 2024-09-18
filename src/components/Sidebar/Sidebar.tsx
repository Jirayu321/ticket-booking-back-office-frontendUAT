
import './Sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PaymentIcon from '@mui/icons-material/Payment';
import PaidIcon from '@mui/icons-material/Paid';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { logOut } from "../../services/auth.service";
import toast from "react-hot-toast";

const Sidebar: React.FC = () => {
  const [activePath, setActivePath] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  function handleSignOut() {
    logOut();
    toast.success("ออกจากระบบเรียบร้อยแล้ว");
    navigate(0);
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="ticketIcon"></div>
        <h1 className="logo">TICKET</h1>
      </div>
      <div className="menu">
        <ul>
          <h2 className="sidebarTitle">เมนูหลัก</h2>
          <li
            className={`menu-item ${
              activePath === "/overview" ? "active" : ""
            }`}
          >
            <Link to="/overview">
              <DashboardIcon style={{ paddingRight: "10px" }} />
              ภาพรวม
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/all-events" ? "active" : ""
            }`}
          >
            <Link to="/all-events">
              <EventIcon style={{ paddingRight: "10px" }} />
              Event ทั้งหมด
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/all-orders" ||
              activePath.startsWith("/order-detail")
                ? "active"
                : ""
            }`}
          >
            <Link to="/all-orders">
              <ShoppingCartIcon style={{ paddingRight: "10px" }} />
              คำสั่งซื้อทั้งหมด
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/all-stocks" ? "active" : ""
            }`}
          >
            <Link to="/all-stocks">
              <ConfirmationNumberIcon style={{ paddingRight: "10px" }} />
              สต๊อกทั้งหมด
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/all-seats" ? "active" : ""
            }`}
          >
            <Link to="/all-seats">
              <EventSeatIcon style={{ paddingRight: "10px" }} />
              ที่นั่งทั้งหมด
            </Link>
          </li>
          <h2 className="sidebarTitle">จัดการร้าน</h2>
          <li
            className={`menu-item ${
              activePath === "/zone-group" ? "active" : ""
            }`}
          >
            <Link to="/zone-group">
              <span className="icon">🔄</span>
              ผังร้าน
            </Link>
          </li>
          <li className={`menu-item ${activePath === "/zone" ? "active" : ""}`}>
            <Link to="/zone">
              <span className="icon">🏪</span>
              โซน
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/ticket-type" ? "active" : ""
            }`}
          >
            <Link to="/ticket-type">
              <LocalActivityIcon style={{ paddingRight: "10px" }} />
              ประเภทบัตร
            </Link>
          </li>
          <li
            className={`menu-item ${activePath === "/pay-by" ? "active" : ""}`}
          >
            <Link to="/pay-by">
              <PaymentIcon style={{ paddingRight: "10px" }} />
              วิธีการจ่ายเงิน
            </Link>
          </li>
          <li
            className={`menu-item  ${
              activePath === "/pay-option" ? "active" : ""
            }`}
          >
            <Link to="/pay-option">
              <PaidIcon style={{ paddingRight: "10px" }} />
              ตัวเลือกการจ่ายเงิน
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/employee" ? "active" : ""
            }`}
          >
            <Link to="/employee">
              <ManageAccountsIcon style={{ paddingRight: "10px" }} />
              ตั้งค่าบริษัท
            </Link>
          </li>
          <h2 className="sidebarTitle">ทั่วไป</h2>
          <li
            className={`menu-item ${activePath === "/profile" ? "active" : ""}`}
          >
            <Link to="/profile">
              <AccountCircleIcon style={{ paddingRight: "10px" }} />
              Profile
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/role-settings" ? "active" : ""
            }`}
          >
            <Link to="/role-settings">
              <span className="icon">👤</span>
              Role setting
            </Link>
          </li>
          <li
            className={`menu-item ${
              activePath === "/settings" ? "active" : ""
            }`}
          >
            <Link to="/settings">
              <span className="icon">⚙️</span>
              Setting
            </Link>
          </li>
        </ul>
      </div>
      <div className="logout">
        <button onClick={handleSignOut}>
          Log-out
          <div className="logoutIcon"></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
