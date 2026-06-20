import { Routes, Route, Link } from 'react-router-dom'
import SubmitPage from './SubmitPage'
import LeadsPage from './LeadsPage'

export default function App() {
  return (
    <div className="container">
      <nav>
        <Link to="/">Register Interest</Link>
        <Link to="/leads">View Leads</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SubmitPage />} />
        <Route path="/leads" element={<LeadsPage />} />
      </Routes>
    </div>
  )
}
