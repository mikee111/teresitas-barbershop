import '../../styles/barberscrew/BarberView.css'

function ViewBarber({ barber, onClose, inline = false }) {
  if (!barber) {
    return null
  }

  const scheduleDisplay = barber.hours
    ? `${barber.schedule || 'Monday - Saturday'} (${barber.hours})`
    : barber.schedule || 'Monday - Saturday (9:00 AM - 6:00 PM)'

  const content = (
    <div className={`barber-view-shell${inline ? ' barber-panel--inline' : ''}`}>
      <div className="barber-view-titlebar">
        <h2>Barber Details</h2>
        <button
          type="button"
          className="barber-view-close"
          onClick={onClose}
          aria-label="Close barber details"
        >
          ✕
        </button>
      </div>

      <div className="barber-view-body">
        <div className="barber-view-details">
          <div className="barber-view-row">
            <span className="barber-view-label">Barber</span>
            <span className="barber-view-val">{barber.name}</span>
          </div>

          <div className="barber-view-row">
            <span className="barber-view-label">Position</span>
            <span className="barber-view-val">{barber.position}</span>
          </div>

          <div className="barber-view-row">
            <span className="barber-view-label">Phone</span>
            <span className="barber-view-val">{barber.phone || '0917 123 4567'}</span>
          </div>

          <div className="barber-view-row">
            <span className="barber-view-label">Email</span>
            <span className="barber-view-val">
              {barber.email || `${barber.name.toLowerCase().replace(/\s+/g, '')}@email.com`}
            </span>
          </div>

          <div className="barber-view-row">
            <span className="barber-view-label">Schedule</span>
            <span className="barber-view-val">{scheduleDisplay}</span>
          </div>

          <div className="barber-view-row">
            <span className="barber-view-label">Status</span>
            <span
              className={`appointment-status ${
                barber.status === 'Active' ? 'confirmed' : 'cancelled'
              }`}
            >
              {barber.status}
            </span>
          </div>
        </div>

        <div className="barber-view-actions">
          <button
            type="button"
            className="barber-btn-close"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  if (inline) {
    return content
  }

  return <div className="appointment-modal-overlay">{content}</div>
}

export default ViewBarber
