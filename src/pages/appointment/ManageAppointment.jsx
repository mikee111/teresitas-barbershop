import '../../styles/appointment/AppointmentManage.css'

function ManageAppointment({
  appointment,
  manageForm,
  timeOptions,
  barberOptions,
  statusOptions,
  onClose,
  onChange,
  onConfirm,
  inline = false,
}) {
  if (!appointment) {
    return null
  }

  const content = (
    <div className={`appointment-manage-shell${inline ? ' appointment-panel--inline' : ''}`}>
      <div className="appointment-manage-titlebar">
        <h2>Manage Appointment</h2>
        <button
          type="button"
          className="appointment-manage-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="appointment-manage-body">
        <div className="appointment-manage-grid">
          <div className="appointment-manage-field">
            <label>Customer</label>
            <div className="appointment-manage-value">{appointment.customer}</div>
          </div>

          <div className="appointment-manage-field">
            <label>Service</label>
            <div className="appointment-manage-value">{appointment.service}</div>
          </div>

          <div className="appointment-manage-field">
            <label htmlFor="requestedTime">Requested Time</label>
            <select
              id="requestedTime"
              name="requestedTime"
              value={manageForm.requestedTime}
              onChange={onChange}
              className="appointment-manage-select"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="appointment-manage-field">
            <label htmlFor="confirmedTime">Confirmed Time</label>
            <select
              id="confirmedTime"
              name="confirmedTime"
              value={manageForm.confirmedTime}
              onChange={onChange}
              className="appointment-manage-select"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="appointment-manage-field">
            <label htmlFor="barber">Assigned Barber</label>
            <select
              id="barber"
              name="barber"
              value={manageForm.barber}
              onChange={onChange}
              className="appointment-manage-select"
            >
              {barberOptions.map((barber) => (
                <option key={barber} value={barber}>
                  {barber}
                </option>
              ))}
            </select>
          </div>

          <div className="appointment-manage-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={manageForm.status}
              onChange={onChange}
              className="appointment-manage-select"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="appointment-manage-actions">
          <button type="button" className="appointment-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="appointment-confirm-btn" onClick={onConfirm}>
            Save Changes
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

export default ManageAppointment
