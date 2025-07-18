import Swal from "sweetalert2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AllEvent from "./pages/all-event/all-event";
import Overview from "./pages/overview/overview"; //สรุปยอดตาม สรุปยอดตาม Event
import Overview2 from "./pages/overview/orerview2"; // สรุปยอดตาม แยกตามการซื้อ ของ Event

import Overview3 from "./pages/overview/orerview3"; //สรุปยอดตาม Top 10 ยอดขาย ของ Event
import Overview4 from "./pages/overview/orerview4";  //สรุปยอดตาม ลูกค้าที่ซื้อบัตรซ้ำ
import Overview5 from "./pages/overview/orerview5";  //สรุปยอดตาม รายการยกเลิก

import Employee from "./pages/emp/emp";
import Company from "./pages/company/company";
import CreateNewEvent from "./pages/create-event/create-event";
import ZoneGroup from "./pages/zone-group/zone-group";
import ZonePage from "./pages/zone/zone";
import TicketTypePage from "./pages/ticket-type/ticket-type";
import PayOptionPage from "./pages/pay-option/pay-option";
import PayByPage from "./pages/pay-by/pay-by";
import { Buffer } from "buffer";
import EditEventPage from "./pages/edit-event/EditEventPage";
import AllOrder from "./pages/all-order/all-order";
import OrderDetailPage from "./pages/order-detail/order-detail";
import AllStockPage from "./pages/all-stock/all-stock";
import AllSeatPage from "./pages/all-seat/all-seat";
import LoginPage from "./pages/login/LoginPage";
import Dashboard from "./pages/dashboard/dashboardPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

import MoveTheTablePage from "./pages/move-the-table/move-the-table";
import OrderReqTablePage from "./pages/all-order-request/order-request-table";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";

window.Buffer = Buffer;

Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    container: "swal-custom-zindex",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview2"
            element={
              <ProtectedRoute>
                <Overview2 />
              </ProtectedRoute>
            }
          />

            <Route
            path="/overview3"
            element={
              <ProtectedRoute>
                <Overview3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview4"
            element={
              <ProtectedRoute>
                <Overview4 />
              </ProtectedRoute>
            }
          />
            <Route
            path="/overview5"
            element={
              <ProtectedRoute>
                <Overview5 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-events"
            element={
              <ProtectedRoute>
                <AllEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-events/create-event"
            element={
              <ProtectedRoute>
                <CreateNewEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-event/:eventId"
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/zone"
            element={
              <ProtectedRoute>
                <ZonePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/zone-group"
            element={
              <ProtectedRoute>
                <ZoneGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket-type"
            element={
              <ProtectedRoute>
                <TicketTypePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pay-option"
            element={
              <ProtectedRoute>
                {" "}
                <PayOptionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pay-by"
            element={
              <ProtectedRoute>
                {" "}
                <PayByPage />
              </ProtectedRoute>
            }
          />
          <Route path="/all-orders" element={<AllOrder />} />
          <Route
            path="/order-detail/:order_id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-stocks"
            element={
              <ProtectedRoute>
                <AllStockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-seats"
            element={
              <ProtectedRoute>
                <AllSeatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings-company"
            element={
              <ProtectedRoute>
                <Company />
              </ProtectedRoute>
            }
          />

          <Route
            path="/move-the-table"
            element={
              <ProtectedRoute>
                <MoveTheTablePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-request-table"
            element={
              <ProtectedRoute>
                <OrderReqTablePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-mabile"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
