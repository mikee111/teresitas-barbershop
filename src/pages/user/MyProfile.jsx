import { useState, useRef, useEffect } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'
import '../../styles/MyProfile.css'

function MyProfile({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Juan',
    middleName: user?.middleName || 'Santos',
    lastName: user?.lastName || 'Dela Cruz',
    email: user?.email || 'user@teresitas.com',
    contact: user?.contact || '0917-890-1234',
    birthdate: user?.birthdate || '1998-05-15',
    age: user?.age ? String(user.age) : '28',
    address: user?.address || '123 Rizal St., Sampaloc, Manila',
    password: user?.password || 'user123'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const fileInputRef = useRef(null)

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        middleName: user.middleName || prev.middleName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        contact: user.contact || prev.contact,
        birthdate: user.birthdate || prev.birthdate,
        age: user.age ? String(user.age) : prev.age,
        address: user.address || prev.address,
        password: user.password || prev.password
      }))
      // Sync avatar from parent (e.g. after re-login)
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl)
    }
  }, [user])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setAvatarUrl(dataUrl)
      // Immediately propagate to parent so top-right avatar updates in real time
      if (onUpdateUser) {
        onUpdateUser({ avatarUrl: dataUrl })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleTriggerPhoto = () => {
    fileInputRef.current?.click()
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
    setSavedSuccess(false)
  }

  // Auto-calculate age if birthdate changes
  const handleBirthdateChange = (e) => {
    const val = e.target.value
    let calculatedAge = formData.age
    if (val) {
      const birth = new Date(val)
      if (!isNaN(birth.getTime())) {
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--
        }
        if (age >= 0 && age <= 120) {
          calculatedAge = age.toString()
        }
      }
    }
    setFormData((prev) => ({ ...prev, birthdate: val, age: calculatedAge }))
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setSavedSuccess(true)

    if (onUpdateUser) {
      onUpdateUser({
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        contact: formData.contact.trim(),
        birthdate: formData.birthdate,
        age: formData.age ? parseInt(formData.age, 10) : null,
        address: formData.address.trim(),
        password: formData.password,
        // Include avatar so it persists on save as well
        avatarUrl: avatarUrl || undefined
      })
    }

    setTimeout(() => {
      setSavedSuccess(false)
    }, 3500)
  }

  const getInitials = (first, last) => {
    const f = (first || '').charAt(0).toUpperCase()
    const l = (last || '').charAt(0).toUpperCase()
    return f + l || 'JD'
  }

  return (
    <div className="appointment-table-shell customer-accounts-shell user-profile-shell">
      {/* Header Bar matching Customer Accounts Management design */}
      <div className="appointment-table-titlebar user-profile-titlebar">
        <div className="user-profile-title-group">
          <h2>MY PROFILE</h2>
          <p className="customer-accounts-subtitle user-profile-subtitle">
            Personal customer profile, contact information, and account settings
          </p>
        </div>

        {/* Right side: Badge and Edit Profile Button */}
        <div className="user-profile-header-right">
          <div className="customer-accounts-header-badge user-profile-header-badge">
            <span>👤 Client Account</span>
          </div>
          <button
            type="button"
            className={`user-profile-nav-edit-btn ${isEditing ? 'active' : ''}`}
            onClick={handleEditToggle}
            title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
          >
            <span>{isEditing ? '✕ Cancel Edit' : '✏️ Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="admin-profile-body user-profile-body">
        {/* Profile Picture Section */}
        <div className="admin-profile-picture-section">
          <label className="admin-profile-section-label">Profile Picture</label>

          <div className="admin-profile-avatar-box user-avatar-box">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile Preview"
                className="admin-profile-avatar-img"
              />
            ) : (
              <div className="user-profile-avatar-placeholder">
                <span className="user-avatar-initials-text">
                  {getInitials(formData.firstName, formData.lastName)}
                </span>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="admin-profile-btn-photo user-photo-btn"
            onClick={handleTriggerPhoto}
          >
            <span>📷</span>
            <span>Change Photo</span>
          </button>
        </div>

        {/* Form Fields matching Admin Profile */}
        <form className="admin-profile-form user-profile-form" onSubmit={handleSaveChanges}>
          {/* Row 1: First Name & Middle Name */}
          <div className="user-form-row">
            <div className="admin-profile-field">
              <label className="admin-profile-label" htmlFor="user-first-name">
                First Name
              </label>
              <input
                id="user-first-name"
                type="text"
                className="admin-profile-input"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="admin-profile-field">
              <label className="admin-profile-label" htmlFor="user-middle-name">
                Middle Name
              </label>
              <input
                id="user-middle-name"
                type="text"
                className="admin-profile-input"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter middle name"
              />
            </div>
          </div>

          {/* Row 2: Last Name & Email */}
          <div className="user-form-row">
            <div className="admin-profile-field">
              <label className="admin-profile-label" htmlFor="user-last-name">
                Last Name
              </label>
              <input
                id="user-last-name"
                type="text"
                className="admin-profile-input"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="admin-profile-field">
              <label className="admin-profile-label" htmlFor="user-email">
                Email Address
              </label>
              <input
                id="user-email"
                type="email"
                className="admin-profile-input"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* Row 3: Contact & Birthdate */}
          <div className="user-form-row">
            <div className="admin-profile-field">
              <label className="admin-profile-label" htmlFor="user-contact">
                Contact Number
              </label>
              <input
                id="user-contact"
                type="text"
                className="admin-profile-input"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                disabled={!isEditing}
                placeholder="0917-000-0000"
              />
            </div>

            <div className="admin-profile-field">
              <label className="admin-profile-label" htmlFor="user-birthdate">
                Birthdate
              </label>
              <input
                id="user-birthdate"
                type="date"
                className="admin-profile-input"
                value={formData.birthdate}
                onChange={handleBirthdateChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Row 4: Age & Address */}
          <div className="user-form-row">
            <div className="admin-profile-field user-field-age">
              <label className="admin-profile-label" htmlFor="user-age">
                Age
              </label>
              <input
                id="user-age"
                type="text"
                className="admin-profile-input"
                value={formData.age ? `${formData.age} yrs old` : ''}
                readOnly
                disabled
                placeholder="Auto-calculated"
              />
            </div>

            <div className="admin-profile-field user-field-address">
              <label className="admin-profile-label" htmlFor="user-address">
                Complete Address
              </label>
              <input
                id="user-address"
                type="text"
                className="admin-profile-input"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="Complete street address, city"
              />
            </div>
          </div>

          {/* Row 5: Account Password */}
          <div className="admin-profile-field">
            <label className="admin-profile-label" htmlFor="user-password">
              Account Password
            </label>
            <div className="user-profile-password-wrap">
              <input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-profile-input user-profile-password-input"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={!isEditing}
                placeholder="Account password"
              />
              <button
                type="button"
                className="user-password-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="admin-profile-actions user-profile-actions">
            {/* Edit Button */}
            <button
              type="button"
              className="admin-profile-btn-edit user-btn-edit"
              onClick={handleEditToggle}
            >
              <span>✏️</span>
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            {/* Save Changes Button (Green Accent) */}
            <button
              type="submit"
              className="admin-profile-btn-save user-btn-save"
              disabled={!isEditing}
            >
              <span>💾</span>
              <span>Save Changes</span>
            </button>

            {savedSuccess && (
              <span className="admin-profile-toast user-profile-toast">
                ✓ Profile changes saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MyProfile
