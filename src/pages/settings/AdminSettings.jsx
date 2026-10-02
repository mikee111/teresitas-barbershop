import { useState, useRef, useEffect } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'
import { optimizeAvatarImage } from '../../utils/imageOptimizer'

function AdminSettings({ onUpdateUser, user }) {
  const getInitialName = () => {
    if (user?.name) return user.name
    if (user?.firstName) return `${user.firstName} ${user.lastName || ''}`.trim()
    return 'Mike Arvin Cruz'
  }

  const [fullName, setFullName] = useState(getInitialName)
  const [email, setEmail] = useState(() => user?.email || 'admin@teresitas.com')
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return user?.avatarUrl || (typeof window !== 'undefined' ? localStorage.getItem('tb_admin_avatar') : null) || null
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFeedback, setUploadFeedback] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const fileInputRef = useRef(null)

  // Sync state if user prop changes or loads from session
  useEffect(() => {
    if (user) {
      const persistedAvatar = typeof window !== 'undefined' ? localStorage.getItem('tb_admin_avatar') : null
      if (user.avatarUrl) {
        setAvatarUrl(user.avatarUrl)
      } else if (persistedAvatar) {
        setAvatarUrl(persistedAvatar)
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadFeedback('')

    try {
      // Compress and optimize image for mobile browsers & localStorage quota
      const dataUrl = await optimizeAvatarImage(file, 360, 360, 0.82)
      setAvatarUrl(dataUrl)

      // Save directly to dedicated admin avatar key as instant local fallback
      try {
        localStorage.setItem('tb_admin_avatar', dataUrl)
      } catch (err) {
        console.warn('LocalStorage save failed:', err)
      }

      if (onUpdateUser) {
        onUpdateUser({ avatarUrl: dataUrl })
      }

      setUploadFeedback('✓ Photo updated!')
      setTimeout(() => setUploadFeedback(''), 3500)
    } catch (err) {
      console.error('Failed to process image:', err)
      setUploadFeedback('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      if (e.target) {
        e.target.value = ''
      }
    }
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

    if (avatarUrl) {
      try {
        localStorage.setItem('tb_admin_avatar', avatarUrl)
      } catch {
        // ignore
      }
    }

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

          {/* Accessible off-screen file input linked to labels */}
          <input
            id="admin-photo-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              border: 0,
              opacity: 0,
            }}
          />

          {/* Avatar box is a tap-target on mobile */}
          <label
            htmlFor="admin-photo-input"
            className="admin-profile-avatar-box"
            style={{ cursor: 'pointer' }}
            title="Tap to change photo"
          >
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
          </label>

          {/* Change photo button as a native label so mobile Safari & Chrome open the file picker directly */}
          <label
            htmlFor="admin-photo-input"
            className="admin-profile-btn-photo"
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
          >
            <span>📷</span>
            <span>{isUploading ? 'Optimizing...' : 'Change Photo'}</span>
          </label>

          {uploadFeedback && (
            <span
              style={{
                fontSize: '0.84rem',
                color: uploadFeedback.startsWith('✓') ? '#166534' : '#dc2626',
                fontWeight: 600,
                marginTop: '0.2rem'
              }}
            >
              {uploadFeedback}
            </span>
          )}
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
