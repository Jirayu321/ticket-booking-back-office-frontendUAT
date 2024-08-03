import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import AllEvent from './pages/all-event/all-event'
import Overview from './pages/overview/overview'
import CreateNewEvent from './pages/create-event/create-event'

function App() {
  return (
    <Router>
      <Toaster
  position="top-right"
  reverseOrder={false}
/>
      <Routes>
        {/* <Route path="/" element={<Main/>} /> */}
        <Route path="/overview" element={<Overview/>} />
        <Route path="/all-events" element={<AllEvent />} />
        <Route path="/create-event" element={<CreateNewEvent />} />
      </Routes>
    </Router>
  )
}

export default App
