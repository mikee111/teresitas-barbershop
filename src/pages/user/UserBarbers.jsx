import { useState, useEffect } from 'react'
import '../../styles/UserBarbers.css'
import {
  fetchBarbers,
  subscribeToBarbers,
  INITIAL_DEFAULT_BARBERS
} from '../../services/barberService'
import { barbersIconsImg, barbersCrewSidebarIcon } from '../../assets/images'

function UserBarbers({ appointments = [], onSelectBarberToBook }) {
  const [barbers, setBarbers] = useState(INITIAL_DEFAULT_BARBERS)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  useEffect(() => {
    let isMounted = true

    const loadBarbersData = async () => {
      try {
        const data = await fetchBarbers()
        if (isMounted && data && data.length > 0) {
          setBarbers(data)
        }
      } catch (err) {
        console.error('Error fetching barbers in UserBarbers:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadBarbersData()

    const unsubscribe = subscribeToBarbers((updatedList) => {
      if (isMounted && updatedList && updatedList.length > 0) {
        setBarbers(updatedList)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // Calculate real-time active bookings for each barber
  const getBarberBookings = (barber) => {
    return appointments.filter((appt) => {
      const isMatchingBarber =
        appt.barber?.id === barber.id ||
        (appt.barber?.name && appt.barber.name.toLowerCase() === barber.name.toLowerCase())
      const isActiveStatus =
        appt.status === 'confirmed' || appt.status === 'pending' || appt.status === 'in-progress'
      return isMatchingBarber && isActiveStatus
    })
  }

  // Filter list
  const filteredBarbers = barbers.filter((barber) => {
    const barberBookings = getBarberBookings(barber)
    const matchesSearch =
      (barber.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (barber.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (barber.specialty || '').toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (selectedFilter === 'Available') {
      return barber.status === 'Active' && barberBookings.length === 0
    }
    if (selectedFilter === 'Booked') {
      return barber.status === 'Active' && barberBookings.length > 0
    }
    if (selectedFilter === 'Senior') {
      return (barber.position || '').toLowerCase().includes('senior')
    }
    return true
  })

  // Crew summary counts
  const totalStaff = barbers.length
  const activeStaff = barbers.filter((b) => b.status === 'Active').length
  const totalCrewBookings = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending' || a.status === 'in-progress'
  ).length

  return (
    <div className="user-barbers-container">
      {/* Top Header */}
      <div className="user-barbers-header">
        <div className="user-barbers-title-area">
          <h2>Barbers Crew & Staff</h2>
          <p>Meet our master barbers and specialists. Check live availability and book your seat.</p>
        </div>

        {/* Live Status Quick Summary Stats */}
        <div className="user-barbers-stats-row">
          <div className="user-barbers-stat-chip">
            <span className="stat-chip-icon">💈</span>
            <div className="stat-chip-info">
              <span className="stat-chip-val">{totalStaff}</span>
              <span className="stat-chip-label">Total Crew</span>
            </div>
          </div>

          <div className="user-barbers-stat-chip">
            <span className="stat-chip-icon">🟢</span>
            <div className="stat-chip-info">
              <span className="stat-chip-val">{activeStaff}</span>
              <span className="stat-chip-label">Active On Duty</span>
            </div>
          </div>

          <div className="user-barbers-stat-chip">
            <span className="stat-chip-icon">📅</span>
            <div className="stat-chip-info">
              <span className="stat-chip-val">{totalCrewBookings}</span>
              <span className="stat-chip-label">Active Bookings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="user-barbers-controls">
        <div className="user-barbers-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search barber name, specialty, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-barbers-tabs">
          {['All', 'Available', 'Booked', 'Senior'].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`user-barbers-tab-btn ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter === 'All' ? 'All Staff' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Barbers Grid */}
      {isLoading && barbers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading live crew staff...
        </div>
      ) : filteredBarbers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', color: '#64748b' }}>
          No staff members found matching your search.
        </div>
      ) : (
        <div className="user-barbers-grid">
          {filteredBarbers.map((barber) => {
            const barberBookings = getBarberBookings(barber)
            const isInactive = barber.status === 'Inactive'
            const hasBookings = barberBookings.length > 0
            const nextBooking = hasBookings ? barberBookings[0] : null

            return (
              <div
                key={barber.id}
                className={`user-barber-card ${isInactive ? 'inactive' : ''}`}
              >
                {/* Top Banner Status Badge */}
                <div className="user-barber-top-badge-row">
                  {isInactive ? (
                    <span className="user-barber-status-badge inactive">
                      <span className="status-dot red" /> Inactive / Off Duty
                    </span>
                  ) : hasBookings ? (
                    <span className="user-barber-status-badge busy">
                      <span className="status-dot amber" /> {barberBookings.length} Active Booking{barberBookings.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="user-barber-status-badge available">
                      <span className="status-dot green" /> Available Now
                    </span>
                  )}

                  <span className="user-barber-schedule-badge">
                    ⏱ {barber.hours || `${barber.startTime || '9:00 AM'} - ${barber.endTime || '6:00 PM'}`}
                  </span>
                </div>

                {/* Barber Info Body */}
                <div className="user-barber-body">
                  <div className="user-barber-avatar-box">
                    <img
                      src={barbersIconsImg}
                      alt={barber.name}
                      className="user-barber-avatar-img"
                    />
                    <span
                      className={`user-barber-online-indicator ${
                        isInactive ? 'offline' : hasBookings ? 'busy' : 'online'
                      }`}
                    />
                  </div>

                  <h3 className="user-barber-name">{barber.name}</h3>
                  <span className="user-barber-position">{barber.position}</span>

                  <div className="user-barber-specialty-pill">
                    ✂️ {barber.specialty || 'General Haircut Specialist'}
                  </div>

                  <div className="user-barber-meta-list">
                    <div className="user-barber-meta-item">
                      <span className="meta-icon">🗓</span>
                      <span>{barber.schedule || 'Monday - Saturday'}</span>
                    </div>

                    {/* Real-time booking live status indicator */}
                    <div className="user-barber-meta-item live-status-item">
                      <span className="meta-icon">⚡</span>
                      {isInactive ? (
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>Not taking bookings</span>
                      ) : hasBookings ? (
                        <span style={{ color: '#d97706', fontWeight: 600 }}>
                          Next: {nextBooking.date} at {nextBooking.time}
                        </span>
                      ) : (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>Ready for immediate booking</span>
                      )}
                    </div>
                  </div>

                  {/* Book Action Button */}
                  <button
                    type="button"
                    className="user-barber-book-btn"
                    disabled={isInactive}
                    onClick={() => onSelectBarberToBook && onSelectBarberToBook(barber)}
                  >
                    {isInactive ? 'Temporarily Unavailable' : `📅 Book with ${barber.name.split(' ')[0]}`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserBarbers
