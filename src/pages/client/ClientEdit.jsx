import { useState } from 'react'
import '../../styles/SharedAdminTable.css'

function ClientEdit({ client, onClose, onSave }) {
  // Split existing full name into first and last name
  const nameParts = (client?.name || '').trim().split(' ')
  const defaultFirstName = nameParts[0] || ''
  const defaultLastName = nameParts.slice(1).join(' ') || ''

  const [formData, setFormData] = useState({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    contact: client?.contact || '',
    email: client?.email || '',
    status: client?.status || 'Active',
  })

  if (!client) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
    onSave({
      ...client,
      name: fullName,
      contact: formData.contact,
      email: formData.email,
      status: formData.status,
    })
  }

  return (
    <div className="appointment-modal-overlay">
      <div className="admin-modal-shell">

        {/* ── Green Titlebar ───────────────────────── */}
        <div className="admin-modal-titlebar">
          <h2>Edit Client</h2>
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
              <label htmlFor="client-firstName">First Name</label>
              <input
                id="client-firstName"
                name="firstName"
                type="text"
                className="admin-form-input"
                placeholder="e.g. Juan"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="client-lastName">Last Name</label>
              <input
                id="client-lastName"
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
              <label htmlFor="client-contact">Phone Number</label>
              <input
                id="client-contact"
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
              <label htmlFor="client-email">Email Address</label>
              <input
                id="client-email"
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
              <label htmlFor="client-status">Status</label>
              <select
                id="client-status"
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
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default ClientEdit
