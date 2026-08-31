import '../styles/Navbar.css'

function Navbar({ onLoginClick, onDashboardClick, isLoggedIn }) {
  return (
    <header className="site-header">
      <div className="brand-logo">
        <span className="brand-badge">💈</span> Teresita&apos;s
      </div>

      <nav className="site-nav">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#services">Services</a>
        <a href="#contact-us">Contact Us</a>
        <button
          type="button"
          className="nav-login-btn login-btn-nav"
          onClick={isLoggedIn ? onDashboardClick : onLoginClick}
        >
          {isLoggedIn ? 'Admin Dashboard' : 'Login'}
        </button>
      </nav>
    </header>
  )
}

export default Navbar


