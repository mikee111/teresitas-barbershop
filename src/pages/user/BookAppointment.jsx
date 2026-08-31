import { useState } from 'react'
import '../../styles/BookAppointment.css'
import {
  servicesScissorIcon,
  barbersIconsImg,
  timeIcon,
  reviewIcon
} from '../../assets/images'

const SERVICES_DATA = [
  {
    id: 1,
    name: 'Hair Cut',
    desc: 'Classic haircut with wash and style',
    price: 15.00,
    icon: '✂️'
  },
  {
    id: 2,
    name: 'Beard Trim',
    desc: 'Beard shaping and grooming',
    price: 10.00,
    icon: '🧔'
  },
  {
    id: 3,
    name: 'Hair & Beard Combo',
    desc: 'Haircut and beard trim combo',
    price: 22.00,
    icon: '✂️'
  },
  {
    id: 4,
    name: 'Scissor Cut',
    desc: 'Premium scissor haircut',
    price: 20.00,
    icon: '✂️'
  },
  {
    id: 5,
    name: 'Hair Color',
    desc: 'Hair coloring service',
    price: 30.00,
    icon: '💧'
  }
]

const BARBERS_DATA = [
  {
    id: 1,
    name: 'Mark Reyes',
    role: 'Master Barber',
    rating: '⭐ 4.9 (128 reviews)',
    specialty: 'Fades & Classic Cuts'
  },
  {
    id: 2,
    name: 'John Carlio',
    role: 'Senior Barber',
    rating: '⭐ 4.8 (95 reviews)',
    specialty: 'Beard Grooming & Styling'
  },
  {
    id: 3,
    name: 'Luis Santos',
    role: 'Fade Specialist',
    rating: '⭐ 4.9 (110 reviews)',
    specialty: 'Taper Fade & Modern Cuts'
  },
  {
    id: 4,
    name: 'Marco Cruz',
    role: 'Stylist & Colorist',
    rating: '⭐ 4.7 (84 reviews)',
    specialty: 'Hair Color & Scissor Work'
  }
]

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

