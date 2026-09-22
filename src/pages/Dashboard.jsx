import { useState, useRef, useEffect } from 'react'
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
import { subscribeToUsers, fetchRegisteredClients } from '../services/authService'

/**
 * Calculates smooth SVG spline path & area fill using cubic Bézier curves
 */
function generateSplineData(dataPoints = [], width = 600, height = 200, maxY = 50000) {
  const padTop = 32
  const padBottom = 26
  const padLeft = 20
  const padRight = 20

  const plotWidth = width - padLeft - padRight
  const plotHeight = height - padTop - padBottom

  const points = dataPoints.map((dp, idx) => {
    const x = padLeft + (idx / Math.max(1, dataPoints.length - 1)) * plotWidth
    const clampedVal = Math.max(0, Math.min(maxY, dp.value || 0))
    const y = padTop + plotHeight - (clampedVal / (maxY || 1)) * plotHeight
    return { ...dp, x, y }
  })

  if (points.length === 0) return { pathD: '', areaD: '', points: [] }
  if (points.length === 1) {
    return {
      pathD: `M ${points[0].x} ${points[0].y}`,
      areaD: '',
      points
    }
  }

  let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

    const tension = 0.22
    const cp1x = p1.x + (p2.x - p0.x) * tension
    const cp1y = p1.y + (p2.y - p0.y) * tension
    const cp2x = p2.x - (p3.x - p1.x) * tension
    const cp2y = p2.y - (p3.y - p1.y) * tension

    pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }

  const areaBottom = height - padBottom + 10
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${areaBottom} L ${points[0].x.toFixed(1)} ${areaBottom} Z`

  return { pathD, areaD, points }
}

function Dashboard({ onBackToSite, user, appointments, onUpdateAppointment, onUserUpdate }) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [settingsSubNav, setSettingsSubNav] = useState('business-info')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedAgeMonth, setSelectedAgeMonth] = useState('September')
  const [chartTimeframe, setChartTimeframe] = useState('year') // 'day' | 'month' | 'year'
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [newAppointmentAlert, setNewAppointmentAlert] = useState(null)

  // Track pending appointments count for the sidebar badge
  const pendingAppointments = (appointments || []).filter(
    (a) => (a.status || '').toLowerCase() === 'pending'
  )
  const pendingCount = pendingAppointments.length

  // Real-time detection when a new appointment is booked by a client
  const prevAppointmentsLengthRef = useRef(appointments?.length || 0)

  useEffect(() => {
    const currentLen = appointments?.length || 0
    if (currentLen > prevAppointmentsLengthRef.current && prevAppointmentsLengthRef.current > 0) {
      const newest = appointments[0]
      if (newest) {
        setNewAppointmentAlert(newest)
        const timer = setTimeout(() => {
          setNewAppointmentAlert(null)
        }, 7000)
        return () => clearTimeout(timer)
      }
    }
    prevAppointmentsLengthRef.current = currentLen
  }, [appointments])

  // Real-time detection when a new customer registers an account
  const [newCustomerAlert, setNewCustomerAlert] = useState(null)
  const prevUsersCountRef = useRef(0)

  useEffect(() => {
    let isMounted = true

    const initUsers = async () => {
      try {
        const users = await fetchRegisteredClients()
        if (isMounted && users) {
          prevUsersCountRef.current = users.length
        }
      } catch {
        // ignore
      }
    }
    initUsers()

    const unsubscribe = subscribeToUsers((updatedUsers) => {
      if (!isMounted || !updatedUsers) return
      if (prevUsersCountRef.current > 0 && updatedUsers.length > prevUsersCountRef.current) {
        const newest = updatedUsers[0]
        if (newest) {
          setNewCustomerAlert(newest)
          const timer = setTimeout(() => {
            if (isMounted) setNewCustomerAlert(null)
          }, 8000)
          return () => clearTimeout(timer)
        }
      }
      prevUsersCountRef.current = updatedUsers.length
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

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
    admin: 'Admin',
    'customer-accounts': 'Customer Accounts'
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

  // Dynamic Date & Current Month calculation
  const now = new Date()
  const monthNamesFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const currentMonthName = monthNamesFull[now.getMonth()]
  const currentMonthShort = monthNamesShort[now.getMonth()]
  const currentYearNum = now.getFullYear()
  const currentMonthLabel = `${currentMonthName} ${currentYearNum}`
  const todayDateStr = `${currentMonthShort} ${now.getDate()}, ${currentYearNum}`

  // Real-time categorization of appointments by status
  const completedAppts = (appointments || []).filter(
    (a) => (a.status || '').toLowerCase() === 'completed'
  )
  const confirmedAppts = (appointments || []).filter(
    (a) => (a.status || '').toLowerCase() === 'confirmed'
  )
  const pendingAppts = (appointments || []).filter(
    (a) => (a.status || '').toLowerCase() === 'pending'
  )

  const completedCount = completedAppts.length
  const confirmedCount = confirmedAppts.length
  const pendingBookingsCount = pendingAppts.length

  // Real-time completed revenue from served bookings
  const completedRevenue = completedAppts.reduce((sum, appt) => {
    const val = typeof appt.price === 'number' ? appt.price : parseFloat(appt.price) || 0
    return sum + val
  }, 0)

  // Filter completed appointments for today & this month
  const todayCompletedAppts = completedAppts.filter(
    (a) => a.date === todayDateStr || a.date?.includes(`${now.getDate()}`)
  )
  const todayCompletedRevenue = todayCompletedAppts.reduce(
    (sum, a) => sum + (typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0),
    0
  )

  const monthCompletedAppts = completedAppts.filter(
    (a) => a.date?.includes(currentMonthShort) || a.date?.includes(currentMonthName)
  )
  const monthCompletedRevenue = monthCompletedAppts.reduce(
    (sum, a) => sum + (typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0),
    0
  )

  // Real-time dynamic KPI calculations:
  // Base sales + live completed appointment revenue
  const todaySales = 3450 + (todayCompletedRevenue > 0 ? todayCompletedRevenue : completedRevenue)
  const monthlySales = 48200 + (monthCompletedRevenue > 0 ? monthCompletedRevenue : completedRevenue)
  const yearlyRevenue = 320000 + completedRevenue

  // Dynamic Real-time Chart Data Generator for Day | Month | Year
  const yearDataset = [
    { label: 'Jan', shortLabel: 'Jan', value: 24500, tag: 'January', note: 'Start of Year' },
    { label: 'Feb', shortLabel: 'Feb', value: 22000, tag: 'February', note: 'Regular Season' },
    { label: 'Mar', shortLabel: 'Mar', value: 28500, tag: 'March', note: 'Graduation Cuts' },
    { label: 'Apr', shortLabel: 'Apr', value: 21200, tag: 'April', note: 'Summer Break' },
    { label: 'May', shortLabel: 'May', value: 27000, tag: 'May', note: 'Vacation Peak' },
    { label: 'Jun', shortLabel: 'Jun', value: 32500, tag: 'June', note: 'School Openings' },
    { label: 'Jul', shortLabel: 'Jul', value: 19800, tag: 'July', note: 'Rainy Season Dip' },
    { label: 'Aug', shortLabel: 'Aug', value: 25400, tag: 'August', note: 'Back to School' },
    { label: 'Sep', shortLabel: 'Sep', value: monthlySales, tag: 'September (Current)', note: 'Live Monthly Total', isCurrent: true },
    { label: 'Oct', shortLabel: 'Oct', value: 28000, tag: 'October', note: 'Halloween Prep' },
    { label: 'Nov', shortLabel: 'Nov', value: 34500, tag: 'November', note: 'Pre-Holiday Boom' },
    { label: 'Dec', shortLabel: 'Dec', value: 48600, tag: 'December (Peak)', note: 'Holiday Peak 🎄', isPeak: true }
  ]

  const monthDataset = [
    { label: 'Day 1', shortLabel: '1', value: 1450, tag: 'Sep 1 (Mon)', note: 'Regular Day' },
    { label: 'Day 3', shortLabel: '3', value: 2800, tag: 'Sep 3 (Wed)', note: 'Midweek Uptick' },
    { label: 'Day 5', shortLabel: '5', value: 3600, tag: 'Sep 5 (Fri)', note: 'Weekend Rush' },
    { label: 'Day 7', shortLabel: '7', value: 3950, tag: 'Sep 7 (Sun)', note: 'Sunday Peak' },
    { label: 'Day 8', shortLabel: '8 (Today)', value: todaySales, tag: 'Sep 8 (Today)', note: 'Live Daily Total', isCurrent: true },
    { label: 'Day 12', shortLabel: '12', value: 2900, tag: 'Sep 12 (Fri)', note: 'Weekend Rush' },
    { label: 'Day 14', shortLabel: '14', value: 3750, tag: 'Sep 14 (Sun)', note: 'Sunday Peak' },
    { label: 'Day 18', shortLabel: '18', value: 2200, tag: 'Sep 18 (Thu)', note: 'Regular Day' },
    { label: 'Day 21', shortLabel: '21', value: 3800, tag: 'Sep 21 (Sun)', note: 'Sunday Peak' },
    { label: 'Day 25', shortLabel: '25', value: 2450, tag: 'Sep 25 (Thu)', note: 'Payday Rush' },
    { label: 'Day 28', shortLabel: '28', value: 3900, tag: 'Sep 28 (Sun)', note: 'Weekend Peak' },
    { label: 'Day 30', shortLabel: '30', value: 2350, tag: 'Sep 30 (Tue)', note: 'End of Month' }
  ]

  const liveDayBonus = todayCompletedRevenue > 0 ? todayCompletedRevenue : completedRevenue
  const dayDataset = [
    { label: '9:00 AM', shortLabel: '9 AM', value: 450, tag: '9:00 AM', note: 'Shop Opening' },
    { label: '11:00 AM', shortLabel: '11 AM', value: 750, tag: '11:00 AM', note: 'Morning Queue' },
    { label: '1:00 PM', shortLabel: '1 PM', value: 1200 + Math.round(liveDayBonus * 0.4), tag: '1:00 PM', note: 'After-Lunch Rush' },
    { label: '3:00 PM', shortLabel: '3 PM', value: 1500 + Math.round(liveDayBonus * 0.6), tag: '3:00 PM (Peak)', note: 'After-Work Rush ⚡', isPeak: true },
    { label: '5:00 PM', shortLabel: '5 PM', value: 1100, tag: '5:00 PM', note: 'Evening Clients' },
    { label: '7:00 PM', shortLabel: '7 PM', value: 600, tag: '7:00 PM', note: 'Closing Hours' }
  ]

  // Timeframe configurations
  const timeframeConfig = {
    year: {
      title: 'Annual Revenue Analytics',
      growthBadge: '+15.3% vs last year',
      growthType: 'positive',
      subtext: 'Month-by-month sales trajectory across 2026',
      data: yearDataset,
      maxY: 55000,
      yAxisLabels: ['50K', '40K', '30K', '20K', '10K', '0'],
      defaultIndex: 8 // September (Current)
    },
    month: {
      title: `Monthly Revenue (${currentMonthName} 2026)`,
      growthBadge: '+8.2% vs last month',
      growthType: 'positive',
      subtext: 'Daily breakdown showing weekend spikes (Fri–Sun)',
      data: monthDataset,
      maxY: 5000,
      yAxisLabels: ['5K', '4K', '3K', '2K', '1K', '0'],
      defaultIndex: 4 // Today (Day 8)
    },
    day: {
      title: `Today's Peak Hours (${todayDateStr})`,
      growthBadge: '+12.4% vs yesterday',
      growthType: 'positive',
      subtext: 'Hourly sales distribution (Peak: 1:00 PM – 4:00 PM)',
      data: dayDataset,
      maxY: 2400,
      yAxisLabels: ['2.4K', '1.8K', '1.2K', '0.6K', '0'],
      defaultIndex: 3 // 3:00 PM Peak
    }
  }

  const currentTfConfig = timeframeConfig[chartTimeframe] || timeframeConfig.year
  const splineData = generateSplineData(currentTfConfig.data, 600, 200, currentTfConfig.maxY)
  const activeTooltipIndex = hoveredPointIndex !== null ? hoveredPointIndex : currentTfConfig.defaultIndex
  const activePoint = splineData.points[activeTooltipIndex] || splineData.points[0]

  const statCardsData = [
    {
      id: 'today-sales',
      title: "Today's Sales",
      icon: '₱',
      iconClass: 'icon-sales',
      value: `₱${todaySales.toLocaleString()}`,
      trend: '+12.4% vs yesterday',
      trendType: 'positive',
      subtext: `From completed bookings today`
    },
    {
      id: 'monthly-sales',
      title: 'Monthly Sales',
      icon: '📈',
      iconClass: 'icon-month',
      value: `₱${monthlySales.toLocaleString()}`,
      trend: '+8.2% vs last mo',
      trendType: 'positive',
      subtext: currentMonthLabel
    },
    {
      id: 'yearly-revenue',
      title: 'Yearly Revenue',
      icon: '🏦',
      iconClass: 'icon-year',
      value: `₱${yearlyRevenue.toLocaleString()}`,
      trend: '+15.3% growth',
      trendType: 'positive',
      subtext: `${currentYearNum} Fiscal Year`
    },
    {
      id: 'today-bookings',
      title: "Today's Bookings",
      icon: '📅',
      iconClass: 'icon-bookings',
      value: `${completedCount} Completed`,
      trend: pendingBookingsCount > 0 ? `${pendingBookingsCount} Pending` : 'All Caught Up',
      trendType: pendingBookingsCount > 0 ? 'warning' : 'positive',
      subtext: `${confirmedCount} Confirmed • ${completedCount} Completed`
    }
  ]

  const fallbackBookingsData = [
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

  const liveBookings =
    appointments && appointments.length > 0
      ? appointments.map((appt) => {
          const startTime = appt.confirmedTime || appt.requestedTime || appt.time || '10:00 AM'
          const client = appt.customer || 'Client'
          const employee =
            appt.barber?.name || (typeof appt.barber === 'string' ? appt.barber : 'Unassigned')
          const serviceName =
            appt.service?.name || (typeof appt.service === 'string' ? appt.service : 'Hair Cut')
          const rawStatus = (appt.status || '').toLowerCase()
          const normalizedStatus =
            rawStatus === 'cancelled'
              ? 'canceled'
              : rawStatus === 'completed'
              ? 'completed'
              : 'upcoming'

          return {
            id: appt.id,
            startTime,
            service: serviceName,
            endTime: appt.duration ? `${startTime} (${appt.duration})` : '10:30 AM',
            client,
            employee,
            status: normalizedStatus,
            rawStatus,
            rawAppt: appt,
          }
        })
      : fallbackBookingsData

  const filteredBookings = liveBookings.filter((item) => {
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
              onClick={() => {
                handleNavClick('appointment')
                setNewAppointmentAlert(null)
              }}
              style={{ position: 'relative' }}
            >
              <span className="sidebar-btn-icon">📅</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Appointment</span>
              {pendingCount > 0 && (
                <span
                  className="sidebar-appointment-badge"
                  title={`${pendingCount} pending booking${pendingCount > 1 ? 's' : ''}`}
                >
                  {pendingCount}
                </span>
              )}
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

              <button
                className={`sidebar-sub-btn ${
                  activeNav === 'settings' && settingsSubNav === 'customer-accounts' ? 'active' : ''
                }`}
                onClick={() => handleSettingsSubNavClick('customer-accounts')}
              >
                <span className="sidebar-sub-btn-emoji">👥</span>
                <span>Customer Accounts</span>
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
            <button
              className="notification-btn"
              aria-label="Notifications"
              onClick={() => {
                handleNavClick('appointment')
                setNewAppointmentAlert(null)
              }}
              title={pendingCount > 0 ? `${pendingCount} pending booking${pendingCount > 1 ? 's' : ''}` : 'No new notifications'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {pendingCount > 0 && (
                <span className="topbar-notification-badge">{pendingCount}</span>
              )}
            </button>
            <div className="user-profile">
              <img
                src={user?.avatarUrl || lowFadeImg}
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

        {/* Real-time alert when a new customer registers */}
        {newCustomerAlert && (
          <div
            className="new-customer-toast-alert"
            onClick={() => {
              handleSettingsSubNavClick('customer-accounts')
              setNewCustomerAlert(null)
            }}
          >
            <div className="toast-alert-content">
              <span className="toast-alert-icon">🎉</span>
              <div>
                <strong>New Customer Account Registered!</strong>
                <p>
                  {newCustomerAlert.firstName} {newCustomerAlert.lastName} ({newCustomerAlert.email}) just created an account.
                </p>
              </div>
            </div>
            <button className="toast-alert-btn" type="button">
              View Account &rarr;
            </button>
          </div>
        )}

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
            <Client appointments={appointments} />
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
              onUpdateUser={onUserUpdate}
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
                    <span className={`stat-trend-badge ${card.trendType}`}>
                      {card.trendType === 'positive' && '↗ '}
                      {card.trend}
                    </span>
                  </div>
                  <div className="stat-box-bottom">
                    <span className={`stat-circle-icon ${card.iconClass || ''}`}>{card.icon}</span>
                    <div className="stat-val-group">
                      <span className="stat-box-value">{card.value}</span>
                      {card.subtext && <span className="stat-box-subtext">{card.subtext}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row (Annual Revenue + Customer Age) */}
            <div className="overview-charts-grid">
              {/* Revenue Analytics Chart with Day | Month | Year Toggle */}
              <div className="overview-card revenue-chart-card">
                <div className="card-header-flex">
                  <div className="chart-title-group">
                    <h2 className="card-heading">{currentTfConfig.title}</h2>
                    <span className="chart-subtext">{currentTfConfig.subtext}</span>
                  </div>
                  <div className="card-header-actions">
                    {/* Growth Indicator Badge */}
                    <span className={`chart-growth-badge ${currentTfConfig.growthType}`}>
                      {currentTfConfig.growthType === 'positive' ? '🟢' : '🔴'}{' '}
                      {currentTfConfig.growthBadge}
                    </span>
                    {/* 3-Way Timeframe Toggle */}
                    <div className="chart-timeframe-toggle">
                      {['day', 'month', 'year'].map((tf) => (
                        <button
                          key={tf}
                          className={`timeframe-btn ${chartTimeframe === tf ? 'active' : ''}`}
                          onClick={() => {
                            setChartTimeframe(tf)
                            setHoveredPointIndex(null)
                          }}
                        >
                          {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="revenue-chart-wrapper">
                  {/* Dynamic Y-Axis */}
                  <div className="revenue-y-axis">
                    {currentTfConfig.yAxisLabels.map((label, i) => (
                      <span key={i}>{label}</span>
                    ))}
                  </div>

                  <div className="revenue-svg-area">
                    {/* Horizontal Grid lines */}
                    <div className="chart-grid-lines">
                      {currentTfConfig.yAxisLabels.map((_, i) => (
                        <div key={i} className="grid-line"></div>
                      ))}
                    </div>

                    {/* Dynamic SVG Curve */}
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
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#a855f7" floodOpacity="0.35" />
                        </filter>
                      </defs>

                      {/* Gradient area fill under the curve */}
                      {splineData.areaD && (
                        <path
                          d={splineData.areaD}
                          fill="url(#areaGradient)"
                          className="chart-area-fill"
                        />
                      )}

                      {/* Smooth spline curve */}
                      <path
                        d={splineData.pathD}
                        fill="none"
                        stroke="url(#curveGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="chart-spline-path"
                      />

                      {/* Interactive data point nodes */}
                      {splineData.points.map((pt, idx) => (
                        <g key={idx}>
                          {/* Invisible wider hit area for hover */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="14"
                            fill="transparent"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          />
                          {/* Vertical dashed guide line on active point */}
                          {activeTooltipIndex === idx && (
                            <line
                              x1={pt.x}
                              y1={pt.y}
                              x2={pt.x}
                              y2="200"
                              stroke="#a855f7"
                              strokeWidth="1"
                              strokeDasharray="4 3"
                              opacity="0.4"
                            />
                          )}
                          {/* Visible node circle */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={activeTooltipIndex === idx ? 6 : pt.isCurrent ? 5 : 4}
                            fill={activeTooltipIndex === idx ? '#a855f7' : pt.isCurrent ? '#22c55e' : '#ffffff'}
                            stroke={pt.isCurrent ? '#22c55e' : '#a855f7'}
                            strokeWidth="2.5"
                            className={`chart-node ${activeTooltipIndex === idx ? 'active' : ''} ${pt.isCurrent ? 'current' : ''}`}
                          />
                          {/* Outer pulse ring on current point */}
                          {pt.isCurrent && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="10"
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="1.5"
                              opacity="0.4"
                              className="pulse-ring"
                            />
                          )}
                        </g>
                      ))}
                    </svg>

                    {/* Dynamic Tooltip */}
                    {activePoint && (
                      <div
                        className={`chart-tooltip-badge ${activePoint.isCurrent ? 'live' : ''} ${activePoint.isPeak ? 'peak' : ''}`}
                        style={{
                          left: `${(activePoint.x / 600) * 100}%`,
                          top: `${(activePoint.y / 200) * 100 - 18}%`
                        }}
                      >
                        <span className="tooltip-tag">{activePoint.tag || activePoint.label}</span>
                        <span className="tooltip-number">₱{(activePoint.value || 0).toLocaleString()}</span>
                        {activePoint.note && <span className="tooltip-note">{activePoint.note}</span>}
                        <div className="tooltip-arrow"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic X-Axis Labels */}
                <div className="revenue-x-axis">
                  {currentTfConfig.data.map((dp, i) => (
                    <span
                      key={i}
                      className={`x-label ${dp.isCurrent ? 'current' : ''} ${activeTooltipIndex === i ? 'active' : ''}`}
                    >
                      {dp.shortLabel}
                    </span>
                  ))}
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

      {/* Real-time New Booking Popup Toast */}
      {newAppointmentAlert && (
        <div className="admin-appointment-alert-toast" role="alert">
          <span className="toast-bell-icon">🔔</span>
          <div className="toast-text-body">
            <span className="toast-title">New Appointment Booked!</span>
            <span className="toast-subtitle">
              <strong>{newAppointmentAlert.customer || 'A client'}</strong> booked{' '}
              {newAppointmentAlert.service?.name || 'a service'} for{' '}
              {newAppointmentAlert.time || 'requested time'}
            </span>
          </div>
          <button
            type="button"
            className="toast-view-btn"
            onClick={() => {
              setNewAppointmentAlert(null)
              handleNavClick('appointment')
            }}
          >
            View
          </button>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setNewAppointmentAlert(null)}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard
