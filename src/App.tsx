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

window.Buffer = Buffer;

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
        <Route path="/overview" element={<Overview />} />
        <Route path="/all-events" element={<AllEvent />} />
        <Route path="/all-events/create-event" element={<CreateNewEvent />} />
        <Route path="/edit-event/:eventId" element={<EditEventPage />} />
        <Route path="/zone" element={<ZonePage />} />
        <Route path="/zone-group" element={<ZoneGroup />} />
        <Route path="/ticket-type" element={<TicketTypePage />} />
        <Route path="/pay-option" element={<PayOptionPage />} />
        <Route path="/pay-by" element={<PayByPage />} />
        <Route path="/all-orders" element={<AllOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