// Generate 7 selectable days starting today
function getUpcomingDays() {
  const days = []
  const today = new Date(2026, 7, 24) // Aug 24, 2026 baseline
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      dateStr: `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      fullDate: d
    })
  }
  return days
}

function BookAppointment({ onBookingComplete, initialBookingData }) {
  const [currentStep, setCurrentStep] = useState(initialBookingData ? 2 : 1)
  const [selectedService, setSelectedService] = useState(initialBookingData?.service || SERVICES_DATA[0])
  const [selectedBarber, setSelectedBarber] = useState(initialBookingData?.barber || null)
  const [selectedDate, setSelectedDate] = useState(initialBookingData?.date || 'Aug 25, 2026')
  const [selectedTime, setSelectedTime] = useState(initialBookingData?.time || '')
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const daysList = getUpcomingDays()

  const totalPrice = selectedService ? selectedService.price : 0.00

  const handleNext = () => {
    if (currentStep === 1 && !selectedService) return
    if (currentStep === 2 && !selectedBarber) return
    if (currentStep === 3 && !selectedDate) return
    if (currentStep === 4 && !selectedTime) return

    if (currentStep === 5) {
      setIsSuccessOpen(true)
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getStepNextButtonText = () => {
    switch (currentStep) {
      case 1:
        return 'Next: Select Barber >'
      case 2:
        return 'Next: Select Date >'
      case 3:
        return 'Next: Select Time >'
      case 4:
        return 'Next: Review Booking >'
      case 5:
        return 'Confirm Appointment ✓'
      default:
        return 'Next >'
    }
  }

  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedService) return true
    if (currentStep === 2 && !selectedBarber) return true
    if (currentStep === 3 && !selectedDate) return true
    if (currentStep === 4 && !selectedTime) return true
    return false
  }

  return (
    <div className="book-appointment-container">
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="book-header">
        <h1 className="book-title">Book Appointment</h1>
        <p className="book-subtitle">Schedule your next visit</p>
      </div>

      {/* ── Stepper Navigation Bar ─────────────────────────── */}
      <div className="book-stepper-card">
        <ol className="book-stepper-list">
          {/* Step 1 */}
          <li
            className={`book-step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="book-step-circle">
              <img src={servicesScissorIcon} alt="Service" className="book-step-circle-img" />
            </div>
            <span className="book-step-label">1. Service</span>
          </li>

          <div className="book-step-arrow">›</div>

          {/* Step 2 */}
          <li
            className={`book-step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            onClick={() => { if (selectedService) setCurrentStep(2) }}
          >
            <div className="book-step-circle">
              <img src={barbersIconsImg} alt="Barber" className="book-step-circle-img" style={{ borderRadius: '50%' }} />
            </div>
            <span className="book-step-label">2. Barber</span>
          </li>

          <div className="book-step-arrow">›</div>

          {/* Step 3 */}
          <li
            className={`book-step-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}
            onClick={() => { if (selectedBarber) setCurrentStep(3) }}
          >
            <div className="book-step-circle">📅</div>
            <span className="book-step-label">3. Date</span>
          </li>

          <div className="book-step-arrow">›</div>

          {/* Step 4 */}
          <li
            className={`book-step-item ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`}
            onClick={() => { if (selectedDate) setCurrentStep(4) }}
          >
            <div className="book-step-circle">
              {timeIcon ? (
                <img src={timeIcon} alt="Time" className="book-step-circle-img" />
              ) : (
                '🕒'
              )}
            </div>
            <span className="book-step-label">4. Time</span>
          </li>

          <div className="book-step-arrow">›</div>

          {/* Step 5 */}
          <li
            className={`book-step-item ${currentStep === 5 ? 'active' : ''}`}
            onClick={() => { if (selectedTime) setCurrentStep(5) }}
          >
            <div className="book-step-circle">
              {reviewIcon ? (
                <img src={reviewIcon} alt="Review" className="book-step-circle-img" />
              ) : (
                '✓'
              )}
            </div>
            <span className="book-step-label">5. Review</span>
          </li>
        </ol>
      </div>

      {/* ── 2-Column Content Grid ──────────────────────────── */}
      <div className="book-layout-grid">
        {/* Left Step Panel */}
        <div className="book-main-panel">
          {/* STEP 1: SERVICE */}
          {currentStep === 1 && (
            <>
              <div className="book-panel-header">
                <h2 className="book-panel-title">Select a Service</h2>
                <p className="book-panel-subtitle">Choose the service you would like to book.</p>
              </div>

              <div className="book-options-list">
                {SERVICES_DATA.map((service) => {
                  const isSelected = selectedService?.id === service.id
                  return (
                    <div
                      key={service.id}
                      className={`book-service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="book-service-left">
                        <div className="book-radio-circle">
                          {isSelected && <div className="book-radio-dot" />}
                        </div>

                        <div className="book-service-icon-box">
                          <img
                            src={servicesScissorIcon}
                            alt={service.name}
                            className="book-service-img-icon"
                          />
                        </div>

                        <div className="book-service-meta">
                          <span className="book-service-name">{service.name}</span>
                          <span className="book-service-desc">{service.desc}</span>
                        </div>
                      </div>

                      <span className="book-service-price">${service.price.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* STEP 2: BARBER */}
          {currentStep === 2 && (
            <>
              <div className="book-panel-header">
                <h2 className="book-panel-title">Select a Barber</h2>
                <p className="book-panel-subtitle">Choose your preferred barber for your appointment.</p>
              </div>

              <div className="book-barbers-grid">
                {BARBERS_DATA.map((barber) => {
                  const isSelected = selectedBarber?.id === barber.id
                  return (
                    <div
                      key={barber.id}
                      className={`book-barber-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedBarber(barber)}
                    >
                      <div className="book-barber-avatar-box">
                        <img
                          src={barbersIconsImg}
                          alt={barber.name}
                          className="book-barber-avatar-img"
                        />
                      </div>
                      <span className="book-barber-name">{barber.name}</span>
                      <span className="book-barber-role">{barber.role}</span>
                      <span className="book-barber-rating">{barber.rating}</span>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* STEP 3: DATE */}
          {currentStep === 3 && (
            <>
              <div className="book-panel-header">
                <h2 className="book-panel-title">Select a Date</h2>
                <p className="book-panel-subtitle">Choose the date for your visit.</p>
              </div>

              <div className="book-date-wrapper">
                <div className="book-date-nav">
                  <span>August 2026</span>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Available schedule</span>
                </div>

                <div className="book-days-grid">
                  {daysList.map((day) => {
                    const isSelected = selectedDate === day.dateStr
                    return (
                      <div
                        key={day.dateStr}
                        className={`book-day-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDate(day.dateStr)}
                      >
                        <span className="book-day-name">{day.dayName}</span>
                        <span className="book-day-number">{day.dayNumber}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* STEP 4: TIME */}
          {currentStep === 4 && (
            <>
              <div className="book-panel-header">
                <h2 className="book-panel-title">Select a Time Slot</h2>
                <p className="book-panel-subtitle">Available time slots for {selectedDate}.</p>
              </div>

              <div className="book-time-wrapper">
                <span className="book-time-section-title">Available Slots</span>
                <div className="book-time-grid">
                  {TIME_SLOTS.map((time) => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        type="button"
                        className={`book-time-slot-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* STEP 5: REVIEW */}
          {currentStep === 5 && (
            <>
              <div className="book-panel-header">
                <h2 className="book-panel-title">Review Your Booking</h2>
                <p className="book-panel-subtitle">Please verify your appointment details before confirming.</p>
              </div>

              <div className="book-review-card">
                <div className="book-review-row">
                  <span className="book-review-label">Service</span>
                  <span className="book-review-val">{selectedService?.name} (${selectedService?.price.toFixed(2)})</span>
                </div>
                <div className="book-review-row">
                  <span className="book-review-label">Barber</span>
                  <span className="book-review-val">{selectedBarber?.name} ({selectedBarber?.role})</span>
                </div>
                <div className="book-review-row">
                  <span className="book-review-label">Date &amp; Time</span>
                  <span className="book-review-val">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="book-review-row">
                  <span className="book-review-label">Payment Method</span>
                  <span className="book-review-val">Pay in Barbershop (Cash / Card)</span>
                </div>
                <div className="book-review-row">
                  <span className="book-review-label">Total Amount</span>
                  <span className="book-review-val" style={{ color: '#7c3aed', fontSize: '1.15rem' }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons Footer */}
          <div className="book-actions-footer">
            {currentStep > 1 && (
              <button
                type="button"
                className="book-btn-back"
                onClick={handleBack}
              >
                ‹ Back
              </button>
            )}

            <button
              type="button"
              className="book-btn-next"
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              {getStepNextButtonText()}
            </button>
          </div>
        </div>

        {/* Right Summary Card (Sticky) */}
        <aside className="book-summary-card">
          <h3 className="book-summary-title">Appointment Summary</h3>

          <div className="book-summary-rows">
            {/* Service */}
            <div className="book-summary-item">
              <div className="book-summary-item-left">
                {servicesScissorIcon ? (
                  <img src={servicesScissorIcon} alt="Service" className="book-summary-item-img" />
                ) : (
                  <span className="book-summary-item-icon">✂️</span>
                )}
                <span>Service</span>
              </div>
              <span className={`book-summary-item-val ${selectedService ? 'filled' : ''}`}>
                {selectedService ? selectedService.name : 'Not selected'}
              </span>
            </div>

            {/* Barber */}
            <div className="book-summary-item">
              <div className="book-summary-item-left">
                {barbersIconsImg ? (
                  <img src={barbersIconsImg} alt="Barber" className="book-summary-item-img" style={{ borderRadius: '50%' }} />
                ) : (
                  <span className="book-summary-item-icon">👤</span>
                )}
                <span>Barber</span>
              </div>
              <span className={`book-summary-item-val ${selectedBarber ? 'filled' : ''}`}>
                {selectedBarber ? selectedBarber.name : 'Not selected'}
              </span>
            </div>

            {/* Date */}
            <div className="book-summary-item">
              <div className="book-summary-item-left">
                <span className="book-summary-item-icon">📅</span>
                <span>Date</span>
              </div>
              <span className={`book-summary-item-val ${selectedDate ? 'filled' : ''}`}>
                {selectedDate || 'Not selected'}
              </span>
            </div>

            {/* Time */}
            <div className="book-summary-item">
              <div className="book-summary-item-left">
                {timeIcon ? (
                  <img src={timeIcon} alt="Time" className="book-summary-item-img" />
                ) : (
                  <span className="book-summary-item-icon">🕒</span>
                )}
                <span>Time</span>
              </div>
              <span className={`book-summary-item-val ${selectedTime ? 'filled' : ''}`}>
                {selectedTime || 'Not selected'}
              </span>
            </div>
          </div>

          <div className="book-summary-divider" />

          {/* Total */}
          <div className="book-summary-total-row">
            <span className="book-summary-total-label">Total</span>
            <span className="book-summary-total-price">${totalPrice.toFixed(2)}</span>
          </div>

          {/* Note Box */}
          <div className="book-summary-note-box">
            <div className="book-summary-note-header">
              <span>ⓘ</span>
              <span>Note</span>
            </div>
            <p className="book-summary-note-desc">
              You can review all details before confirming your appointment.
            </p>
          </div>
        </aside>
      </div>

      {/* ── Success Confirmation Modal ────────────────────── */}
      {isSuccessOpen && (
        <div className="appointment-modal-overlay">
          <div className="admin-modal-shell" style={{ maxWidth: '440px' }}>
            <div className="admin-modal-titlebar">
              <h2>Appointment Submitted!</h2>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => {
                  setIsSuccessOpen(false)
                  if (onBookingComplete) {
                    onBookingComplete({
                      id: Date.now(),
                      refCode: `#TB-${Math.floor(10000 + Math.random() * 90000)}`,
                      customer: 'Juan Dela Cruz',
                      service: selectedService,
                      barber: selectedBarber,
                      date: selectedDate,
                      time: selectedTime,
                      price: selectedService?.price || 0,
                      status: 'pending',
                      duration: '45 mins',
                      paymentMode: 'Pay at Shop (Cash / Card)',
                      requestedTime: selectedTime,
                      confirmedTime: '',
                    })
                  }
                }}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body book-success-modal">
              <div className="book-success-icon">✓</div>
              <h3>Request Sent!</h3>
              <p>
                Your appointment request for <strong>{selectedService?.name}</strong> with <strong>{selectedBarber?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> is now <strong>pending admin approval</strong>. You'll see it in your appointments with a 🟡 Pending status.
              </p>

              <button
                type="button"
                className="admin-btn-submit"
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', fontSize: '0.95rem' }}
                onClick={() => {
                  setIsSuccessOpen(false)
                  if (onBookingComplete) {
                    onBookingComplete({
                      id: Date.now(),
                      refCode: `#TB-${Math.floor(10000 + Math.random() * 90000)}`,
                      customer: 'Juan Dela Cruz',
                      service: selectedService,
                      barber: selectedBarber,
                      date: selectedDate,
                      time: selectedTime,
                      price: selectedService?.price || 0,
                      status: 'pending',
                      duration: '45 mins',
                      paymentMode: 'Pay at Shop (Cash / Card)',
                      requestedTime: selectedTime,
                      confirmedTime: '',
                    })
                  }
                }}
              >
                📋 View My Appointments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookAppointment
