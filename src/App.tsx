import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import AllEvent from './pages/all-event/all-event';
import Overview from './pages/overview/overview';
import CreateNewEvent from './pages/create-event/create-event';
import ZoneGroup from './pages/zone-group/zone-group';
import Zone from './pages/zone/zone';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/all-events" element={<AllEvent />} />
        <Route path="/all-events/create-event" element={<CreateNewEvent />} />
        <Route path="/zone" element={<Zone />} />
        <Route path="/zone-group" element={<ZoneGroup />} />
      </Routes>
    </Router>
  );
}

export default App;
