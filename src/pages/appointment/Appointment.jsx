import { useEffect, useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/appointment/Appointment.css'
import CancelAppointment from './CancelAppointment'
import ManageAppointment from './ManageAppointment'
import ViewAppointment from './ViewAppointment'

function Appointment({ appointments = [], onUpdateAppointment }) {

  const timeOptions = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:30 AM',
    '1:15 PM',
    '2:00 PM',
    '3:00 PM',
  ]
  const defaultBarberOptions = [
    'Mark Reyes',
    'John Carlio',
    'Luis Santos',
    'Marco Cruz',
    'Juan Cruz',
    'Pedro Santos',
    'Carlos Reyes',
    'Luis Garcia',
    'Marco Rivera',
  ]

  const statusOptions = ['Pending', 'Confirmed', 'Completed']

  // Convert shared appointments (lowercase status) to admin display format
  const adminAppointments = appointments.map((appt) => ({
    ...appt,
    rawBarber: appt.barber,
    customer: appt.customer || (appt.barber?.name ? `Client` : 'Unknown'),
    service: appt.service?.name || (typeof appt.service === 'string' ? appt.service : 'Unknown Service'),
    barber: appt.barber?.name || (typeof appt.barber === 'string' ? appt.barber : 'Unassigned'),
    status:
      appt.status === 'confirmed' ? 'Confirmed'
      : appt.status === 'pending' ? 'Pending'
      : appt.status === 'completed' ? 'Completed'
      : appt.status === 'cancelled' ? 'Cancelled'
      : appt.status,
    requestedTime: appt.requestedTime || appt.time,
    confirmedTime: appt.confirmedTime || appt.time,
  }))

  const barberOptions = Array.from(
    new Set([
      ...defaultBarberOptions,
      ...adminAppointments.map((a) => a.barber).filter(Boolean),
    ])
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [activeViewId, setActiveViewId] = useState(null)
  const [activeManageId, setActiveManageId] = useState(null)
  const [activeCancelId, setActiveCancelId] = useState(null)
  const [manageForm, setManageForm] = useState({
    requestedTime: '10:00 AM',
    confirmedTime: '10:00 AM',
    barber: 'Pedro',
    status: 'Pending',
  })
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    if (openMenuId === null) {
      return undefined
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.appointment-actions-menu')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  const filteredAppointments = adminAppointments.filter((a) =>
    a.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.barber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getActionsForStatus = (status) => {
    if (status === 'Completed' || status === 'Cancelled') {
      return ['View']
    }
    if (status === 'Confirmed') {
      return ['View', 'Manage', 'Cancel']
    }
    // Pending
    return ['View', 'Manage']
  }

  const getActionHandler = (action, appointment) => {
    if (action === 'View') {
      return () => handleViewClick(appointment)
    }
    if (action === 'Manage') {
      return () => handleManageClick(appointment)
    }
    if (action === 'Cancel') {
      return () => handleCancelClick(appointment)
    }
    return undefined
  }

  const selectedViewAppointment = adminAppointments.find(
    (appointment) => appointment.id === activeViewId,
  )
  const selectedManageAppointment = adminAppointments.find(
    (appointment) => appointment.id === activeManageId,
  )
  const selectedCancelAppointment = adminAppointments.find(
    (appointment) => appointment.id === activeCancelId,
  )

  const handleViewClick = (appointment) => {
    setActiveManageId(null)
    setActiveCancelId(null)
    // Find original appointment id to view
    setActiveViewId(appointment.id)
  }

  const handleManageClick = (appointment) => {
    setActiveViewId(null)
    setActiveCancelId(null)
    setActiveManageId(appointment.id)
    setManageForm({
      requestedTime: appointment.requestedTime || appointment.time,
      confirmedTime: appointment.confirmedTime || appointment.time,
      barber: appointment.barber,
      status: appointment.status,
    })
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setManageForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleConfirmAppointment = () => {
    if (!selectedManageAppointment) {
      return
    }

    // Convert admin PascalCase status back to user lowercase format
    const newStatusLower =
      manageForm.status === 'Confirmed' ? 'confirmed'
      : manageForm.status === 'Pending' ? 'pending'
      : manageForm.status === 'Completed' ? 'completed'
      : manageForm.status === 'Cancelled' ? 'cancelled'
      : manageForm.status

    if (onUpdateAppointment) {
      onUpdateAppointment(selectedManageAppointment.id, {
        requestedTime: manageForm.requestedTime,
        confirmedTime: manageForm.confirmedTime,
        barber:
          typeof selectedManageAppointment.rawBarber === 'object' && selectedManageAppointment.rawBarber !== null
            ? { ...selectedManageAppointment.rawBarber, name: manageForm.barber }
            : manageForm.barber,
        time: manageForm.confirmedTime,
        status: newStatusLower,
      })
    }
    setActiveManageId(null)
  }

  const handleCloseView = () => {
    setActiveViewId(null)
  }

  const handleCloseManage = () => {
    setActiveManageId(null)
  }

  const handleCancelClick = (appointment) => {
    setActiveViewId(null)
    setActiveManageId(null)
    setActiveCancelId(appointment.id)
  }

  const handleKeepAppointment = () => {
    setActiveCancelId(null)
  }

  const handleConfirmCancelAppointment = () => {
    if (!selectedCancelAppointment) {
      return
    }

    if (onUpdateAppointment) {
      onUpdateAppointment(selectedCancelAppointment.id, { status: 'cancelled' })
    }
    setActiveCancelId(null)
  }

  const isModalOpen =
    Boolean(selectedViewAppointment) ||
    Boolean(selectedManageAppointment) ||
    Boolean(selectedCancelAppointment)

  return (
    <div
      className={`appointment-table-shell${
        isModalOpen ? ' appointment-table-shell--overlay-open' : ''
      }`}
    >
      <div className="appointment-table-titlebar">
        <h2>Appointment Schedule</h2>
      </div>

      <div style={{ padding: '0.8rem 1.25rem 0.2rem' }}>
        <div className="services-search-wrapper">
          <span style={{ color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search customer, service, or barber..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="services-search-input"
          />
        </div>
      </div>

      <div className="appointment-table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Barber</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No appointments found matching your search.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div className="bc-barber-cell">
                      <span className="bc-barber-icon">👤</span>
                      <span className="bc-barber-name">{appointment.customer}</span>
                    </div>
                  </td>
                  <td>{appointment.service}</td>
                  <td>{appointment.barber}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <div className="bc-status-cell">
                      <span
                        className={`bc-status-dot ${
                          appointment.status === 'Confirmed' || appointment.status === 'Completed'
                            ? 'bc-dot-active'
                            : appointment.status === 'Cancelled'
                            ? 'bc-dot-inactive'
                            : 'bc-dot-pending'
                        }`}
                      />
                      <span className={`appointment-status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="appointment-actions-menu">
                      <button
                        type="button"
                        className="appointment-actions-trigger"
                        aria-label={`Actions for ${appointment.customer}`}
                        aria-expanded={openMenuId === appointment.id}
                        onClick={() =>
                          setOpenMenuId((currentId) =>
                            currentId === appointment.id ? null : appointment.id,
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === appointment.id && (
                        <div className="appointment-actions-dropdown" role="menu">
                          {getActionsForStatus(appointment.status).map((action) => (
                            <button
                              key={action}
                              type="button"
                              role="menuitem"
                              className={`appointment-actions-dropdown-item ${
                                action === 'View'
                                  ? 'bc-action-view'
                                  : action === 'Manage'
                                  ? 'bc-action-edit'
                                  : 'bc-action-deactivate'
                              }`}
                              onClick={() => {
                                setOpenMenuId(null)
                                getActionHandler(action, appointment)?.()
                              }}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedViewAppointment && (
        <ViewAppointment
          appointment={selectedViewAppointment}
          onClose={handleCloseView}
        />
      )}

      {selectedManageAppointment && (
        <ManageAppointment
          appointment={selectedManageAppointment}
          manageForm={manageForm}
          timeOptions={timeOptions}
          barberOptions={barberOptions}
          statusOptions={statusOptions}
          onClose={handleCloseManage}
          onChange={handleFormChange}
          onConfirm={handleConfirmAppointment}
        />
      )}

      {selectedCancelAppointment && (
        <CancelAppointment
          appointment={selectedCancelAppointment}
          onKeep={handleKeepAppointment}
          onConfirm={handleConfirmCancelAppointment}
        />
      )}
    </div>
  )
}

export default Appointment
