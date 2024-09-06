import Swal from "sweetalert2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import AllEvent from "./pages/all-event/all-event";
import Overview from "./pages/overview/overview";
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
import ProtectedRoute from "./components/common/ProtectedRoute";

window.Buffer = Buffer;

// Set global configuration for SweetAlert2 with a higher z-index
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
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // Duration in milliseconds (e.g., 5000ms = 5 seconds)
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
        <Route path="/zone" element={<ZonePage />} />
        <Route path="/zone-group" element={<ZoneGroup />} />
        <Route path="/ticket-type" element={<TicketTypePage />} />
        <Route path="/pay-option" element={<PayOptionPage />} />
        <Route path="/pay-by" element={<PayByPage />} />
        <Route path="/all-orders" element={<AllOrder />} />
        <Route path="/order-detail/:order_id" element={<OrderDetailPage />} />
        <Route path="/all-stocks" element={<AllStockPage />} />
        <Route path="/all-seats" element={<AllSeatPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
