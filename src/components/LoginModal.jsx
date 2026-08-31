import { useState } from 'react'
import '../styles/LoginModal.css'

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [view, setView] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    age: '',
    address: '',
    email: '',
    password: ''
  })

  if (!isOpen) return null

  const handleClose = () => {
    setView('login')
    setErrorMsg('')
    onClose()
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    const formattedEmail = loginEmail.trim().toLowerCase()
    const formattedPassword = loginPassword.trim()

    // ── Admin Credentials ──────────────────────────────────────
    if (
      (formattedEmail === 'admin' ||
        formattedEmail === 'admin@teresitas.com' ||
        formattedEmail === 'admin@gmail.com') &&
      (formattedPassword === 'admin123' || formattedPassword === 'admin')
    ) {
      if (onLoginSuccess) {
        onLoginSuccess({ email: formattedEmail, firstName: 'Admin', role: 'admin' })
      }
      handleClose()
      return
    }

    // ── User / Client Credentials (accepts user, client, or any client credentials) ──
    if (
      formattedEmail === 'user' ||
      formattedEmail === 'client' ||
      formattedEmail === 'user@teresitas.com' ||
      formattedEmail === 'client@teresitas.com' ||
      formattedEmail === 'user@gmail.com' ||
      formattedEmail === 'juan' ||
      formattedEmail === 'dennis'
    ) {
      if (
        formattedPassword === 'user123' ||
        formattedPassword === 'user' ||
        formattedPassword === 'client123' ||
        formattedPassword === 'client' ||
        formattedPassword === '123456' ||
        formattedPassword.length >= 3
      ) {
        if (onLoginSuccess) {
          onLoginSuccess({
            email: 'user@teresitas.com',
            firstName: 'Juan',
            lastName: 'Dela Cruz',
            contact: '0912-345-6789',
            address: '123 Rizal St., Manila',
            password: formattedPassword,
            role: 'user',
          })
        }
        handleClose()
        return
      }
    }

    // Fallback: If user enters any email/password, log in as Client
    if (formattedEmail && formattedPassword.length >= 3) {
      if (onLoginSuccess) {
        onLoginSuccess({
          email: formattedEmail,
          firstName: formattedEmail.split('@')[0],
          lastName: '',
          password: formattedPassword,
          role: 'user',
        })
      }
      handleClose()
      return
    }

    setErrorMsg(
      'Invalid credentials. Admin: "admin" / "admin123"  |  Client: "user" / "user123"'
    )
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (onLoginSuccess) {
      onLoginSuccess({
        email: formData.email,
        firstName: formData.firstName || 'User',
        lastName: formData.lastName || '',
        contact: '',
        address: formData.address || '',
        password: formData.password,
        role: 'user',
      })
    }
    handleClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={handleClose} aria-label="Close modal">
          ✕
        </button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>💈</span>
          <h3 style={{ marginTop: '0.5rem', color: 'var(--text-h)' }}>
            {view === 'login' ? 'Admin / Client Login' : 'Create an Account'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
            {view === 'login'
              ? 'Sign in as Admin or as a Client to access your dashboard'
              : 'Register your account to get started'}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}
          >
            {errorMsg}
          </div>
        )}

        {view === 'login' ? (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email or Username</label>
              <input
                id="login-email"
                type="text"
                placeholder="admin or admin@teresitas.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="admin123"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Sign In to Dashboard
            </button>

            <div className="auth-switch">
              <span>Don&apos;t have an account yet? </span>
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => { setErrorMsg(''); setView('register'); }}
              >
                Register
              </button>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-first-name">First Name</label>
                <input
                  id="reg-first-name"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-middle-name">Middle Name</label>
                <input
                  id="reg-middle-name"
                  type="text"
                  placeholder="Middle Name"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-last-name">Last Name</label>
                <input
                  id="reg-last-name"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-birthdate">Birthdate</label>
                <input
                  id="reg-birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-age-email">
              <div className="form-group">
                <label htmlFor="reg-age">Age</label>
                <input
                  id="reg-age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-address">Address</label>
              <input
                id="reg-address"
                type="text"
                placeholder="Complete Street Address, City"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Register
            </button>

            <div className="auth-switch">
              <span>Already have an account? </span>
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setView('login')}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginModal
