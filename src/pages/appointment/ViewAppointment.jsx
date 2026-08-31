import '../../styles/appointment/AppointmentView.css'

function ViewAppointment({ appointment, onClose, inline = false }) {
  if (!appointment) {
    return null
  }

  const content = (
    <div className={`appointment-view-shell${inline ? ' appointment-panel--inline' : ''}`}>
      <div className="appointment-view-titlebar">
        <h2>Appointment Details</h2>
        <button
          type="button"
          className="appointment-view-close"
          onClick={onClose}
          aria-label="Close appointment details"
        >
          ✕
        </button>
      </div>

      <div className="appointment-view-body">
        <div className="appointment-view-details">
          <div className="appointment-view-row">
            <span className="appointment-view-label">Customer</span>
            <span className="appointment-view-val">{appointment.customer}</span>
          </div>

          <div className="appointment-view-row">
            <span className="appointment-view-label">Service</span>
            <span className="appointment-view-val">{appointment.service}</span>
          </div>

          <div className="appointment-view-row">
            <span className="appointment-view-label">Date</span>
            <span className="appointment-view-val">{appointment.date}</span>
          </div>

          <div className="appointment-view-row">
            <span className="appointment-view-label">Time</span>
            <span className="appointment-view-val">{appointment.time}</span>
          </div>

          <div className="appointment-view-row">
            <span className="appointment-view-label">Assigned Barber</span>
            <span className="appointment-view-val">{appointment.barber}</span>
          </div>

          <div className="appointment-view-row">
            <span className="appointment-view-label">Status</span>
            <span
              className={`appointment-status ${
                appointment.status === 'Confirmed' || appointment.status === 'Completed'
                  ? 'confirmed'
                  : appointment.status === 'Cancelled'
                  ? 'cancelled'
                  : 'pending'
              }`}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="appointment-view-actions">
          <button
            type="button"
            className="appointment-btn-cancel"
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

export default ViewAppointment
