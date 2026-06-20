// @ts-nocheck
import { useState, useEffect } from 'react'

const API = 'http://localhost:3001'

export default function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/leads`)
      const data = await res.json()
      setLeads(data)
    } catch {
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filtered = filter === 'all'
    ? leads
    : leads.filter(lead => {
        return lead.service.includes(filter)
      })

  return (
    <div className="leads-section">
      <h2>Leads ({filtered.length})</h2>

      <div className="filter-bar">
        <label>Filter by service:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="delivery">Delivery</option>
          <option value="pick-up">Pick-up</option>
          <option value="payment">Payment</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">No leads found</p>
      ) : (
        <div className="leads-list">
          {filtered.map(lead => (
            <div key={lead.id} className="lead-card">
              <strong>{lead.name}</strong>
              <span>{lead.email}</span>
              <span>{lead.mobile}</span>
              <span className="postcode">{lead.postcode}</span>
              <div className="services">
                {lead.service.map(s => (
                  <span key={s} className="service-tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
