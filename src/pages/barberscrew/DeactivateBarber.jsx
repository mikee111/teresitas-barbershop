import '../../styles/barberscrew/BarberDeactivate.css'

function DeactivateBarber({ barber, onClose, onConfirm, inline = false }) {
  if (!barber) {
    return null
  }

  const content = (
    <div
      className={`barber-deactivate-shell${
        inline ? ' barber-deactivate-panel--inline' : ''
      }`}
    >
      <div className="barber-deactivate-titlebar">
        <h2>Deactivate Barber?</h2>
        <button
          type="button"
          className="barber-deactivate-close-x"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="barber-deactivate-body">
        <p className="barber-deactivate-main-text">
          Are you sure you want to deactivate <strong>{barber.name}</strong>?
        </p>

        <p className="barber-deactivate-sub-text">
          The barber will no longer be available for new appointments.
        </p>

        <div className="barber-deactivate-actions">
          <button
            type="button"
            className="barber-deactivate-btn barber-deactivate-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="barber-deactivate-btn barber-deactivate-btn-confirm"
            onClick={onConfirm}
          >
            Deactivate
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

export default DeactivateBarber
