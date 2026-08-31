import { useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [toast, setToast] = useState(null) // { type: 'success' | 'error', message: '' }

  // Validation rules for requirements
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)

  const handleUpdatePassword = (e) => {
    e.preventDefault()

    if (!currentPassword) {
      setToast({ type: 'error', message: 'Please enter your current password.' })
      return
    }

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setToast({ type: 'error', message: 'Please meet all password requirements.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    // Success
    setToast({ type: 'success', message: 'Password updated successfully!' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  return (
    <div className="appointment-table-shell security-settings-shell">
      {/* Green Header Bar */}
      <div className="appointment-table-titlebar">
        <h2>Security</h2>
      </div>

      <div className="security-body">
        <p className="security-subtitle">
          Manage your password and keep your account secure.
        </p>

        <div className="security-divider"></div>

        <form onSubmit={handleUpdatePassword} className="business-info-form">
          <h3 className="security-section-heading">Change Password</h3>

          {/* Current Password */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="current-password">
              Current Password
            </label>
            <div className="security-password-wrapper">
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                className="security-password-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="security-eye-btn"
                onClick={() => setShowCurrent((prev) => !prev)}
                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              >
                {showCurrent ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="new-password">
              New Password
            </label>
            <div className="security-password-wrapper">
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                className="security-password-input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="security-eye-btn"
                onClick={() => setShowNew((prev) => !prev)}
                aria-label={showNew ? 'Hide new password' : 'Show new password'}
              >
                {showNew ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="business-info-field">
            <label className="business-info-label" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <div className="security-password-wrapper">
              <input
                id="confirm-new-password"
                type={showConfirm ? 'text' : 'password'}
                className="security-password-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="security-eye-btn"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Password Requirements Checklist */}
          <div className="security-requirements-box">
            <span className="security-requirements-title">Password requirements:</span>
            <div className={`security-requirement-item ${hasMinLength ? 'met' : ''}`}>
              <span className="security-requirement-icon">{hasMinLength ? '✓' : '•'}</span>
              <span>At least 8 characters</span>
            </div>
            <div className={`security-requirement-item ${hasUppercase ? 'met' : ''}`}>
              <span className="security-requirement-icon">{hasUppercase ? '✓' : '•'}</span>
              <span>One uppercase letter</span>
            </div>
            <div className={`security-requirement-item ${hasNumber ? 'met' : ''}`}>
              <span className="security-requirement-icon">{hasNumber ? '✓' : '•'}</span>
              <span>One number</span>
            </div>
          </div>

          {/* Action Footer with Green Button */}
          <div className="business-info-actions">
            <button
              type="submit"
              className="security-btn-update"
            >
              <span>🔒</span>
              <span>Update Password</span>
            </button>

            {toast && (
              <span className={`security-toast ${toast.type}`}>
                {toast.type === 'success' ? '✓ ' : '⚠️ '}
                {toast.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SecuritySettings
