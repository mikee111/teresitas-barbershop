import { useState } from 'react'
import '../../styles/barberscrew/BarberEdit.css'

const positionOptions = [
  'Senior Barber',
  'Barber',
  'Junior Barber',
  'Master Barber',
]

const timeOptions = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
]

function EditBarber({ barber, onClose, onSave, inline = false }) {
  if (!barber) {
    return null
  }

  const [formData, setFormData] = useState({
    name: barber.name || '',
    phone: barber.phone || '0917 123 4567',
    email: barber.email || `${barber.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
    position: barber.position || 'Barber',
    startTime: barber.startTime || '9:00 AM',
    endTime: barber.endTime || '6:00 PM',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...barber,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      position: formData.position,
      startTime: formData.startTime,
      endTime: formData.endTime,
      hours: `${formData.startTime} - ${formData.endTime}`,
    })
  }

  const content = (
    <div className={`barber-edit-shell${inline ? ' barber-edit-panel--inline' : ''}`}>
      <div className="barber-edit-titlebar">
        <h2>Edit Barber</h2>
        <button
          type="button"
          className="barber-edit-close-x"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <form className="barber-edit-body" onSubmit={handleSubmit}>
        <div className="barber-edit-grid">
          {/* Full Name */}
          <div className="barber-edit-field">
            <label htmlFor="name" className="barber-edit-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="barber-edit-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Position */}
          <div className="barber-edit-field">
            <label htmlFor="position" className="barber-edit-label">
              Position
            </label>
            <select
              id="position"
              name="position"
              className="barber-edit-select"
              value={formData.position}
              onChange={handleChange}
            >
              {positionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div className="barber-edit-field">
            <label htmlFor="phone" className="barber-edit-label">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="barber-edit-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="barber-edit-field">
            <label htmlFor="email" className="barber-edit-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="barber-edit-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Schedule */}
          <div className="barber-edit-field full-width">
            <label className="barber-edit-label">Working Hours</label>
            <div className="barber-edit-schedule-row">
              <select
                name="startTime"
                className="barber-edit-select"
                value={formData.startTime}
                onChange={handleChange}
                aria-label="Start time"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="barber-edit-schedule-dash">to</span>
              <select
                name="endTime"
                className="barber-edit-select"
                value={formData.endTime}
                onChange={handleChange}
                aria-label="End time"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="barber-edit-actions">
          <button
            type="button"
            className="barber-edit-btn barber-edit-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="barber-edit-btn barber-edit-btn-save"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )

  if (inline) {
    return content
  }

  return <div className="appointment-modal-overlay">{content}</div>
}

export default EditBarber
