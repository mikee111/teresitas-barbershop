import { useState } from 'react'
import '../styles/Dashboard.css'
import Appointment from './appointment/Appointment'
import BarbersCrew from './barberscrew/BarbersCrew'
import Client from './client/Client'
import ServicesAdmin from './services/ServicesAdmin'
import Settings from './settings/Settings'
import lowFadeImg from '../assets/images/gallery/Low Fade.jpeg'
import dashboardIcon from '../assets/images/gallery/dashboard.jpg'
import barbersCrewIcon from '../assets/images/gallery/barbers crew.png'
import clientsIcon from '../assets/images/gallery/clients.jfif'
import servicesIcon from '../assets/images/gallery/services.png'
import settingsIcon from '../assets/images/gallery/settings1.jpeg'
import businessInfoIcon from '../assets/images/gallery/Business Information .png'
import securityIcon from '../assets/images/gallery/security icons ..png'
import adminProfileIcon from '../assets/images/gallery/admin Profile.avif'
import logoutIcon from '../assets/images/gallery/logout.png'

function Dashboard({ onBackToSite, user, appointments, onUpdateAppointment }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [settingsSubNav, setSettingsSubNav] = useState('business-info')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedYear, setSelectedYear] = useState('Year')
  const [selectedAgeMonth, setSelectedAgeMonth] = useState('Month')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      onBackToSite()
    }, 900)
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    appointment: 'Appointment Schedule',
    barberscrew: 'Barbers Crew',
    client: 'Client Management',
    services: 'Services Management',
    settings: 'Settings'
  }

  const settingsTitles = {
    'business-info': 'Business Information',
    security: 'Security',
    admin: 'Admin'
  }

  const handleSettingsClick = () => {
    setActiveNav('settings')
    setIsSettingsOpen((prev) => !prev)
  }

  const handleSettingsSubNavClick = (subOption) => {
    setActiveNav('settings')
    setSettingsSubNav(subOption)
    setIsSettingsOpen(true)
  }

  const handleNavClick = (navKey) => {
    setActiveNav(navKey)
    setIsSettingsOpen(false)
  }

  const currentTitle =
    activeNav === 'settings'
      ? settingsTitles[settingsSubNav] || 'Settings'
      : pageTitles[activeNav] || 'Dashboard'

  const statCardsData = [
    {
      id: 'clients',
      title: 'Total Clients',
      icon: '👤',
      value: '24'
    },
    {
      id: 'services',
      title: 'Total Services',
      icon: '✂️',
      value: '6'
    },
    {
      id: 'employees',
      title: 'Active Employees',
      icon: '👥',
      value: '4'
    },
    {
      id: 'appointments',
      title: 'Appointments',
      icon: '💳',
      value: '2'
    }
  ]

  const bookingsData = [
    {
      id: 1,
      startTime: '10:00 AM',
      service: 'Hair Cut',
      endTime: '10:20 AM',
      client: 'Dennis',
      employee: 'Darrell',
      status: 'upcoming'
    },
    {
      id: 2,
      startTime: '10:25 AM',
      service: 'Hair Styling',
      endTime: '10:40 AM',
      client: 'Bonnie',
      employee: 'Leslie',
      status: 'upcoming'
    },
    {
      id: 3,
      startTime: '10:45 AM',
      service: 'Hair Trimming',
      endTime: '10:55 AM',
      client: 'Driss',
      employee: 'Kristin',
      status: 'upcoming'
    },
    {
      id: 4,
      startTime: '11:00 AM',
      service: 'Clean Shaving',
      endTime: '11:20 AM',
      client: 'Alex',
      employee: 'Theresa',
      status: 'upcoming'
    }
  ]

  const filteredBookings = bookingsData.filter((item) => {
    if (activeTab === 'upcoming') return item.status === 'upcoming'
    if (activeTab === 'canceled') return item.status === 'canceled'
    return true
  })

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
            <button
              className={`sidebar-btn ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <img
                src={dashboardIcon}
                alt="Dashboard"
                className="sidebar-btn-img"
              />
              <span>Dashboard</span>
            </button>

            <button
              className={`sidebar-btn ${activeNav === 'appointment' ? 'active' : ''}`}
              onClick={() => handleNavClick('appointment')}
            >
              <span className="sidebar-btn-icon">📅</span>
              <span>Appointment</span>
            </button>

            <button
              className={`sidebar-btn ${activeNav === 'barberscrew' ? 'active' : ''}`}
              onClick={() => handleNavClick('barberscrew')}
            >
              <img
                src={barbersCrewIcon}
                alt="Barbers Crew"
                className="sidebar-btn-img"
              />
              <span>Barbers Crew</span>
            </button>

            <button
              className={`sidebar-btn ${activeNav === 'client' ? 'active' : ''}`}
              onClick={() => handleNavClick('client')}
            >
              <img
                src={clientsIcon}
                alt="Client"
                className="sidebar-btn-img"
              />
              <span>Client</span>
            </button>

            <button
              className={`sidebar-btn ${activeNav === 'services' ? 'active' : ''}`}
              onClick={() => handleNavClick('services')}
            >
              <img
                src={servicesIcon}
                alt="Services"
                className="sidebar-btn-img"
              />
              <span>Services</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button
            className={`sidebar-btn ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={handleSettingsClick}
          >
            <img
              src={settingsIcon}
              alt="Settings"
              className="sidebar-btn-img"
            />
            <span style={{ flex: 1 }}>Settings</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>
              {isSettingsOpen ? '▾' : '▸'}
            </span>
          </button>

          {isSettingsOpen && (
            <div className="sidebar-submenu">
              <button
                className={`sidebar-sub-btn ${
                  activeNav === 'settings' && settingsSubNav === 'business-info' ? 'active' : ''
                }`}
                onClick={() => handleSettingsSubNavClick('business-info')}
              >
                <img
                  src={businessInfoIcon}
                  alt="Business Information"
                  className="sidebar-sub-btn-img"
                />
                <span>Business Information</span>
              </button>

              <button
                className={`sidebar-sub-btn ${
                  activeNav === 'settings' && settingsSubNav === 'security' ? 'active' : ''
                }`}
                onClick={() => handleSettingsSubNavClick('security')}
              >
                <img
                  src={securityIcon}
                  alt="Security"
                  className="sidebar-sub-btn-img"
                />
                <span>Security</span>
              </button>

              <button
                className={`sidebar-sub-btn ${
                  activeNav === 'settings' && settingsSubNav === 'admin' ? 'active' : ''
                }`}
                onClick={() => handleSettingsSubNavClick('admin')}
              >
                <img
                  src={adminProfileIcon}
                  alt="Admin"
                  className="sidebar-sub-btn-img"
                />
                <span>Admin</span>
              </button>
            </div>
          )}

          <button
            className={`sidebar-btn sidebar-logout-btn${isLoggingOut ? ' logging-out' : ''}`}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <img
              src={logoutIcon}
              alt="Log Out"
              className={`sidebar-btn-img logout-icon${isLoggingOut ? ' logout-spin' : ''}`}
            />
            <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Header Bar */}
        <header className="dashboard-topbar">
          <h1 className="topbar-page-title">{currentTitle}</h1>

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
            </button>
            <div className="user-profile">
              <img
                src={lowFadeImg}
                alt="User Profile"
                className="user-avatar"
              />
              <div className="user-info-text">
                <span className="user-name">
                  {user ? `${user.firstName || user.email}` : 'John Carlio'}
                </span>
                <span className="user-role">Admin</span>
              </div>
              <span className="user-chevron">⌄</span>
            </div>
          </div>
        </header>

        {/* Main View Switcher */}
        {activeNav === 'appointment' ? (
          <main className="dashboard-content">
            <Appointment
              appointments={appointments}
              onUpdateAppointment={onUpdateAppointment}
            />
          </main>
        ) : activeNav === 'barberscrew' ? (
          <main className="dashboard-content">
            <BarbersCrew />
          </main>
        ) : activeNav === 'client' ? (
          <main className="dashboard-content">
            <Client />
          </main>
        ) : activeNav === 'services' ? (
          <main className="dashboard-content">
            <ServicesAdmin />
          </main>
        ) : activeNav === 'settings' ? (
          <main className="dashboard-content">
            <Settings
              activeSubNav={settingsSubNav}
              onSelectSubNav={setSettingsSubNav}
            />
          </main>
        ) : (
          <main className="dashboard-content">
            {/* 4 Stat Cards Row */}
            <div className="overview-stats-row">
              {statCardsData.map((card) => (
                <div key={card.id} className="overview-stat-box">
                  <div className="stat-box-top">
                    <span className="stat-box-title">{card.title}</span>
                    <button className="stat-expand-btn" aria-label="Expand">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="stat-box-bottom">
                    <span className="stat-circle-icon">{card.icon}</span>
                    <span className="stat-box-value">{card.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row (Annual Revenue + Customer Age) */}
            <div className="overview-charts-grid">
              {/* Annual Revenue Wave Chart */}
              <div className="overview-card revenue-chart-card">
                <div className="card-header-flex">
                  <h2 className="card-heading">Chart of Annual Revenue</h2>
                  <div className="card-header-actions">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="header-pill-select"
                    >
                      <option value="Year">Year</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                    <button className="icon-circle-btn" aria-label="Download chart">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                        <polyline points="12 13 12 17 10 15"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="revenue-chart-wrapper">
                  {/* Y-Axis scale */}
                  <div className="revenue-y-axis">
                    <span>25K</span>
                    <span>20K</span>
                    <span>15K</span>
                    <span>10K</span>
                    <span>5K</span>
                    <span>0</span>
                  </div>

                  <div className="revenue-svg-area">
                    {/* Horizontal Grid lines */}
                    <div className="chart-grid-lines">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>

                    {/* SVG Curve */}
                    <svg
                      className="revenue-curve-svg"
                      viewBox="0 0 600 200"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#c026d3" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#a855f7" floodOpacity="0.35" />
                        </filter>
                      </defs>

                      {/* Smooth spline path */}
                      <path
                        d="M 15 100
                           C 35 125, 55 135, 75 120
                           C 95 105, 115 65, 135 68
                           C 155 71, 175 110, 195 105
                           C 215 100, 235 130, 255 115
                           C 275 100, 295 65, 315 80
                           C 335 95, 355 155, 375 150
                           C 395 145, 415 125, 435 105
                           C 455 85, 475 40, 500 50
                           C 525 60, 545 75, 565 65
                           C 580 57, 590 35, 595 28"
                        fill="none"
                        stroke="url(#curveGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />

                      {/* Key point nodes */}
                      <circle cx="135" cy="68" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="195" cy="105" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="315" cy="80" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="435" cy="105" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx="500" cy="50" r="4.5" fill="#ffffff" stroke="#a855f7" strokeWidth="2.5" />
                    </svg>

                    {/* Active Production Tooltip */}
                    <div className="chart-tooltip-badge" style={{ left: '52%', top: '16%' }}>
                      <span className="tooltip-tag">Production</span>
                      <span className="tooltip-number">13,721</span>
                      <div className="tooltip-arrow"></div>
                    </div>
                  </div>
                </div>

                {/* X-Axis Months */}
                <div className="revenue-x-axis">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>

              {/* Customer Age Radial Donut Card */}
              <div className="overview-card customer-age-card">
                <div className="card-header-flex">
                  <h2 className="card-heading">Chart of customer age</h2>
                  <div className="card-header-actions">
                    <select
                      value={selectedAgeMonth}
                      onChange={(e) => setSelectedAgeMonth(e.target.value)}
                      className="header-pill-select"
                    >
                      <option value="Month">Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                    </select>
                    <button className="icon-circle-btn" aria-label="Download chart">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                        <polyline points="12 13 12 17 10 15"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Radial Donut Rings with Center 100% */}
                <div className="age-rings-container">
                  <svg className="age-rings-svg" viewBox="0 0 200 200">
                    {/* Outer track & bar (Purple/Magenta) */}
                    <circle cx="100" cy="100" r="76" fill="none" stroke="#f1f3f7" strokeWidth="9" />
                    <circle
                      cx="100"
                      cy="100"
                      r="76"
                      fill="none"
                      stroke="#d900df"
                      strokeWidth="9"
                      strokeDasharray="477"
                      strokeDashoffset="180"
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />

                    {/* Middle track & bar (Pink/Red) */}
                    <circle cx="100" cy="100" r="62" fill="none" stroke="#f1f3f7" strokeWidth="9" />
                    <circle
                      cx="100"
                      cy="100"
                      r="62"
                      fill="none"
                      stroke="#ff2e63"
                      strokeWidth="9"
                      strokeDasharray="389"
                      strokeDashoffset="190"
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />

                    {/* Inner track & bar (Orange) */}
                    <circle cx="100" cy="100" r="48" fill="none" stroke="#f1f3f7" strokeWidth="9" />
                    <circle
                      cx="100"
                      cy="100"
                      r="48"
                      fill="none"
                      stroke="#ff6b35"
                      strokeWidth="9"
                      strokeDasharray="301"
                      strokeDashoffset="155"
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="age-rings-center">
                    <span className="center-percentage">100%</span>
                  </div>
                </div>

                {/* Age Legend Pill Badges */}
                <div className="age-legend-row">
                  <div className="age-legend-item">
                    <span className="legend-badge purple">22%</span>
                    <span className="legend-text">00-35 Y</span>
                  </div>
                  <div className="age-legend-item">
                    <span className="legend-badge pink">31%</span>
                    <span className="legend-text">36-55 Y</span>
                  </div>
                  <div className="age-legend-item">
                    <span className="legend-badge orange">47%</span>
                    <span className="legend-text">56-70 Y</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table Card */}
            <div className="overview-card bookings-card-section">
              <div className="bookings-header-toolbar">
                <div className="bookings-left-controls">
                  <div className="booking-pill-tabs">
                    <button
                      className={`booking-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Upcoming Bookings
                    </button>
                    <button
                      className={`booking-tab ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All Bookings
                    </button>
                    <button
                      className={`booking-tab ${activeTab === 'canceled' ? 'active' : ''}`}
                      onClick={() => setActiveTab('canceled')}
                    >
                      Canceled Bookings
                    </button>
                  </div>

                  <button className="filter-pill-btn">
                    <span>Filter</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="7" y1="12" x2="17" y2="12" />
                      <line x1="10" y1="18" x2="14" y2="18" />
                    </svg>
                  </button>
                </div>

                <button className="see-all-link-btn">
                  See all <span>›</span>
                </button>
              </div>

              {/* Table */}
              <div className="overview-table-wrapper">
                <table className="overview-table">
                  <thead>
                    <tr>
                      <th>Start Time</th>
                      <th>Book Services</th>
                      <th>End Time Expected</th>
                      <th>Client</th>
                      <th>Employee</th>
                      <th className="th-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((row) => (
                      <tr key={row.id}>
                        <td className="td-bold">{row.startTime}</td>
                        <td>{row.service}</td>
                        <td className="td-muted">{row.endTime}</td>
                        <td>{row.client}</td>
                        <td>{row.employee}</td>
                        <td className="td-action">
                          <button className="table-action-dots-btn" aria-label="Action options">
                            •••
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}

export default Dashboard
