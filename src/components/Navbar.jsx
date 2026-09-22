import { useState } from 'react'
import '../styles/Navbar.css'

function Navbar({ onLoginClick, onDashboardClick, isLoggedIn }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMobileOpen(false)
  }

  const handleActionClick = () => {
    setIsMobileOpen(false)
    if (isLoggedIn) {
      onDashboardClick()
    } else {
      onLoginClick()
    }
  }

  return (
    <header className="site-header">
      <div className="brand-logo">
        <span className="brand-badge">💈</span>
        <a href="#home" className="brand-link" onClick={handleLinkClick}>
          Teresita&apos;s
        </a>
      </div>

      <button
        type="button"
        className={`mobile-toggle ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(prev => !prev)}
        aria-label="Toggle navigation menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={`site-nav ${isMobileOpen ? 'nav-open' : ''}`}>
        <a href="#home" onClick={handleLinkClick}>Home</a>
        <a href="#about" onClick={handleLinkClick}>About Us</a>
        <a href="#services" onClick={handleLinkClick}>Services</a>
        <a href="#contact-us" onClick={handleLinkClick}>Contact Us</a>
        <button
          type="button"
          className="nav-login-btn login-btn-nav"
          onClick={handleActionClick}
        >
          {isLoggedIn ? 'Admin Dashboard' : 'Login'}
        </button>
      </nav>
    </header>
  )
}

export default Navbar
