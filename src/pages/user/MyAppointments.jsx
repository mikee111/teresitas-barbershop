import { useState } from 'react'
import '../../styles/MyAppointments.css'
import {
  servicesScissorIcon,
  barbersIconsImg,
  timeIcon
} from '../../assets/images'

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM'
]

const UPCOMING_DATES = [
  'Aug 25, 2026',
  'Aug 26, 2026',
  'Aug 27, 2026',
  'Aug 28, 2026',
  'Aug 29, 2026',
  'Aug 30, 2026',
  'Aug 31, 2026'
]

function MyAppointments({
  appointments = [],
  onNavigateToBook,
  onUpdateAppointment,
  onRebook
}) {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [modalMode, setModalMode] = useState(null) // 'details' | 'reschedule' | 'cancel' | 'review'

  // Reschedule form state
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  // Cancel form state
  const [cancelReason, setCancelReason] = useState('Schedule conflict')

  // Review form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  // Filter appointments
  const filteredAppointments = appointments.filter((appt) => {
    // Tab filter
    if (activeTab === 'upcoming' && appt.status !== 'confirmed' && appt.status !== 'pending' && appt.status !== 'in-progress') return false
    if (activeTab === 'completed' && appt.status !== 'completed') return false
    if (activeTab === 'cancelled' && appt.status !== 'cancelled') return false

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const serviceMatch = appt.service?.name?.toLowerCase().includes(q)
      const barberMatch = appt.barber?.name?.toLowerCase().includes(q)
      const refMatch = appt.refCode?.toLowerCase().includes(q)
      return serviceMatch || barberMatch || refMatch
    }

    return true
  })

  // Summary counts
  const upcomingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'in-progress').length
  const completedCount = appointments.filter(a => a.status === 'completed').length
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length

  const earliestUpcoming = appointments.find(a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'in-progress')

  // Handlers
  const handleOpenDetails = (appt) => {
    setSelectedAppt(appt)
    setModalMode('details')
  }

  const handleOpenReschedule = (appt) => {
    setSelectedAppt(appt)
    setNewDate(appt.date || UPCOMING_DATES[0])
    setNewTime(appt.time || TIME_SLOTS[0])
    setModalMode('reschedule')
  }

  const handleConfirmReschedule = () => {
    if (selectedAppt && onUpdateAppointment) {
      onUpdateAppointment(selectedAppt.id, {
        date: newDate,
        time: newTime,
        status: 'confirmed'
      })
    }
    setModalMode(null)
    setSelectedAppt(null)
  }

  const handleOpenCancel = (appt) => {
    setSelectedAppt(appt)
    setCancelReason('Schedule conflict')
    setModalMode('cancel')
  }

  const handleConfirmCancel = () => {
    if (selectedAppt && onUpdateAppointment) {
      onUpdateAppointment(selectedAppt.id, {
        status: 'cancelled',
        cancelReason: cancelReason
      })
    }
    setModalMode(null)
    setSelectedAppt(null)
  }

  const handleOpenReview = (appt) => {
    setSelectedAppt(appt)
    setReviewRating(5)
    setReviewComment('')
    setModalMode('review')
  }

  const handleConfirmReview = () => {
    if (selectedAppt && onUpdateAppointment) {
      onUpdateAppointment(selectedAppt.id, {
        rating: reviewRating,
        review: reviewComment
      })
    }
    setModalMode(null)
    setSelectedAppt(null)
  }

  return (
    <div className="my-appointments-container">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="my-appts-header">
        <div className="my-appts-title-group">
          <h1>My Appointments</h1>
          <p className="my-appts-subtitle">View and manage your scheduled barbershop visits and service history.</p>
        </div>

        <button
          type="button"
          className="my-appts-book-btn"
          onClick={onNavigateToBook}
        >
          <span>📅</span>
          <span>+ Book New Appointment</span>
        </button>
      </div>

      {/* ── Top Glance Stats ───────────────────────────────── */}
      <div className="my-appts-stats-grid">
        {/* Next Appointment */}
        <div className="my-appts-stat-card">
          <div className="my-appts-stat-icon purple">
            {timeIcon ? (
              <img src={timeIcon} alt="Time" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            ) : (
              '🕒'
            )}
          </div>
          <div>
            <div className="my-appts-stat-label">Next Appointment</div>
            <div className="my-appts-stat-val">
              {earliestUpcoming ? `${earliestUpcoming.date}` : 'None Scheduled'}
            </div>
            <div className="my-appts-stat-sub">
              {earliestUpcoming ? `at ${earliestUpcoming.time} with ${earliestUpcoming.barber?.name}` : 'Ready for a fresh cut?'}
            </div>
          </div>
        </div>

        {/* Total Visits Completed */}
        <div className="my-appts-stat-card">
          <div className="my-appts-stat-icon emerald">
            <span style={{ fontSize: '1.4rem' }}>✂️</span>
          </div>
          <div>
            <div className="my-appts-stat-label">Total Visits</div>
            <div className="my-appts-stat-val">{completedCount} Completed</div>
            <div className="my-appts-stat-sub">Teresitas Regular Client</div>
          </div>
        </div>

        {/* Favorite Barber */}
        <div className="my-appts-stat-card">
          <div className="my-appts-stat-icon amber">
            {barbersIconsImg ? (
              <img src={barbersIconsImg} alt="Barber" style={{ width: 26, height: 26, borderRadius: '50%' }} />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <div className="my-appts-stat-label">Preferred Barber</div>
            <div className="my-appts-stat-val">Mark Reyes</div>
            <div className="my-appts-stat-sub">Master Barber • ⭐ 4.9</div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Search ────────────────────────────── */}
      <div className="my-appts-toolbar">
        <div className="my-appts-tabs">
          <button
            type="button"
            className={`my-appts-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All</span>
            <span className="my-appts-tab-count">{appointments.length}</span>
          </button>

          <button
            type="button"
            className={`my-appts-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span>🟢 Upcoming</span>
            <span className="my-appts-tab-count">{upcomingCount}</span>
          </button>

          <button
            type="button"
            className={`my-appts-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span>⚪ History</span>
            <span className="my-appts-tab-count">{completedCount}</span>
          </button>

          <button
            type="button"
            className={`my-appts-tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            <span>🔴 Cancelled</span>
            <span className="my-appts-tab-count">{cancelledCount}</span>
          </button>
        </div>

        <div className="my-appts-search-box">
          <svg
            className="my-appts-search-icon"
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
          <input
            type="text"
            className="my-appts-search-input"
            placeholder="Search service or barber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Appointments List ──────────────────────────────── */}
      <div className="my-appts-list">
        {filteredAppointments.length === 0 ? (
          <div className="client-empty-canvas" style={{ minHeight: '340px' }}>
            <div className="client-empty-canvas-inner">
              <div className="client-empty-icon-wrap">💈</div>
              <h3 className="client-empty-title">
                {activeTab === 'upcoming'
                  ? 'No Upcoming Appointments'
                  : activeTab === 'completed'
                  ? 'No Completed Visits Yet'
                  : activeTab === 'cancelled'
                  ? 'No Cancelled Bookings'
                  : 'No Appointments Found'}
              </h3>
              <p className="client-empty-desc">
                {activeTab === 'upcoming'
                  ? 'Schedule your next grooming visit today with your favorite barber.'
                  : 'Your booking history will appear here after you finish your appointments.'}
              </p>
              <button
                type="button"
                className="my-appts-book-btn"
                style={{ marginTop: '1.25rem' }}
                onClick={onNavigateToBook}
              >
                📅 Book an Appointment
              </button>
            </div>
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            const isUpcoming = appt.status === 'confirmed' || appt.status === 'pending' || appt.status === 'in-progress'
            const isCompleted = appt.status === 'completed'
            const isCancelled = appt.status === 'cancelled'

            return (
              <article key={appt.id} className="my-appt-card">
                {/* Card Top */}
                <div className="my-appt-card-top">
                  <div className="my-appt-card-service">
                    <div className="my-appt-service-icon-box">
                      <img
                        src={servicesScissorIcon}
                        alt="Service"
                        className="my-appt-service-img"
                      />
                    </div>
                    <div className="my-appt-service-meta">
                      <h3>{appt.service?.name || 'Haircut Service'}</h3>
                      <span className="my-appt-ref">Ref Code: {appt.refCode || `#TB-${appt.id}00`}</span>
                    </div>
                  </div>

                  <span className={`my-appt-status-chip ${appt.status}`}>
                    {appt.status === 'pending' && '🟡 Pending'}
                    {appt.status === 'confirmed' && '● Confirmed'}
                    {appt.status === 'in-progress' && '● In Progress'}
                    {appt.status === 'completed' && '✓ Completed'}
                    {appt.status === 'cancelled' && '✕ Cancelled'}
                  </span>
                </div>

                {/* Card Details Grid */}
                <div className="my-appt-details-grid">
                  <div className="my-appt-info-item">
                    <span className="my-appt-info-label">Assigned Barber</span>
                    <span className="my-appt-info-val">
                      {barbersIconsImg ? (
                        <img src={barbersIconsImg} alt={appt.barber?.name} className="my-appt-barber-avatar" />
                      ) : null}
                      {appt.barber?.name || 'Any Available Barber'}
                    </span>
                  </div>

                  <div className="my-appt-info-item">
                    <span className="my-appt-info-label">Date &amp; Time</span>
                    <span className="my-appt-info-val">
                      📅 {appt.date} at {appt.time}
                    </span>
                  </div>

                  <div className="my-appt-info-item">
                    <span className="my-appt-info-label">Duration &amp; Location</span>
                    <span className="my-appt-info-val">
                      ⏱️ {appt.duration || '45 mins'} • Main Branch
                    </span>
                  </div>

                  <div className="my-appt-info-item">
                    <span className="my-appt-info-label">Payment Mode</span>
                    <span className="my-appt-info-val">
                      💵 {appt.paymentMode || 'Pay at Shop'}
                    </span>
                  </div>
                </div>

                {/* Card Bottom / Actions */}
                <div className="my-appt-card-bottom">
                  <div className="my-appt-price-summary">
                    <span>Total Amount: </span>
                    <span className="my-appt-price-amount">
                      ${Number(appt.service?.price || appt.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="my-appt-actions-group">
                    {/* View Details button (always available) */}
                    <button
                      type="button"
                      className="my-appt-btn my-appt-btn-outline"
                      onClick={() => handleOpenDetails(appt)}
                    >
                      👁️ View Details
                    </button>

                    {/* Upcoming actions */}
                    {isUpcoming && (
                      <>
                        <button
                          type="button"
                          className="my-appt-btn my-appt-btn-reschedule"
                          onClick={() => handleOpenReschedule(appt)}
                        >
                          🔄 Reschedule
                        </button>
                        <button
                          type="button"
                          className="my-appt-btn my-appt-btn-cancel"
                          onClick={() => handleOpenCancel(appt)}
                        >
                          ✕ Cancel
                        </button>
                      </>
                    )}

                    {/* Completed actions */}
                    {isCompleted && (
                      <>
                        <button
                          type="button"
                          className="my-appt-btn my-appt-btn-rebook"
                          onClick={() => {
                            if (onRebook) onRebook(appt)
                            else onNavigateToBook()
                          }}
                        >
                          🔁 Book Again
                        </button>
                        <button
                          type="button"
                          className="my-appt-btn my-appt-btn-review"
                          onClick={() => handleOpenReview(appt)}
                        >
                          ⭐ {appt.rating ? `${appt.rating} / 5` : 'Rate & Review'}
                        </button>
                      </>
                    )}

                    {/* Cancelled actions */}
                    {isCancelled && (
                      <button
                        type="button"
                        className="my-appt-btn my-appt-btn-rebook"
                        onClick={() => {
                          if (onRebook) onRebook(appt)
                          else onNavigateToBook()
                        }}
                      >
                        📅 Rebook Cut
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      {/* ── MODALS ─────────────────────────────────────────── */}

      {/* 1. View Details Modal */}
      {modalMode === 'details' && selectedAppt && (
        <div className="my-appt-modal-overlay">
          <div className="my-appt-modal-card">
            <div className="my-appt-modal-header">
              <h2>Appointment Details</h2>
              <button
                type="button"
                className="my-appt-modal-close"
                onClick={() => setModalMode(null)}
              >
                ✕
              </button>
            </div>

            <div className="my-appt-modal-body">
              <div className="my-appt-receipt-section">
                <span className="my-appt-receipt-title">Booking Summary</span>
                <div className="my-appt-receipt-row">
                  <span>Reference Code:</span>
                  <strong>{selectedAppt.refCode}</strong>
                </div>
                <div className="my-appt-receipt-row">
                  <span>Status:</span>
                  <span className={`my-appt-status-chip ${selectedAppt.status}`}>
                    {selectedAppt.status}
                  </span>
                </div>
              </div>

              <div className="my-appt-receipt-divider" />

              <div className="my-appt-receipt-section">
                <span className="my-appt-receipt-title">Service &amp; Barber</span>
                <div className="my-appt-receipt-row">
                  <span>Service:</span>
                  <strong>{selectedAppt.service?.name}</strong>
                </div>
                <div className="my-appt-receipt-row">
                  <span>Barber:</span>
                  <span>{selectedAppt.barber?.name} ({selectedAppt.barber?.role || 'Master Barber'})</span>
                </div>
                <div className="my-appt-receipt-row">
                  <span>Schedule:</span>
                  <span>{selectedAppt.date} at {selectedAppt.time}</span>
                </div>
                <div className="my-appt-receipt-row">
                  <span>Branch:</span>
                  <span>Teresitas Barbershop (Main Branch)</span>
                </div>
              </div>

              <div className="my-appt-receipt-divider" />

              <div className="my-appt-receipt-section">
                <span className="my-appt-receipt-title">Payment Breakdown</span>
                <div className="my-appt-receipt-row">
                  <span>Base Service Fee:</span>
                  <span>${Number(selectedAppt.service?.price || selectedAppt.price || 0).toFixed(2)}</span>
                </div>
                <div className="my-appt-receipt-row">
                  <span>Payment Method:</span>
                  <span>{selectedAppt.paymentMode || 'Pay at Shop (Cash / Card)'}</span>
                </div>
                <div className="my-appt-receipt-row bold">
                  <span>Total:</span>
                  <span style={{ color: '#7c3aed', fontSize: '1.15rem' }}>
                    ${Number(selectedAppt.service?.price || selectedAppt.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedAppt.cancelReason && (
                <div className="my-appt-receipt-section" style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '10px' }}>
                  <span className="my-appt-receipt-title" style={{ color: '#dc2626' }}>Cancellation Reason</span>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: '#991b1b' }}>
                    {selectedAppt.cancelReason}
                  </p>
                </div>
              )}
            </div>

            <div className="my-appt-modal-footer">
              <button
                type="button"
                className="my-appt-btn my-appt-btn-outline"
                onClick={() => setModalMode(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Reschedule Modal */}
      {modalMode === 'reschedule' && selectedAppt && (
        <div className="my-appt-modal-overlay">
          <div className="my-appt-modal-card">
            <div className="my-appt-modal-header">
              <h2>Reschedule Appointment</h2>
              <button
                type="button"
                className="my-appt-modal-close"
                onClick={() => setModalMode(null)}
              >
                ✕
              </button>
            </div>

            <div className="my-appt-modal-body">
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563' }}>
                Pick a new date and time slot for <strong>{selectedAppt.service?.name}</strong> with <strong>{selectedAppt.barber?.name}</strong>:
              </p>

              <div className="my-appt-form-group">
                <label className="my-appt-form-label">Select New Date</label>
                <select
                  className="my-appt-select-input"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                >
                  {UPCOMING_DATES.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>

              <div className="my-appt-form-group">
                <label className="my-appt-form-label">Select New Time Slot</label>
                <select
                  className="my-appt-select-input"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                >
                  {TIME_SLOTS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="my-appt-modal-footer">
              <button
                type="button"
                className="my-appt-btn my-appt-btn-outline"
                onClick={() => setModalMode(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="my-appt-btn my-appt-btn-rebook"
                onClick={handleConfirmReschedule}
              >
                ✓ Save New Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cancel Modal */}
      {modalMode === 'cancel' && selectedAppt && (
        <div className="my-appt-modal-overlay">
          <div className="my-appt-modal-card">
            <div className="my-appt-modal-header">
              <h2>Cancel Appointment?</h2>
              <button
                type="button"
                className="my-appt-modal-close"
                onClick={() => setModalMode(null)}
              >
                ✕
              </button>
            </div>

            <div className="my-appt-modal-body">
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#4b5563' }}>
                Are you sure you want to cancel your scheduled appointment on <strong>{selectedAppt.date}</strong> at <strong>{selectedAppt.time}</strong>?
              </p>

              <div className="my-appt-form-group">
                <label className="my-appt-form-label">Reason for cancellation (Optional)</label>
                <select
                  className="my-appt-select-input"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="Schedule conflict">Schedule conflict</option>
                  <option value="Booking mistake / Wrong service">Booking mistake / Wrong service</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Change of preferred barber">Change of preferred barber</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="my-appt-modal-footer">
              <button
                type="button"
                className="my-appt-btn my-appt-btn-outline"
                onClick={() => setModalMode(null)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="my-appt-btn my-appt-btn-cancel"
                onClick={handleConfirmCancel}
              >
                ✕ Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Review Modal */}
      {modalMode === 'review' && selectedAppt && (
        <div className="my-appt-modal-overlay">
          <div className="my-appt-modal-card">
            <div className="my-appt-modal-header">
              <h2>Rate &amp; Review Barber</h2>
              <button
                type="button"
                className="my-appt-modal-close"
                onClick={() => setModalMode(null)}
              >
                ✕
              </button>
            </div>

            <div className="my-appt-modal-body">
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563' }}>
                How was your <strong>{selectedAppt.service?.name}</strong> with <strong>{selectedAppt.barber?.name}</strong>?
              </p>

              <div className="my-appt-form-group" style={{ alignItems: 'center' }}>
                <span className="my-appt-form-label">Your Rating</span>
                <div className="my-appt-stars-wrap">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`my-appt-star-btn ${star <= reviewRating ? 'active' : ''}`}
                      onClick={() => setReviewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-appt-form-group">
                <label className="my-appt-form-label">Feedback Notes</label>
                <textarea
                  className="my-appt-select-input"
                  rows={3}
                  placeholder="Great fade and clean styling..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
            </div>

            <div className="my-appt-modal-footer">
              <button
                type="button"
                className="my-appt-btn my-appt-btn-outline"
                onClick={() => setModalMode(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="my-appt-btn my-appt-btn-rebook"
                onClick={handleConfirmReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments
