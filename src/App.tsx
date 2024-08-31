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
import AllTicketPage from "./pages/all-ticket/all-ticket";
import AllSeatPage from "./pages/all-seat/all-seat";
import LoginPage from "./pages/login/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

window.Buffer = Buffer;

function App() {
  return (
    <Router>
      <Toaster
        position="center-top"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // Duration in milliseconds (e.g., 5000ms = 5 seconds)
        }}
      />
      <Routes>
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
              <PayOptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pay-by"
          element={
            <ProtectedRoute>
              <PayByPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-orders"
          element={
            <ProtectedRoute>
              <AllOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-detail/:order_id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-tickets"
          element={
            // <ProtectedRoute>
              <AllTicketPage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/all-seats"
          element={
            // <ProtectedRoute>
              <AllSeatPage />
            // </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
