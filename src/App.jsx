import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Records from './pages/records';
import Abandoned from './pages/abandoned';
import DetailPage from './pages/detail-page';
import RecordsDetail from './pages/records/detail';

const App = () => {
  return (
    <div className="min-h-screen safe-area-inset">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/:id" element={<RecordsDetail />} />
          <Route path="/abandoned" element={<Abandoned />} />
          <Route path="/abandoned/:id" element={<DetailPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App