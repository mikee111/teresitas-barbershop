import { useState, useRef, useEffect } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'

function AdminSettings({ onUpdateUser, user }) {
  const getInitialName = () => {
    if (user?.name) return user.name
    if (user?.firstName) return `${user.firstName} ${user.lastName || ''}`.trim()
    return 'Mike Arvin Cruz'
  }

  const [fullName, setFullName] = useState(getInitialName)
  const [email, setEmail] = useState(() => user?.email || 'admin@teresitas.com')
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(() => user?.avatarUrl || null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const fileInputRef = useRef(null)

  // Sync state if user prop changes or loads from session
  useEffect(() => {
    if (user) {
      if (user.avatarUrl !== undefined) {
        setAvatarUrl(user.avatarUrl)
      }
      if (user.email) {
        setEmail(user.email)
      }
      const uName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      if (uName) {
        setFullName(uName)
      }
    }
  }, [user])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert file to permanent Base64 data URL so it survives reloads & logouts
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setAvatarUrl(dataUrl)
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

  const handleSaveChanges = (e) => {
    e.preventDefault()
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0] || 'Admin'
    const lastName = nameParts.slice(1).join(' ') || ''

    if (onUpdateUser) {
      onUpdateUser({
        firstName,
        lastName,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        avatarUrl
      })
    }
    setIsEditing(false)
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
    }, 3000)
  }

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return 'MC'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="appointment-table-shell admin-profile-shell">
      {/* Green Header Bar */}
      <div className="appointment-table-titlebar">
        <h2>Admin Profile</h2>
      </div>

      <div className="admin-profile-body">
        {/* Profile Picture Section */}
        <div className="admin-profile-picture-section">
          <label className="admin-profile-section-label">Profile Picture</label>

          <div className="admin-profile-avatar-box">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile Preview"
                className="admin-profile-avatar-img"
              />
            ) : (
              <span className="admin-profile-avatar-initials">
                {getInitials(fullName)}
              </span>
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
            className="admin-profile-btn-photo"
            onClick={handleTriggerPhoto}
          >
            <span>📷</span>
            <span>Change Photo</span>
          </button>
        </div>

        {/* Form Fields */}
        <form className="admin-profile-form" onSubmit={handleSaveChanges}>
          <div className="admin-profile-field">
            <label className="admin-profile-label" htmlFor="admin-full-name">
              Full Name
            </label>
            <input
              id="admin-full-name"
              type="text"
              className="admin-profile-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter full name"
            />
          </div>

          <div className="admin-profile-field">
            <label className="admin-profile-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="admin-profile-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter email address"
            />
          </div>

          {/* Action Buttons */}
          <div className="admin-profile-actions">
            {/* Blue Edit Button */}
            <button
              type="button"
              className="admin-profile-btn-edit"
              onClick={handleEditToggle}
            >
              <span>✏️</span>
              <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
            </button>

            {/* Green Save Changes Button */}
            <button
              type="submit"
              className="admin-profile-btn-save"
            >
              <span>💾</span>
              <span>Save Changes</span>
            </button>

            {savedSuccess && (
              <span className="admin-profile-toast">
                ✓ Changes saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings
