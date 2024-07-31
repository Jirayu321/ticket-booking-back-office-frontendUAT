import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import AllEvent from './pages/all-event/all-event'
import Main from './pages/main/main'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/dashboard" element={<Main/>} />
        <Route path="/all-event" element={<AllEvent />} />
      </Routes>
    </Router>
  )
}

export default App
