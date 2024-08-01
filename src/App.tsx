import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import AllEvent from './pages/all-event/all-event'
import Main from './pages/main/main'
import CreateNewEvent from './pages/create-event/create-event'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/dashboard" element={<Main/>} />
        <Route path="/all-event" element={<AllEvent />} />
        <Route path="/create-event" element={<CreateNewEvent />} />
      </Routes>
    </Router>
  )
}

export default App
