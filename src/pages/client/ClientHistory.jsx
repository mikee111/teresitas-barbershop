import '../../styles/SharedAdminTable.css'
import '../../styles/client/Client.css'

function ClientHistory({ client, onBack }) {
  if (!client) return null

  const historyItems = client.history || []

  // Calculate totals from history
  const totalSpent = historyItems.reduce((sum, item) => {
    const rawPrice = item.price !== undefined && item.price !== null ? String(item.price) : '0'
    const num = parseFloat(rawPrice.replace(/[₱,\s]/g, ''))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)

  // Find most frequent barber
  const barberCount = historyItems.reduce((acc, item) => {
    const bName = item.barber || 'Unassigned'
    acc[bName] = (acc[bName] || 0) + 1
    return acc
  }, {})
  const favoriteBarber = Object.keys(barberCount).sort((a, b) => barberCount[b] - barberCount[a])[0] || '—'

  return (
    <div className="appointment-table-shell">
      {/* Green Titlebar — consistent with all other admin pages */}
      <div className="appointment-table-titlebar">
        <div className="client-titlebar-left">
          <button type="button" className="client-back-btn-inline" onClick={onBack}>
            ← Back
          </button>
          <h2>Service History</h2>
        </div>
      </div>

      {/* Client Info Strip */}
      <div className="client-info-strip">
        <div className="client-info-left">
          <div className="client-info-avatar">👤</div>
          <div className="client-info-meta">
            <span className="client-info-name">{client.name}</span>
            <span className="client-info-contact">{client.contact}</span>
          </div>
        </div>

        <div className="bc-status-cell">
          <span
            className={`bc-status-dot ${
              client.status === 'Active' ? 'bc-dot-active' : 'bc-dot-inactive'
            }`}
          />
          <span
            className={`appointment-status ${
              client.status === 'Active' ? 'confirmed' : 'cancelled'
            }`}
          >
            {client.status}
          </span>
        </div>
      </div>

      {/* Stat Pills — 4 items: Total Visits | Last Visit | Total Spent | Served By */}
      <div className="client-stats-strip">
        <div className="client-stat-pill">
          <span className="client-stat-pill-label">Total Visits</span>
          <span className="client-stat-pill-value">{client.totalVisits}</span>
        </div>
        <div className="client-stat-divider" />
        <div className="client-stat-pill">
          <span className="client-stat-pill-label">Last Visit</span>
          <span className="client-stat-pill-value">{client.lastVisit}</span>
        </div>
        <div className="client-stat-divider" />
        <div className="client-stat-pill">
          <span className="client-stat-pill-label">Total Spent</span>
          <span className="client-stat-pill-value client-stat-spent">
            {client.totalSpent || `₱${totalSpent.toLocaleString()}`}
          </span>
        </div>
        <div className="client-stat-divider" />
        <div className="client-stat-pill">
          <span className="client-stat-pill-label">✂️ Barber (Served By)</span>
          <span className="client-stat-pill-value client-stat-barber">{favoriteBarber}</span>
        </div>
      </div>

      {/* History Table */}
      <div className="appointment-table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th>Date</th>
              <th>Service</th>
              <th>Barber</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}
                >
                  No service history found for this client.
                </td>
              </tr>
            ) : (
              <>
                {historyItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <span className="client-visit-num">{historyItems.length - index}</span>
                    </td>
                    <td>{item.date}</td>
                    <td>
                      <span className="client-service-name">{item.service}</span>
                    </td>
                    <td>
                      <div className="client-barber-cell">
                        <span className="client-barber-tag">
                          ✂️ {item.barber}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="service-price-badge">{item.price}</span>
                    </td>
                  </tr>
                ))}

                {/* Summary footer row */}
                <tr className="client-summary-row">
                  <td colSpan="1" />
                  <td>
                    <span className="client-summary-label">Summary</span>
                  </td>
                  <td>
                    <span className="client-summary-count">{client.totalVisits} total visits</span>
                  </td>
                  <td />
                  <td>
                    <span className="client-summary-total">
                      {client.totalSpent || `₱${totalSpent.toLocaleString()}`} total
                    </span>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientHistory
