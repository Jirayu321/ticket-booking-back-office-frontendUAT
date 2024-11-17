import { Box } from "@mui/material";
import "./header.css";
// เมนูหลัก
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventSeatIcon from "@mui/icons-material/EventSeat";
// จัดการร้าน
import MapIcon from "@mui/icons-material/Map";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import PaymentIcon from "@mui/icons-material/Payment";
import PaidIcon from "@mui/icons-material/Paid";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SettingsIcon from "@mui/icons-material/Settings";

const Header = ({ title }) => {
  return (
    <div className="header">
      <Box display="flex">
        {/* เมนูหลัก */}
        {title === "/overview" ||
          (title === "ภาพรวม" && (
            <DashboardIcon
              sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
            />
          ))}

        {title === "/all-event" ||
          (title === "งานทั้งหมด" && (
            <EventIcon
              sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
            />
          ))}

        {title === "/all-orders" ||
          (title === "คำสั่งซื้อทั้งหมด" && (
            <ShoppingCartIcon
              sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
            />
          ))}

        {title === "/all-stocks" ||
          (title === "สต๊อกทั้งหมด" && (
            <ConfirmationNumberIcon
              sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
            />
          ))}

        {title === "/all-seats" ||
          (title === "ที่นั่งทั้งหมด" && (
            <EventSeatIcon
              sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
            />
          ))}

        {/* จัดการร้าน */}
        {title === "/zone-group-content" ||
          (title === "ผังร้าน" && (
            <MapIcon sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }} />
          ))}

        {(title === "/zone" || title === "โซน") && (
          <FullscreenIcon
            sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
          />
        )}

        {(title === "/ticket-type-content" || title === "ประเภทบัตร") && (
          <LocalActivityIcon
            sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
          />
        )}

        {(title === "/pay-option-content" || title === "วิธีการจ่ายเงิน") && (
          <PaymentIcon
            sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
          />
        )}

        {(title === "/pay-by-content" || title === "ตัวเลือกการจ่ายเงิน") && (
          <PaidIcon sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }} />
        )}

        {(title === "/employee" || title === "ตั้งค่าบริษัท") && (
          <SettingsIcon
            sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
          />
        )}

        {(title === "/settings-company" || title === "ตั้งค่าพนักงาน") && (
          <ManageAccountsIcon
            sx={{ marginTop: 0.9, paddingTop: 0.6, color: "#000" }}
          />
        )}
        
        <h1 style={{ marginTop: 1 }}>{title}</h1>
      </Box>
    </div>
  );
};

export default Header;
