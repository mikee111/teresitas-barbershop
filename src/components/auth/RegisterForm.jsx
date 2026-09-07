import { useState } from 'react'

function RegisterForm({ onRegister, onSwitchToLogin, isLoading }) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    age: '',
    email: '',
    address: '',
    password: ''
  })

  // Auto-calculate age when birthdate changes
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onRegister(formData)
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {/* Row: First Name & Middle Name */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reg-first-name">FIRST NAME</label>
          <input
            id="reg-first-name"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-middle-name">MIDDLE NAME</label>
          <input
            id="reg-middle-name"
            type="text"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Row: Last Name & Birthdate */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reg-last-name">LAST NAME</label>
          <input
            id="reg-last-name"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-birthdate">BIRTHDATE</label>
          <input
            id="reg-birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleBirthdateChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Row: Age & Email */}
      <div className="form-row-age-email">
        <div className="form-group">
          <label htmlFor="reg-age">AGE</label>
          <input
            id="reg-age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            min="1"
            max="120"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">EMAIL</label>
          <input
            id="reg-email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Row: Address */}
      <div className="form-group">
        <label htmlFor="reg-address">ADDRESS</label>
        <input
          id="reg-address"
          type="text"
          placeholder="Complete Street Address, City"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      {/* Row: Password */}
      <div className="form-group">
        <label htmlFor="reg-password">PASSWORD</label>
        <input
          id="reg-password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', marginTop: '0.65rem', padding: '0.8rem', fontSize: '0.95rem', fontWeight: '700' }}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'REGISTER'}
      </button>

      {/* Switch to Sign In */}
      <div className="auth-switch">
        <span>Already have an account? </span>
        <button
          type="button"
          className="auth-switch-btn"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Sign In
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
