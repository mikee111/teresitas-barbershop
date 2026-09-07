import { useState } from 'react'
import '../../styles/barberscrew/BarberEdit.css'

const positionOptions = [
  'Senior Barber',
  'Barber',
  'Junior Barber',
  'Master Barber',
]

const scheduleOptions = [
  'Monday - Saturday',
  'Tuesday - Sunday',
  'Monday - Friday',
  'Wednesday - Monday',
  'Thursday - Tuesday',
  'Everyday (Mon - Sun)',
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

function AddBarber({ onClose, onSave, inline = false }) {
  const [formData, setFormData] = useState({
    name: '',
    position: 'Barber',
    specialty: 'Fade Specialist',
    phone: '',
    email: '',
    schedule: 'Monday - Saturday',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    status: 'Active',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      await onSave({
        name: formData.name.trim(),
        position: formData.position,
        specialty: formData.specialty.trim() || 'General Barbering',
        phone: formData.phone.trim() || '0917 123 4567',
        email:
          formData.email.trim() ||
          `${formData.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
        schedule: formData.schedule,
        startTime: formData.startTime,
        endTime: formData.endTime,
        hours: `${formData.startTime} - ${formData.endTime}`,
        status: formData.status,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const content = (
    <div className={`barber-edit-shell${inline ? ' barber-edit-panel--inline' : ''}`}>
      <div className="barber-edit-titlebar">
        <h2>Add New Barber</h2>
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
            <label htmlFor="add-barber-name" className="barber-edit-label">
              Full Name *
            </label>
            <input
              id="add-barber-name"
              name="name"
              type="text"
              className="barber-edit-input"
              placeholder="e.g. Antonio Santos"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          {/* Position */}
          <div className="barber-edit-field">
            <label htmlFor="add-barber-position" className="barber-edit-label">
              Position
            </label>
            <select
              id="add-barber-position"
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

          {/* Specialty */}
          <div className="barber-edit-field">
            <label htmlFor="add-barber-specialty" className="barber-edit-label">
              Specialty / Skills
            </label>
            <input
              id="add-barber-specialty"
              name="specialty"
              type="text"
              className="barber-edit-input"
              placeholder="e.g. Fade Specialist, Scissor Work"
              value={formData.specialty}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="barber-edit-field">
            <label htmlFor="add-barber-status" className="barber-edit-label">
              Status
            </label>
            <select
              id="add-barber-status"
              name="status"
              className="barber-edit-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Phone */}
          <div className="barber-edit-field">
            <label htmlFor="add-barber-phone" className="barber-edit-label">
              Phone Number *
            </label>
            <input
              id="add-barber-phone"
              name="phone"
              type="tel"
              className="barber-edit-input"
              placeholder="e.g. 0917 123 4567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="barber-edit-field">
            <label htmlFor="add-barber-email" className="barber-edit-label">
              Email Address
            </label>
            <input
              id="add-barber-email"
              name="email"
              type="email"
              className="barber-edit-input"
              placeholder="e.g. barber@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Schedule / Working Days */}
          <div className="barber-edit-field full-width">
            <label htmlFor="add-barber-schedule" className="barber-edit-label">
              Working Days
            </label>
            <select
              id="add-barber-schedule"
              name="schedule"
              className="barber-edit-select"
              value={formData.schedule}
              onChange={handleChange}
            >
              {scheduleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Working Hours */}
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
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="barber-edit-btn barber-edit-btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Barber'}
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

export default AddBarber
