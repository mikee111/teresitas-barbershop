import { useState } from 'react'
import '../../styles/Dashboard.css'
import '../../styles/UserDashboard.css'
import BookAppointment from './BookAppointment'
import MyAppointments from './MyAppointments'
import MyProfile from './MyProfile'
import UserServices from './UserServices'
import {
  logoutIcon,
  lowFadeImg,
  servicesScissorIcon,
  reviewIcon,
  clientSidebarIcon,
} from '../../assets/images'

function UserDashboard({ user, onLogout, onUserUpdate, appointments = [], onUpdateAppointment, onAddAppointment }) {
  const [activeNav, setActiveNav] = useState('my-appointments')
  const [rebookData, setRebookData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      onLogout()
    }, 850)
  }

  const pageTitles = {
    dashboard: 'Client Dashboard',
    appointment: 'Book Appointment',
    services: 'Services & Pricing',
    profile: 'My Profile'
  }

  const clientName = user
    ? `${user.firstName || user.name || 'User'} ${user.lastName || ''}`.trim()
    : 'Juan Dela Cruz'

  // Booking completion — adds to shared store with 'pending' status
  const handleBookingComplete = (newBooking) => {
    if (newBooking && onAddAppointment) {
      onAddAppointment(newBooking)
    }
    setRebookData(null)
    setActiveNav('my-appointments')
  }

  // Update appointment (reschedule, cancel, review) — updates shared store
  const handleUpdateAppointment = (id, updates) => {
    if (onUpdateAppointment) {
      onUpdateAppointment(id, updates)
    }
  }

  // Trigger rebook
  const handleRebook = (appt) => {
    setRebookData({
      service: appt.service,
      barber: appt.barber,
      date: 'Aug 26, 2026',
      time: appt.time
    })
    setActiveNav('appointment')
  }

  // Count active upcoming appointments
  const upcomingCount = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'in-progress'
  ).length

  return (
    <div className="dashboard-container">
      {/* Left Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">💈</span>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-brand">TERESITAS</span>
              <span className="sidebar-logo-sub">BARBERSHOP</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            {/* My Appointments (with count badge) */}
            <button
              className={`sidebar-btn ${activeNav === 'my-appointments' ? 'active' : ''}`}
              onClick={() => setActiveNav('my-appointments')}
              style={{ position: 'relative' }}
            >
              {reviewIcon ? (
                <img
                  src={reviewIcon}
                  alt="My Appointments"
                  className="sidebar-btn-img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <span className="sidebar-btn-icon">📋</span>
              )}
              <span>Appointments</span>

              {upcomingCount > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: activeNav === 'my-appointments' ? '#ffffff' : '#7c3aed',
                    color: activeNav === 'my-appointments' ? '#7c3aed' : '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px'
                  }}
                >
                  {upcomingCount}
                </span>
              )}
            </button>

            {/* Book Appointment */}
            <button
              className={`sidebar-btn ${activeNav === 'appointment' ? 'active' : ''}`}
              onClick={() => {
                setRebookData(null)
                setActiveNav('appointment')
              }}
            >
              <span className="sidebar-btn-icon">📅</span>
              <span>Book Appointment</span>
            </button>

            {/* Services */}
            <button
              className={`sidebar-btn ${activeNav === 'services' ? 'active' : ''}`}
              onClick={() => setActiveNav('services')}
            >
              {servicesScissorIcon ? (
                <img
                  src={servicesScissorIcon}
                  alt="Services"
                  className="sidebar-btn-img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <span className="sidebar-btn-icon">✂️</span>
              )}
              <span>Services</span>
            </button>

            {/* My Profile */}
            <button
              className={`sidebar-btn ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveNav('profile')}
            >
              {clientSidebarIcon ? (
                <img
                  src={clientSidebarIcon}
                  alt="My Profile"
                  className="sidebar-btn-img user-profile-sidebar-img"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <span className="sidebar-btn-icon">👤</span>
              )}
              <span>My Profile</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button
            className={`sidebar-btn sidebar-logout-btn${isLoggingOut ? ' logging-out' : ''}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {logoutIcon ? (
              <img
                src={logoutIcon}
                alt="Log Out"
                className={`sidebar-btn-img logout-icon${isLoggingOut ? ' logout-spin' : ''}`}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : null}
            <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Header Bar */}
        <header className="dashboard-topbar">
          <h1 className="topbar-page-title">{pageTitles[activeNav] || ''}</h1>

          <div className="dashboard-search">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="search-icon-svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div className="topbar-user">
            <button className="notification-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {upcomingCount > 0 && <span className="notification-dot" />}
            </button>
            <div className="user-profile">
              {(user?.avatarUrl || lowFadeImg) ? (
                <img
                  src={user?.avatarUrl || lowFadeImg}
                  alt="Client Profile"
                  className="user-avatar"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : null}
              <div className="user-info-text">
                <span className="user-name">{clientName}</span>
                <span className="user-role">Client</span>
              </div>
              <span className="user-chevron">⌄</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={`dashboard-content client-dashboard-content${activeNav === 'profile' ? ' client-dashboard-content--profile' : ''}`}>
          {activeNav === 'appointment' ? (
            <BookAppointment
              appointments={appointments}
              initialBookingData={rebookData}
              onBookingComplete={handleBookingComplete}
            />
          ) : activeNav === 'services' ? (
            <UserServices
              onSelectServiceToBook={(service) => {
                setRebookData({
                  service,
                  barber: null,
                  date: 'Aug 25, 2026',
                  time: ''
                })
                setActiveNav('appointment')
              }}
            />
          ) : activeNav === 'profile' ? (
            <MyProfile user={user} onUpdateUser={onUserUpdate} />
          ) : (
            <MyAppointments
              appointments={appointments}
              onNavigateToBook={() => {
                setRebookData(null)
                setActiveNav('appointment')
              }}
              onUpdateAppointment={handleUpdateAppointment}
              onRebook={handleRebook}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
