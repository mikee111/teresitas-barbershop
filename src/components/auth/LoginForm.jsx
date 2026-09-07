import { useState } from 'react'

function LoginForm({ onLogin, onSwitchToRegister, isLoading }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email or Username</label>
        <input
          id="login-email"
          type="text"
          placeholder="admin or admin@teresitas.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.95rem' }}
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
      </button>

      <div className="auth-switch">
        <span>Don&apos;t have an account yet? </span>
        <button
          type="button"
          className="auth-switch-btn"
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Register
        </button>
      </div>
    </form>
  )
}

export default LoginForm
