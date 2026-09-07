import { useState } from 'react'
import '../styles/LoginModal.css'
import { loginUser, registerUser } from '../services/authService'
import LoginForm from './auth/LoginForm'
import RegisterForm from './auth/RegisterForm'

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [view, setView] = useState('login')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setView('login')
    setErrorMsg('')
    setIsLoading(false)
    onClose()
  }

  const handleLoginSubmit = async (email, password) => {
    setErrorMsg('')
    setIsLoading(true)

    const result = await loginUser(email, password)
    setIsLoading(false)

    if (result.success && result.user) {
      if (onLoginSuccess) {
        onLoginSuccess(result.user)
      }
      handleClose()
    } else {
      setErrorMsg(result.error || 'Invalid credentials. Please try again.')
    }
  }

  const handleRegisterSubmit = async (formData) => {
    setErrorMsg('')
    setIsLoading(true)

    const result = await registerUser(formData)
    setIsLoading(false)

    if (result.success && result.user) {
      if (onLoginSuccess) {
        onLoginSuccess(result.user)
      }
      handleClose()
    } else {
      setErrorMsg(result.error || 'Failed to register account.')
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={handleClose} aria-label="Close modal">
          ✕
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>💈</span>
          <h3 style={{ marginTop: '0.5rem', color: 'var(--text-h)', textTransform: view === 'register' ? 'uppercase' : 'none', letterSpacing: '0.02em' }}>
            {view === 'login' ? 'Admin / Client Login' : 'Create an Account'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginTop: '0.2rem' }}>
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
          <LoginForm
            onLogin={handleLoginSubmit}
            onSwitchToRegister={() => {
              setErrorMsg('')
              setView('register')
            }}
            isLoading={isLoading}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegisterSubmit}
            onSwitchToLogin={() => {
              setErrorMsg('')
              setView('login')
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

export default LoginModal
