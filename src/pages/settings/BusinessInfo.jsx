import { useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'

function BusinessInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [formData, setFormData] = useState({
    barbershopName: "Mike's Classic Barbershop",
    contactNumber: '0917 123 4567',
    email: 'contact@mikesbarbershop.com',
    address: '123 Main Street, Quezon City',
  })

  const [hoursData, setHoursData] = useState({
    monday: { open: '09:00 AM', close: '08:00 PM', isClosed: false },
    tuesday: { open: '09:00 AM', close: '08:00 PM', isClosed: false },
    wednesday: { open: '09:00 AM', close: '08:00 PM', isClosed: false },
    thursday: { open: '09:00 AM', close: '08:00 PM', isClosed: false },
    friday: { open: '09:00 AM', close: '08:00 PM', isClosed: false },
    saturday: { open: '09:00 AM', close: '09:00 PM', isClosed: false },
    sunday: { open: '09:00 AM', close: '06:00 PM', isClosed: true },
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHoursChange = (day, type, value) => {
    setHoursData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }))
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
    setSavedSuccess(false)
  }

  const handleSaveChanges = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
    }, 3000)
  }

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ]

  return (
    <div className="appointment-table-shell business-info-shell">
      {/* Green Header Bar */}
      <div className="appointment-table-titlebar">
        <h2>Business Information</h2>
      </div>

      <div className="business-info-body">
        <form className="business-info-form" onSubmit={handleSaveChanges}>
          {/* Barbershop Name */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="barbershop-name">
              Barbershop Name
            </label>
            <input
              id="barbershop-name"
              type="text"
              className="business-info-input"
              value={formData.barbershopName}
              onChange={(e) => handleInputChange('barbershopName', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter barbershop name"
            />
          </div>

          {/* Contact Number */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="contact-number">
              Contact Number
            </label>
            <input
              id="contact-number"
              type="text"
              className="business-info-input"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter contact number"
            />
          </div>

          {/* Email */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="business-email">
              Email
            </label>
            <input
              id="business-email"
              type="email"
              className="business-info-input"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter email address"
            />
          </div>

          {/* Address */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="business-address">
              Address
            </label>
            <input
              id="business-address"
              type="text"
              className="business-info-input"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter business address"
            />
          </div>

          {/* Divider */}
          <div className="business-info-divider"></div>

          {/* Business Hours Section */}
          <div className="business-hours-section">
            <h3 className="business-hours-heading">Business Hours</h3>

            <div className="business-hours-list">
              {days.map(({ key, label }) => {
                const dayData = hoursData[key]
                return (
                  <div key={key} className="business-hours-row">
                    <span className="business-hours-day">{label}</span>

                    {dayData.isClosed ? (
                      <div className="business-hours-times">
                        <span className="business-hours-closed-badge">[ Closed ]</span>
                      </div>
                    ) : (
                      <div className="business-hours-times">
                        <input
                          type="text"
                          className="business-hours-input"
                          value={dayData.open}
                          onChange={(e) => handleHoursChange(key, 'open', e.target.value)}
                          disabled={!isEditing}
                        />
                        <span className="business-hours-dash">-</span>
                        <input
                          type="text"
                          className="business-hours-input"
                          value={dayData.close}
                          onChange={(e) => handleHoursChange(key, 'close', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="business-info-actions">
            {/* Blue Edit Button */}
            <button
              type="button"
              className="business-info-btn-edit"
              onClick={handleEditToggle}
            >
              <span>✏️</span>
              <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
            </button>

            {/* Green Save Changes Button */}
            <button
              type="submit"
              className="business-info-btn-save"
            >
              <span>💾</span>
              <span>Save Changes</span>
            </button>

            {savedSuccess && (
              <span className="business-info-toast">
                ✓ Changes saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default BusinessInfo
