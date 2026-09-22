import { useState, useEffect } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'
import { fetchRegisteredClients, subscribeToUsers } from '../../services/authService'

function CustomerAccounts() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [copiedId, setCopiedId] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Load customer accounts from Supabase and subscribe to real-time additions
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchRegisteredClients()
        if (isMounted && data) {
          setCustomers(data)
        }
      } catch (err) {
        console.error('Error fetching registered customers:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    // Realtime subscription: new registrations appear immediately
    const unsubscribe = subscribeToUsers((updated) => {
      if (isMounted && updated) {
        setCustomers(updated)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // Toggle password visibility for a row
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Copy password to clipboard
  const handleCopyPassword = (id, password) => {
    if (!password) return
    navigator.clipboard?.writeText(password)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  // Filter customers by search term
  const filteredCustomers = customers.filter((cust) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase().trim()
    const fullName = `${cust.firstName || ''} ${cust.middleName || ''} ${cust.lastName || ''}`.toLowerCase()
    const email = (cust.email || '').toLowerCase()
    const contact = (cust.contact || '').toLowerCase()
    const address = (cust.address || '').toLowerCase()
    return fullName.includes(term) || email.includes(term) || contact.includes(term) || address.includes(term)
  })

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return dateString
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Get initials for avatar badge
  const getInitials = (cust) => {
    const f = (cust.firstName || '').charAt(0).toUpperCase()
    const l = (cust.lastName || '').charAt(0).toUpperCase()
    return f + l || 'CU'
  }

  return (
    <div className="appointment-table-shell customer-accounts-shell">
      {/* Emerald Green Header Titlebar */}
      <div className="appointment-table-titlebar">
        <div>
          <h2>Customer Accounts Management</h2>
          <p className="customer-accounts-subtitle">
            Registered online customer profiles, registration details, and credentials
          </p>
        </div>

        <div className="customer-accounts-header-badge">
          <span>👥 {customers.length} Registered Customer{customers.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Control Bar: Search & Stats */}
      <div className="customer-accounts-controls">
        <div className="customer-accounts-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer name, email, contact, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="customer-accounts-clear-search"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="customer-accounts-stats-row">
          <div className="customer-stat-pill">
            <span className="stat-pill-label">Total Accounts:</span>
            <span className="stat-pill-value">{customers.length}</span>
          </div>
          <div className="customer-stat-pill active">
            <span className="stat-pill-label">Role:</span>
            <span className="stat-pill-value">Client / User</span>
          </div>
        </div>
      </div>

      {/* Main Accounts Table */}
      <div className="appointment-table-wrapper">
        {loading ? (
          <div className="customer-accounts-loading">
            <div className="customer-accounts-spinner"></div>
            <p>Loading customer accounts from database...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="customer-accounts-empty">
            <span className="empty-icon">👥</span>
            <h3>No Customer Accounts Found</h3>
            <p>
              {searchTerm
                ? `No customers match the search "${searchTerm}".`
                : 'No online customers have registered yet.'}
            </p>
          </div>
        ) : (
          <table className="appointment-table customer-accounts-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>CUSTOMER NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>CONTACT</th>
                <th>AGE & BIRTHDATE</th>
                <th>ADDRESS</th>
                <th>PASSWORD</th>
                <th>REGISTERED DATE</th>
                <th style={{ textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust, idx) => {
                const isPassVisible = visiblePasswords[cust.id]
                const isCopied = copiedId === cust.id

                return (
                  <tr key={cust.id || idx}>
                    {/* Index */}
                    <td className="customer-index-cell">
                      <span className="customer-avatar-initials">
                        {getInitials(cust)}
                      </span>
                    </td>

                    {/* Full Name */}
                    <td>
                      <div className="customer-name-cell">
                        <strong>
                          {cust.firstName} {cust.middleName ? `${cust.middleName} ` : ''}{cust.lastName}
                        </strong>
                        <span className="customer-role-tag">Customer</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span className="customer-email-link">
                        {cust.email || '—'}
                      </span>
                    </td>

                    {/* Contact */}
                    <td>
                      <span className="customer-contact-text">
                        {cust.contact || 'Not provided'}
                      </span>
                    </td>

                    {/* Age & Birthdate */}
                    <td>
                      <div className="customer-age-cell">
                        <span className="customer-age-badge">
                          {cust.age ? `${cust.age} yrs old` : 'Age N/A'}
                        </span>
                        {cust.birthdate && (
                          <small className="customer-birthdate-text">
                            🎂 {formatDate(cust.birthdate)}
                          </small>
                        )}
                      </div>
                    </td>

                    {/* Address */}
                    <td>
                      <span className="customer-address-text" title={cust.address}>
                        {cust.address || '—'}
                      </span>
                    </td>

                    {/* Password with Show/Hide & Copy */}
                    <td>
                      <div className="customer-password-cell">
                        <span className="customer-password-display">
                          {isPassVisible ? (
                            cust.password || 'No password'
                          ) : (
                            '••••••••'
                          )}
                        </span>
                        <div className="customer-password-actions">
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => togglePasswordVisibility(cust.id)}
                            title={isPassVisible ? 'Hide Password' : 'Show Password'}
                            aria-label={isPassVisible ? 'Hide Password' : 'Show Password'}
                          >
                            {isPassVisible ? '🙈' : '👁️'}
                          </button>
                          {cust.password && (
                            <button
                              type="button"
                              className={`password-copy-btn ${isCopied ? 'copied' : ''}`}
                              onClick={() => handleCopyPassword(cust.id, cust.password)}
                              title={isCopied ? 'Copied!' : 'Copy Password'}
                              aria-label="Copy Password"
                            >
                              {isCopied ? '✓' : '📋'}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td>
                      <span className="customer-date-text">
                        {formatDate(cust.createdAt)}
                      </span>
                    </td>

                    {/* Action: View Details */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="customer-btn-view"
                        onClick={() => setSelectedCustomer(cust)}
                        title="View Full Profile Details"
                      >
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Customer Profile Details Modal */}
      {selectedCustomer && (
        <div className="customer-modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="customer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div className="customer-modal-title-wrap">
                <div className="customer-modal-avatar">
                  {getInitials(selectedCustomer)}
                </div>
                <div>
                  <h3>
                    {selectedCustomer.firstName}{' '}
                    {selectedCustomer.middleName ? `${selectedCustomer.middleName} ` : ''}
                    {selectedCustomer.lastName}
                  </h3>
                  <span className="customer-modal-role">Registered Customer Account</span>
                </div>
              </div>
              <button
                type="button"
                className="customer-modal-close"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="customer-modal-body">
              {/* Personal Information Section */}
              <div className="customer-modal-section">
                <h4 className="customer-modal-section-title">👤 Personal Information</h4>
                <div className="customer-modal-grid">
                  <div className="customer-modal-item">
                    <label>First Name</label>
                    <span>{selectedCustomer.firstName || '—'}</span>
                  </div>
                  <div className="customer-modal-item">
                    <label>Middle Name</label>
                    <span>{selectedCustomer.middleName || '—'}</span>
                  </div>
                  <div className="customer-modal-item">
                    <label>Last Name</label>
                    <span>{selectedCustomer.lastName || '—'}</span>
                  </div>
                  <div className="customer-modal-item">
                    <label>Birthdate</label>
                    <span>{formatDate(selectedCustomer.birthdate)}</span>
                  </div>
                  <div className="customer-modal-item">
                    <label>Age</label>
                    <span>{selectedCustomer.age ? `${selectedCustomer.age} years old` : '—'}</span>
                  </div>
                  <div className="customer-modal-item">
                    <label>Account Role</label>
                    <span className="badge-role">{selectedCustomer.role || 'user'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="customer-modal-section">
                <h4 className="customer-modal-section-title">📍 Contact & Address</h4>
                <div className="customer-modal-grid">
                  <div className="customer-modal-item full-width">
                    <label>Email Address</label>
                    <span>{selectedCustomer.email || '—'}</span>
                  </div>
                  <div className="customer-modal-item">
                    <label>Contact Number</label>
                    <span>{selectedCustomer.contact || 'Not provided'}</span>
                  </div>
                  <div className="customer-modal-item full-width">
                    <label>Home Address</label>
                    <span>{selectedCustomer.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Account Credentials Section */}
              <div className="customer-modal-section">
                <h4 className="customer-modal-section-title">🔑 Account Security & Registration Info</h4>
                <div className="customer-modal-grid">
                  <div className="customer-modal-item">
                    <label>Account Password</label>
                    <div className="customer-modal-password-box">
                      <code>
                        {visiblePasswords[selectedCustomer.id]
                          ? selectedCustomer.password || 'No password'
                          : '••••••••••••'}
                      </code>
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => togglePasswordVisibility(selectedCustomer.id)}
                      >
                        {visiblePasswords[selectedCustomer.id] ? '🙈 Hide' : '👁️ Show'}
                      </button>
                    </div>
                  </div>
                  <div className="customer-modal-item">
                    <label>Registered On</label>
                    <span>{formatDate(selectedCustomer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="customer-modal-footer">
              <button
                type="button"
                className="customer-modal-btn-close"
                onClick={() => setSelectedCustomer(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerAccounts
