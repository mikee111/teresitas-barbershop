import { useEffect, useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/barberscrew/BarbersCrew.css'
import DeactivateBarber from './DeactivateBarber'
import EditBarber from './EditBarber'
import ViewBarber from './ViewBarber'

const initialBarbersData = [
  {
    id: 1,
    name: 'Juan Cruz',
    position: 'Senior Barber',
    status: 'Active',
    phone: '0917 123 4567',
    email: 'juan@email.com',
    schedule: 'Monday - Saturday',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
  {
    id: 2,
    name: 'Pedro Santos',
    position: 'Barber',
    status: 'Active',
    phone: '0918 234 5678',
    email: 'pedro@email.com',
    schedule: 'Tuesday - Sunday',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
  {
    id: 3,
    name: 'Carlos Reyes',
    position: 'Barber',
    status: 'Inactive',
    phone: '0919 345 6789',
    email: 'carlos@email.com',
    schedule: 'Monday - Friday',
    startTime: '10:00 AM',
    endTime: '7:00 PM',
    hours: '10:00 AM - 7:00 PM',
  },
  {
    id: 4,
    name: 'Luis Garcia',
    position: 'Barber',
    status: 'Active',
    phone: '0920 456 7890',
    email: 'luis@email.com',
    schedule: 'Wednesday - Monday',
    startTime: '9:00 AM',
    endTime: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
  {
    id: 5,
    name: 'Marco Rivera',
    position: 'Junior Barber',
    status: 'Active',
    phone: '0921 567 8901',
    email: 'marco@email.com',
    schedule: 'Monday - Saturday',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    hours: '8:00 AM - 5:00 PM',
  },
]

const getActionsForStatus = (status) => {
  if (status === 'Active') return ['View', 'Edit', 'Deactivate']
  if (status === 'Inactive') return ['View', 'Edit', 'Activate']
  return ['View']
}

const actionClass = (action) => {
  if (action === 'View') return 'bc-action-view'
  if (action === 'Edit') return 'bc-action-edit'
  if (action === 'Deactivate') return 'bc-action-deactivate'
  if (action === 'Activate') return 'bc-action-activate'
  return ''
}

function BarbersCrew() {
  const [barbers, setBarbers] = useState(initialBarbersData)
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [activeViewId, setActiveViewId] = useState(null)
  const [activeEditId, setActiveEditId] = useState(null)
  const [activeDeactivateId, setActiveDeactivateId] = useState(null)

  useEffect(() => {
    if (openMenuId === null) return undefined

    const handleClickOutside = (event) => {
      if (!event.target.closest('.appointment-actions-menu')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  const filteredBarbers = barbers.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleActionClick = (action, barber) => {
    setOpenMenuId(null)
    if (action === 'View') {
      setActiveEditId(null)
      setActiveDeactivateId(null)
      setActiveViewId(barber.id)
    } else if (action === 'Edit') {
      setActiveViewId(null)
      setActiveDeactivateId(null)
      setActiveEditId(barber.id)
    } else if (action === 'Deactivate') {
      setActiveViewId(null)
      setActiveEditId(null)
      setActiveDeactivateId(barber.id)
    } else if (action === 'Activate') {
      setBarbers((prev) =>
        prev.map((b) => (b.id === barber.id ? { ...b, status: 'Active' } : b))
      )
    }
  }

  const handleSaveBarber = (updatedBarber) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === updatedBarber.id ? updatedBarber : b))
    )
    setActiveEditId(null)
  }

  const handleConfirmDeactivate = (barberId) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === barberId ? { ...b, status: 'Inactive' } : b))
    )
    setActiveDeactivateId(null)
  }

  const selectedViewBarber = barbers.find((b) => b.id === activeViewId)
  const selectedEditBarber = barbers.find((b) => b.id === activeEditId)
  const selectedDeactivateBarber = barbers.find((b) => b.id === activeDeactivateId)

  const isModalOpen =
    Boolean(selectedViewBarber) ||
    Boolean(selectedEditBarber) ||
    Boolean(selectedDeactivateBarber)

  return (
    <div
      className={`appointment-table-shell${
        isModalOpen ? ' appointment-table-shell--overlay-open' : ''
      }`}
    >
      <div className="appointment-table-titlebar">
        <h2>Barbers Crew</h2>
      </div>

      <div style={{ padding: '0.8rem 1.25rem 0.2rem' }}>
        <div className="services-search-wrapper">
          <span style={{ color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search barber name or position..."
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
              <th>Barber</th>
              <th>Position</th>
              <th>Working Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBarbers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No barbers found matching your search.
                </td>
              </tr>
            ) : (
              filteredBarbers.map((barber) => (
                <tr key={barber.id}>
                  <td>
                    <div className="bc-barber-cell">
                      <span className="bc-barber-icon">&#128100;</span>
                      <span className="bc-barber-name">{barber.name}</span>
                    </div>
                  </td>
                  <td>{barber.position}</td>
                  <td>{barber.hours || `${barber.schedule || 'Mon-Sat'} (9:00 AM - 6:00 PM)`}</td>
                  <td>
                    <div className="bc-status-cell">
                      <span
                        className={`bc-status-dot ${
                          barber.status === 'Active' ? 'bc-dot-active' : 'bc-dot-inactive'
                        }`}
                      />
                      <span
                        className={`appointment-status ${
                          barber.status === 'Active' ? 'confirmed' : 'cancelled'
                        }`}
                      >
                        {barber.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="appointment-actions-menu">
                      <button
                        type="button"
                        className="appointment-actions-trigger"
                        aria-label={`Actions for ${barber.name}`}
                        aria-expanded={openMenuId === barber.id}
                        onClick={() =>
                          setOpenMenuId((curr) => (curr === barber.id ? null : barber.id))
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === barber.id && (
                        <div className="appointment-actions-dropdown" role="menu">
                          {getActionsForStatus(barber.status).map((action) => (
                            <button
                              key={action}
                              type="button"
                              role="menuitem"
                              className={`appointment-actions-dropdown-item ${actionClass(action)}`}
                              onClick={() => handleActionClick(action, barber)}
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

      {selectedViewBarber && (
        <ViewBarber
          barber={selectedViewBarber}
          onClose={() => setActiveViewId(null)}
        />
      )}

      {selectedEditBarber && (
        <EditBarber
          barber={selectedEditBarber}
          onClose={() => setActiveEditId(null)}
          onSave={handleSaveBarber}
        />
      )}

      {selectedDeactivateBarber && (
        <DeactivateBarber
          barber={selectedDeactivateBarber}
          onClose={() => setActiveDeactivateId(null)}
          onConfirm={() => handleConfirmDeactivate(selectedDeactivateBarber.id)}
        />
      )}
    </div>
  )
}

export default BarbersCrew
