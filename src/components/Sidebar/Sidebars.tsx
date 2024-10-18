// Sidebars.tsx
import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, Modal } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../services/auth.service";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import MapIcon from "@mui/icons-material/Map";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import PaymentIcon from "@mui/icons-material/Payment";
import PaidIcon from "@mui/icons-material/Paid";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

import LogoutIcon from "@mui/icons-material/Logout";
import { keyframes } from "@emotion/react";

const Sidebars: React.FC = () => {
  const [isCollapsed, setisCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleSignOut = () => {
    logOut();
    toast.success("ออกจากระบบเรียบร้อยแล้ว");
    navigate(0);
  };

  const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
  const handleViewProfile = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const emmpToken = JSON.parse(localStorage.getItem("emmp"));
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar
        collapsed={isCollapsed}
        breakPoint="md"
        backgroundColor="#1a1a1a"
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <Menu>
              {/* LOGO */}
              <MenuItem
                onClick={() => setisCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{ margin: "10px 0 20px 0" }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <div className="ticketIcon"></div>
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#ffd700",
                      }}
                    >
                      TICKET
                    </Typography>
                    <IconButton
                      sx={{
                        color: "white",
                        animation: `${rotateAnimation} 1s ease-in-out`,
                      }}
                      onClick={() => setisCollapsed(!isCollapsed)}
                    >
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
              <div
                style={{
                  padding: "0 24px",
                  marginBottom: "8px",
                  marginTop: "32px",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  style={{
                    opacity: isCollapsed ? 0 : 0.5,
                    letterSpacing: "0.5px",
                  }}
                >
                  เมนูหลัก
                </Typography>
              </div>
              <Link
                to="/overview"
                className={`menu-bars ${
                  activePath === "/overview" ? "active" : ""
                }`}
              >
                <MenuItem icon={<DashboardIcon />}>ภาพรวม</MenuItem>
              </Link>
              <Link
                to="/all-events"
                className={`menu-bars ${
                  activePath === "/all-events" ? "active" : ""
                }`}
              >
                <MenuItem icon={<EventIcon />}>Event ทั้งหมด</MenuItem>
              </Link>
              <Link
                to="/all-orders"
                className={`menu-bars ${
                  activePath === "/all-orders" ? "active" : ""
                }`}
              >
                <MenuItem icon={<ShoppingCartIcon />}>
                  คำสั่งซื้อทั้งหมด
                </MenuItem>
              </Link>
              <Link
                to="/all-stocks"
                className={`menu-bars ${
                  activePath === "/all-stocks" ? "active" : ""
                }`}
              >
                <MenuItem icon={<ConfirmationNumberIcon />}>
                  สต๊อกทั้งหมด
                </MenuItem>
              </Link>
              <Link
                to="/all-seats"
                className={`menu-bars ${
                  activePath === "/all-seats" ? "active" : ""
                }`}
              >
                <MenuItem icon={<EventSeatIcon />}>ที่นั่งทั้งหมด</MenuItem>
              </Link>
            </Menu>

            <div
              style={{
                padding: "0 24px",
                marginBottom: "8px",
                marginTop: "32px",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: isCollapsed ? 0 : 0.5,
                  letterSpacing: "0.5px",
                }}
              >
                จัดการร้าน
              </Typography>
            </div>

            <Menu>
              <Link
                to="/zone-group"
                className={`menu-bars ${
                  activePath === "/zone-group" ? "active" : ""
                }`}
              >
                <MenuItem icon={<MapIcon />}>ผังร้าน</MenuItem>
              </Link>
              <Link
                to="/zone"
                className={`menu-bars ${
                  activePath === "/zone" ? "active" : ""
                }`}
              >
                <MenuItem icon={<FullscreenIcon />}>โซน</MenuItem>
              </Link>
              <Link
                to="/ticket-type"
                className={`menu-bars ${
                  activePath === "/ticket-type" ? "active" : ""
                }`}
              >
                <MenuItem icon={<LocalActivityIcon />}>ประเภทบัตร</MenuItem>
              </Link>
              <Link
                to="/pay-by"
                className={`menu-bars ${
                  activePath === "/pay-by" ? "active" : ""
                }`}
              >
                <MenuItem icon={<PaymentIcon />}>วิธีการจ่ายเงิน</MenuItem>
              </Link>
              <Link
                to="/pay-option"
                className={`menu-bars ${
                  activePath === "/pay-option" ? "active" : ""
                }`}
              >
                <MenuItem icon={<PaidIcon />}>ตัวเลือกการจ่ายเงิน</MenuItem>
              </Link>
              <Link
                to="/employee"
                className={`menu-bars ${
                  activePath === "/employee" ? "active" : ""
                }`}
              >
                <MenuItem icon={<ManageAccountsIcon />}>ตั้งค่าบริษัท</MenuItem>
              </Link>
            </Menu>
            <div
              style={{
                padding: "0 24px",
                marginBottom: "8px",
                marginTop: "32px",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: isCollapsed ? 0 : 0.5,
                  letterSpacing: "0.5px",
                }}
              >
                ทั่วไป
              </Typography>
            </div>
            <Menu>
              {/* <Link
                to="/profile"
                className={`menu-bars ${
                  activePath === "/profile" ? "active" : ""
                }`}
              > */}
              <MenuItem
                icon={<AccountCircleIcon />}
                onClick={handleViewProfile}
              >
                Profile
              </MenuItem>
              {/* </Link> */}
              <Link
                to="/role-settings"
                className={`menu-bars ${
                  activePath === "/role-settings" ? "active" : ""
                }`}
              >
                <MenuItem icon={<AssignmentIndIcon />}>ตั้งค่าผู้ใช้</MenuItem>
              </Link>
              {/* <Link
                to="/settings"
                className={`menu-bars ${
                  activePath === "/settings" ? "active" : ""
                }`}
              >
                <MenuItem icon={<SettingsIcon />}>Setting</MenuItem>
              </Link> */}
              <MenuItem
                icon={<LogoutIcon />}
                className="menu-bars"
                onClick={handleSignOut}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            width: "25vw",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <div style={{ color: "black" }}>
            <p>
              <strong>รหัสพนักงาน:</strong>
              <span style={{marginLeft:10}}>{emmpToken?.Emp_UUser || ""}</span>
            </p>
            <p>
              <strong>ชื่อ:</strong>
              <span style={{marginLeft:10}}>{emmpToken?.Emp_Name || ""}</span>
            </p>
            <p>
              <strong>ตำแหน่ง:</strong>
              <span style={{marginLeft:10}}>{emmpToken?.Emp_Position_Detail || ""}</span>
            </p>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Sidebars;
