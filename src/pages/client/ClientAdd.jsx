import { useState } from 'react'
import '../../styles/SharedAdminTable.css'

function ClientAdd({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    status: 'Active',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
    onSave({
      id: Date.now(),
      name: fullName,
      contact: formData.contact,
      email: formData.email,
      status: formData.status,
      totalVisits: 0,
      lastVisit: '—',
      totalSpent: '₱0',
      history: [],
    })
  }

  return (
    <div className="appointment-modal-overlay">
      <div className="admin-modal-shell">

        {/* ── Green Titlebar ───────────────────────── */}
        <div className="admin-modal-titlebar">
          <h2>Add New Client</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Form Body ────────────────────────────── */}
        <form className="admin-modal-body" onSubmit={handleSubmit}>
          <div className="admin-form-grid">

            {/* Row 1 — First Name | Last Name (2 columns) */}
            <div className="admin-form-group">
              <label htmlFor="add-client-firstName">First Name</label>
              <input
                id="add-client-firstName"
                name="firstName"
                type="text"
                className="admin-form-input"
                placeholder="e.g. Juan"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="add-client-lastName">Last Name</label>
              <input
                id="add-client-lastName"
                name="lastName"
                type="text"
                className="admin-form-input"
                placeholder="e.g. Dela Cruz"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 2 — Phone Number (full width) */}
            <div className="admin-form-group full-width">
              <label htmlFor="add-client-contact">Phone Number</label>
              <input
                id="add-client-contact"
                name="contact"
                type="tel"
                className="admin-form-input"
                placeholder="e.g. 0912-345-6789"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 3 — Email Address (full width) */}
            <div className="admin-form-group full-width">
              <label htmlFor="add-client-email">Email Address</label>
              <input
                id="add-client-email"
                name="email"
                type="email"
                className="admin-form-input"
                placeholder="e.g. juan@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Row 4 — Status (full width) */}
            <div className="admin-form-group full-width">
              <label htmlFor="add-client-status">Status</label>
              <select
                id="add-client-status"
                name="status"
                className="admin-form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ── Buttons ──────────────────────────────── */}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn-danger-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-submit">
              Add Client
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default ClientAdd
