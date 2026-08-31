import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/UserDashboard.css'
import '../../styles/MyProfile.css'

const DEFAULT_PASSWORD = 'user123'

function getInitials(firstName, lastName) {
  const first = (firstName || '')[0] || ''
  const last = (lastName || '')[0] || ''
  return `${first}${last}`.toUpperCase() || 'CL'
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13
}

function MyProfile({ user, onUpdateUser = () => {} }) {
  const profile = useMemo(
    () => ({
      firstName: user?.firstName || 'Juan',
      lastName: user?.lastName || 'Dela Cruz',
      email: user?.email || 'user@teresitas.com',
      contact: user?.contact || '0912-345-6789',
      password: user?.password || DEFAULT_PASSWORD,
    }),
    [user]
  )

  const [personalForm, setPersonalForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    contact: profile.contact,
  })
  const [personalErrors, setPersonalErrors] = useState({})
  const [personalToast, setPersonalToast] = useState(null)

  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: '',
  })
  const [emailError, setEmailError] = useState('')

  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!personalToast) return undefined

    const timer = window.setTimeout(() => {
      setPersonalToast(null)
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [personalToast])

  const fullName = `${profile.firstName} ${profile.lastName}`.trim()

  const isPersonalDirty =
    personalForm.firstName.trim() !== profile.firstName ||
    personalForm.lastName.trim() !== profile.lastName ||
    personalForm.contact.trim() !== profile.contact

  const handlePersonalChange = (e) => {
    const { name, value } = e.target
    setPersonalForm((prev) => ({ ...prev, [name]: value }))
    setPersonalErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePersonalCancel = () => {
    setPersonalForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      contact: profile.contact,
    })
    setPersonalErrors({})
    setPersonalToast(null)
  }

  const handlePersonalSave = (e) => {
    e.preventDefault()
    const errors = {}

    if (!personalForm.firstName.trim()) {
      errors.firstName = 'First name is required.'
    }
    if (!personalForm.lastName.trim()) {
      errors.lastName = 'Last name is required.'
    }
    if (!personalForm.contact.trim()) {
      errors.contact = 'Contact number is required.'
    } else if (!isValidPhone(personalForm.contact)) {
      errors.contact = 'Enter a valid contact number (10–13 digits).'
    }

    if (Object.keys(errors).length > 0) {
      setPersonalErrors(errors)
      return
    }

    const updates = {
      firstName: personalForm.firstName.trim(),
      lastName: personalForm.lastName.trim(),
      contact: personalForm.contact.trim(),
    }

    onUpdateUser(updates)
    setPersonalForm(updates)
    setPersonalErrors({})
    setPersonalToast({ type: 'success', message: 'Personal information saved successfully.' })
  }

  const openEmailModal = () => {
    setEmailForm({ newEmail: '', confirmEmail: '', currentPassword: '' })
    setEmailError('')
    setEmailModalOpen(true)
  }

  const closeEmailModal = () => {
    setEmailModalOpen(false)
    setEmailError('')
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    setEmailError('')

    if (emailForm.currentPassword !== profile.password) {
      setEmailError('Current password is incorrect.')
      return
    }
    if (!isValidEmail(emailForm.newEmail)) {
      setEmailError('Enter a valid email address.')
      return
    }
    if (emailForm.newEmail.trim().toLowerCase() === profile.email.toLowerCase()) {
      setEmailError('New email must be different from your current email.')
      return
    }
    if (emailForm.newEmail.trim() !== emailForm.confirmEmail.trim()) {
      setEmailError('Email addresses do not match.')
      return
    }

    onUpdateUser({ email: emailForm.newEmail.trim().toLowerCase() })
    closeEmailModal()
    setPersonalToast({ type: 'success', message: 'Email updated successfully.' })
  }

  const openPasswordModal = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordError('')
    setPasswordModalOpen(true)
  }

  const closePasswordModal = () => {
    setPasswordModalOpen(false)
    setPasswordError('')
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPasswordError('')

    if (passwordForm.currentPassword !== profile.password) {
      setPasswordError('Current password is incorrect.')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    if (passwordForm.newPassword === profile.password) {
      setPasswordError('New password must be different from your current password.')
      return
    }

    onUpdateUser({ password: passwordForm.newPassword })
    closePasswordModal()
    setPersonalToast({ type: 'success', message: 'Password updated successfully.' })
  }

  const emailModal = emailModalOpen
    ? createPortal(
        <div className="my-profile-modal-overlay" onClick={closeEmailModal}>
          <div
            className="my-profile-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="change-email-title"
          >
            <div className="my-profile-modal-header">
              <h2 id="change-email-title">Change Email</h2>
              <button
                type="button"
                className="my-profile-modal-close"
                onClick={closeEmailModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div className="my-profile-modal-body">
                <p className="my-profile-modal-note">
                  Current email: <strong>{profile.email}</strong>. You will use the new email to sign in.
                </p>

                {emailError && (
                  <div className="my-profile-toast error" role="alert">
                    {emailError}
                  </div>
                )}

                <div className="my-profile-form-group">
                  <label htmlFor="new-email">New Email</label>
                  <input
                    id="new-email"
                    type="email"
                    className="my-profile-form-input"
                    placeholder="name@example.com"
                    value={emailForm.newEmail}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, newEmail: e.target.value }))}
                    required
                  />
                </div>

                <div className="my-profile-form-group">
                  <label htmlFor="confirm-email">Confirm New Email</label>
                  <input
                    id="confirm-email"
                    type="email"
                    className="my-profile-form-input"
                    placeholder="name@example.com"
                    value={emailForm.confirmEmail}
                    onChange={(e) =>
                      setEmailForm((prev) => ({ ...prev, confirmEmail: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="my-profile-form-group">
                  <label htmlFor="email-current-password">Current Password</label>
                  <input
                    id="email-current-password"
                    type="password"
                    className="my-profile-form-input"
                    placeholder="Enter current password"
                    value={emailForm.currentPassword}
                    onChange={(e) =>
                      setEmailForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="my-profile-modal-footer">
                <button type="button" className="my-profile-btn-secondary" onClick={closeEmailModal}>
                  Cancel
                </button>
                <button type="submit" className="my-profile-btn-primary">
                  Update Email
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null

  const passwordModal = passwordModalOpen
    ? createPortal(
        <div className="my-profile-modal-overlay" onClick={closePasswordModal}>
          <div
            className="my-profile-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="change-password-title"
          >
            <div className="my-profile-modal-header">
              <h2 id="change-password-title">Change Password</h2>
              <button
                type="button"
                className="my-profile-modal-close"
                onClick={closePasswordModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="my-profile-modal-body">
                {passwordError && (
                  <div className="my-profile-toast error" role="alert">
                    {passwordError}
                  </div>
                )}

                <div className="my-profile-form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    className="my-profile-form-input"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="my-profile-form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="my-profile-form-input"
                    placeholder="At least 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    required
                    minLength={6}
                  />
                </div>

                <div className="my-profile-form-group">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="my-profile-form-input"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="my-profile-modal-footer">
                <button type="button" className="my-profile-btn-secondary" onClick={closePasswordModal}>
                  Cancel
                </button>
                <button type="submit" className="my-profile-btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <div className="my-profile-shell">
    <div className="my-profile-page">
      {personalToast && (
        <div className={`my-profile-toast ${personalToast.type}`} role="status">
          {personalToast.message}
        </div>
      )}

      {/* Profile Header */}
      <div className="my-profile-header-card">
        <div className="my-profile-avatar" aria-hidden="true">
          {getInitials(profile.firstName, profile.lastName)}
        </div>
        <div className="my-profile-header-info">
          <h2>{fullName}</h2>
          <div className="my-profile-header-meta">
            <span className="my-profile-role-badge">Client</span>
            <span>{profile.email}</span>
            <span>·</span>
            <span>{profile.contact}</span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <section className="my-profile-card">
        <div className="my-profile-card-header">
          <div>
            <h3>Personal Information</h3>
            <p className="my-profile-card-desc">Update your name and contact details.</p>
          </div>
        </div>

        <form onSubmit={handlePersonalSave}>
          <div className="my-profile-form-grid">
            <div className="my-profile-form-group">
              <label htmlFor="profile-firstName">First Name</label>
              <input
                id="profile-firstName"
                name="firstName"
                type="text"
                className="my-profile-form-input"
                placeholder="e.g. Juan"
                value={personalForm.firstName}
                onChange={handlePersonalChange}
              />
              {personalErrors.firstName && (
                <span className="my-profile-field-error">{personalErrors.firstName}</span>
              )}
            </div>

            <div className="my-profile-form-group">
              <label htmlFor="profile-lastName">Last Name</label>
              <input
                id="profile-lastName"
                name="lastName"
                type="text"
                className="my-profile-form-input"
                placeholder="e.g. Dela Cruz"
                value={personalForm.lastName}
                onChange={handlePersonalChange}
              />
              {personalErrors.lastName && (
                <span className="my-profile-field-error">{personalErrors.lastName}</span>
              )}
            </div>

            <div className="my-profile-form-group full-width">
              <label htmlFor="profile-contact">Contact Number</label>
              <input
                id="profile-contact"
                name="contact"
                type="tel"
                className="my-profile-form-input"
                placeholder="e.g. 0912-345-6789"
                value={personalForm.contact}
                onChange={handlePersonalChange}
              />
              {personalErrors.contact && (
                <span className="my-profile-field-error">{personalErrors.contact}</span>
              )}
            </div>
          </div>

          <div className="my-profile-form-actions">
            <button
              type="button"
              className="my-profile-btn-secondary"
              onClick={handlePersonalCancel}
              disabled={!isPersonalDirty}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="my-profile-btn-primary"
              disabled={!isPersonalDirty}
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Account Security */}
      <section className="my-profile-card">
        <div className="my-profile-card-header">
          <div>
            <h3>Account Security</h3>
            <p className="my-profile-card-desc">
              Manage your login email and password separately from personal info.
            </p>
          </div>
        </div>

        <div className="my-profile-security-list">
          <div className="my-profile-security-row">
            <div>
              <div className="my-profile-security-label">Email Address</div>
              <div className="my-profile-security-value">{profile.email}</div>
            </div>
            <button type="button" className="my-profile-btn-outline" onClick={openEmailModal}>
              Change Email
            </button>
          </div>

          <div className="my-profile-security-row">
            <div>
              <div className="my-profile-security-label">Password</div>
              <div className="my-profile-security-value masked">••••••••</div>
            </div>
            <button type="button" className="my-profile-btn-outline" onClick={openPasswordModal}>
              Change Password
            </button>
          </div>
        </div>
      </section>

    </div>
    {emailModal}
    {passwordModal}
    </div>
  )
}

export default MyProfile
