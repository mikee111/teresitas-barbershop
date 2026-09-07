import { useState, useEffect } from 'react'
import '../../styles/BookAppointment.css'
import {
  servicesScissorIcon,
  barbersIconsImg,
  timeIcon,
  reviewIcon
} from '../../assets/images'
import {
  fetchServices,
  subscribeToServices,
  parsePriceNumber,
} from '../../services/servicesService'

const FALLBACK_SERVICES = [
  {
    id: 1,
    name: 'Taper Fade',
    desc: 'Clean fade with seamless blend on sides and back, scissor styled top.',
    description: 'Clean fade with seamless blend on sides and back, scissor styled top.',
    price: '₱250',
    priceValue: 250,
    status: 'Active',
    icon: '✂️'
  },
  {
    id: 2,
    name: 'Buzz Cut',
    desc: 'Even length all over with clean edge lineup.',
    description: 'Even length all over with clean edge lineup.',
    price: '₱180',
    priceValue: 180,
    status: 'Active',
    icon: '✂️'
  },
  {
    id: 3,
    name: 'Crew Cut',
    desc: 'Classic tapered short cut, styled neatly at the top.',
    description: 'Classic tapered short cut, styled neatly at the top.',
    price: '₱200',
    priceValue: 200,
    status: 'Active',
    icon: '✂️'
  },
  {
    id: 4,
    name: 'French Crop',
    desc: 'Modern textured crop with blunt fringe and tapered fade sides.',
    description: 'Modern textured crop with blunt fringe and tapered fade sides.',
    price: '₱250',
    priceValue: 250,
    status: 'Active',
    icon: '✂️'
  },
  {
    id: 5,
    name: 'Undercut',
    desc: 'Short sides and back with distinct long top contrast.',
    description: 'Short sides and back with distinct long top contrast.',
    price: '₱250',
    priceValue: 250,
    status: 'Active',
    icon: '✂️'
  },
  {
    id: 6,
    name: 'Beard Trim & Shave',
    desc: 'Precision beard shaping and hot towel razor line detailing.',
    description: 'Precision beard shaping and hot towel razor line detailing.',
    price: '₱150',
    priceValue: 150,
    status: 'Active',
    icon: '🧔'
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
  const [servicesList, setServicesList] = useState(FALLBACK_SERVICES)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [selectedService, setSelectedService] = useState(initialBookingData?.service || FALLBACK_SERVICES[0])
  const [selectedBarber, setSelectedBarber] = useState(initialBookingData?.barber || null)
  const [selectedDate, setSelectedDate] = useState(initialBookingData?.date || 'Aug 25, 2026')
  const [selectedTime, setSelectedTime] = useState(initialBookingData?.time || '')
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  // Fetch real-time services from Supabase / servicesService
  useEffect(() => {
    let isMounted = true

    const loadLiveServices = async () => {
      try {
        const data = await fetchServices()
        if (isMounted && data && data.length > 0) {
          const activeOnly = data.filter((s) => s.status === 'Active')
          setServicesList(activeOnly)
          
          // If initial service was passed or already selected, match with live service if possible
          setSelectedService((prev) => {
            if (!prev) return activeOnly[0] || null
            const match = activeOnly.find((s) => s.id === prev.id || s.name === prev.name)
            return match || prev || activeOnly[0] || null
          })
        }
      } catch (err) {
        console.error('Error loading services in BookAppointment:', err)
      } finally {
        if (isMounted) setIsLoadingServices(false)
      }
    }

    loadLiveServices()

    // Real-time updates subscription
    const unsubscribe = subscribeToServices((updatedList) => {
      if (isMounted && updatedList) {
        const activeOnly = updatedList.filter((s) => s.status === 'Active')
        setServicesList(activeOnly)

        // Maintain selection or update price if selected service was modified
        setSelectedService((prev) => {
          if (!prev) return activeOnly[0] || null
          const match = activeOnly.find((s) => s.id === prev.id || s.name === prev.name)
          return match || activeOnly[0] || null
        })
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const daysList = getUpcomingDays()

  // Calculate numeric total price
  const totalPrice = selectedService
    ? (typeof selectedService.priceValue === 'number'
        ? selectedService.priceValue
        : parsePriceNumber(selectedService.price))
    : 0

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

  return (
    <div className="book-appointment-wrapper">
      {/* ── Progress Wizard Steps Header ─────────────────── */}
      <div className="book-stepper-container">
        <ol className="book-stepper-list">
          {/* Step 1: Service */}
          <li
            className={`book-step-item ${currentStep === 1 ? 'active' : ''} ${
              currentStep > 1 ? 'completed' : ''
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="book-step-circle">
              {servicesScissorIcon ? (
                <img src={servicesScissorIcon} alt="Service" className="book-step-circle-img" />
              ) : (
                '1'
              )}
            </div>
            <span className="book-step-label">1. Service</span>
          </li>

          <div className={`book-step-line ${currentStep > 1 ? 'completed' : ''}`} />

          {/* Step 2: Barber */}
          <li
            className={`book-step-item ${currentStep === 2 ? 'active' : ''} ${
              currentStep > 2 ? 'completed' : ''
            }`}
            onClick={() => selectedService && setCurrentStep(2)}
          >
            <div className="book-step-circle">
              {barbersIconsImg ? (
                <img src={barbersIconsImg} alt="Barber" className="book-step-circle-img" />
              ) : (
                '2'
              )}
            </div>
            <span className="book-step-label">2. Barber</span>
          </li>

          <div className={`book-step-line ${currentStep > 2 ? 'completed' : ''}`} />

          {/* Step 3: Date */}
          <li
            className={`book-step-item ${currentStep === 3 ? 'active' : ''} ${
              currentStep > 3 ? 'completed' : ''
            }`}
            onClick={() => selectedBarber && setCurrentStep(3)}
          >
            <div className="book-step-circle">📅</div>
            <span className="book-step-label">3. Date</span>
          </li>

          <div className={`book-step-line ${currentStep > 3 ? 'completed' : ''}`} />

          {/* Step 4: Time */}
          <li
            className={`book-step-item ${currentStep === 4 ? 'active' : ''} ${
              currentStep > 4 ? 'completed' : ''
            }`}
            onClick={() => selectedDate && setCurrentStep(4)}
          >
            <div className="book-step-circle">
              {timeIcon ? (
                <img src={timeIcon} alt="Time" className="book-step-circle-img" />
              ) : (
                '4'
              )}
            </div>
            <span className="book-step-label">4. Time</span>
          </li>

          <div className={`book-step-line ${currentStep > 4 ? 'completed' : ''}`} />

          {/* Step 5: Review */}
          <li
            className={`book-step-item ${currentStep === 5 ? 'active' : ''}`}
            onClick={() => selectedTime && setCurrentStep(5)}
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
                {isLoadingServices && servicesList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading real-time services...
                  </div>
                ) : servicesList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No active services currently available.
                  </div>
                ) : (
                  servicesList.map((service) => {
                    const isSelected = selectedService?.id === service.id || selectedService?.name === service.name
                    const displayPrice = service.price || `₱${service.priceValue || service.price_value}`

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
                              src={service.image || servicesScissorIcon}
                              alt={service.name}
                              className="book-service-img-icon"
                              onError={(e) => {
                                e.currentTarget.src = servicesScissorIcon
                              }}
                            />
                          </div>

                          <div className="book-service-meta">
                            <span className="book-service-name">{service.name}</span>
                            <span className="book-service-desc">
                              {service.description || service.desc || `${service.category} • ${service.duration}`}
                            </span>
                          </div>
                        </div>

                        <span className="book-service-price">{displayPrice}</span>
                      </div>
                    )
                  })
                )}
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
                      <div
                        key={time}
                        className={`book-time-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </div>
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
                <p className="book-panel-subtitle">
                  Please check your appointment details before confirming.
                </p>
              </div>

              <div className="book-review-list">
                <div className="book-review-card">
                  <span className="book-review-label">Service</span>
                  <span className="book-review-val">{selectedService?.name}</span>
                  <span className="book-review-sub">
                    {selectedService?.duration || '30 mins'} • {selectedService?.price || `₱${selectedService?.priceValue}`}
                  </span>
                </div>

                <div className="book-review-card">
                  <span className="book-review-label">Barber</span>
                  <span className="book-review-val">{selectedBarber?.name}</span>
                  <span className="book-review-sub">{selectedBarber?.role}</span>
                </div>

                <div className="book-review-card">
                  <span className="book-review-label">Date & Time</span>
                  <span className="book-review-val">
                    {selectedDate} at {selectedTime}
                  </span>
                  <span className="book-review-sub">Please arrive 10 minutes prior</span>
                </div>

                <div className="book-review-card">
                  <span className="book-review-label">Total Amount</span>
                  <span className="book-review-val" style={{ color: '#047857', fontWeight: 700 }}>
                    ₱{totalPrice.toLocaleString()}
                  </span>
                  <span className="book-review-sub">Pay at shop (Cash or E-Wallet)</span>
                </div>
              </div>
            </>
          )}

          {/* Bottom Step Navigation Buttons */}
          <div className="book-actions-bar">
            {currentStep > 1 && (
              <button type="button" className="book-btn-back" onClick={handleBack}>
                &lt; Back
              </button>
            )}

            <button
              type="button"
              className="book-btn-next"
              style={{ marginLeft: currentStep === 1 ? 'auto' : undefined }}
              onClick={handleNext}
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
            <span className="book-summary-total-price">₱{totalPrice.toLocaleString()}</span>
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
                      price: totalPrice,
                      status: 'pending',
                      duration: selectedService?.duration || '45 mins',
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
                      price: totalPrice,
                      status: 'pending',
                      duration: selectedService?.duration || '45 mins',
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
