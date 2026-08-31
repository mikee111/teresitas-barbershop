import '../../styles/appointment/AppointmentCancel.css'

function CancelAppointment({ appointment, onKeep, onConfirm, inline = false }) {
  if (!appointment) {
    return null
  }

  const content = (
    <div className={`appointment-cancel-shell${inline ? ' appointment-panel--inline' : ''}`}>
      <div className="appointment-cancel-titlebar">
        <h2>Cancel Appointment?</h2>
        <button
          type="button"
          className="appointment-cancel-close"
          onClick={onKeep}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="appointment-cancel-body">
        <div className="appointment-cancel-summary">
          <h3>{appointment.customer}</h3>
          <p>{appointment.service}</p>
          <p>
            {appointment.date} • {appointment.time}
          </p>
          <p>Barber: {appointment.barber}</p>
        </div>

        <p className="appointment-cancel-message">
          Are you sure you want to cancel this appointment?
        </p>

        <div className="appointment-cancel-actions">
          <button type="button" className="appointment-keep-btn" onClick={onKeep}>
            Keep Appointment
          </button>
          <button
            type="button"
            className="appointment-cancel-confirm-btn"
            onClick={onConfirm}
          >
            Cancel Appointment
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

export default CancelAppointment
