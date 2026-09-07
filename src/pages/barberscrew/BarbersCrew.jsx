import { useEffect, useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/barberscrew/BarbersCrew.css'
import AddBarber from './AddBarber'
import DeactivateBarber from './DeactivateBarber'
import EditBarber from './EditBarber'
import ViewBarber from './ViewBarber'
import {
  fetchBarbers,
  createBarber,
  updateBarber,
  updateBarberStatus,
} from '../../services/barberService'

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
  const [barbers, setBarbers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeViewId, setActiveViewId] = useState(null)
  const [activeEditId, setActiveEditId] = useState(null)
  const [activeDeactivateId, setActiveDeactivateId] = useState(null)

  useEffect(() => {
    let isMounted = true
    const loadBarbersData = async () => {
      setIsLoading(true)
      const data = await fetchBarbers()
      if (isMounted) {
        setBarbers(data)
        setIsLoading(false)
      }
    }
    loadBarbersData()
    return () => {
      isMounted = false
    }
  }, [])

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
    (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.specialty || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleActionClick = async (action, barber) => {
    setOpenMenuId(null)
    if (action === 'View') {
      setActiveEditId(null)
      setActiveDeactivateId(null)
      setShowAddModal(false)
      setActiveViewId(barber.id)
    } else if (action === 'Edit') {
      setActiveViewId(null)
      setActiveDeactivateId(null)
      setShowAddModal(false)
      setActiveEditId(barber.id)
    } else if (action === 'Deactivate') {
      setActiveViewId(null)
      setActiveEditId(null)
      setShowAddModal(false)
      setActiveDeactivateId(barber.id)
    } else if (action === 'Activate') {
      await updateBarberStatus(barber.id, 'Active')
      setBarbers((prev) =>
        prev.map((b) => (b.id === barber.id ? { ...b, status: 'Active' } : b))
      )
    }
  }

  const handleAddBarber = async (newBarberData) => {
    const created = await createBarber(newBarberData)
    setBarbers((prev) => [...prev, created])
    setShowAddModal(false)
  }

  const handleSaveBarber = async (updatedBarber) => {
    const updated = await updateBarber(updatedBarber.id, updatedBarber)
    setBarbers((prev) =>
      prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
    )
    setActiveEditId(null)
  }

  const handleConfirmDeactivate = async (barberId) => {
    await updateBarberStatus(barberId, 'Inactive')
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
    Boolean(selectedDeactivateBarber) ||
    showAddModal

  return (
    <div
      className={`appointment-table-shell${
        isModalOpen ? ' appointment-table-shell--overlay-open' : ''
      }`}
    >
      <div className="appointment-table-titlebar">
        <h2>Barbers Crew</h2>
        <button
          type="button"
          className="barbers-btn-add"
          onClick={() => setShowAddModal(true)}
        >
          <span>＋</span> Add Barber
        </button>
      </div>

      <div style={{ padding: '0.8rem 1.25rem 0.2rem' }}>
        <div className="services-search-wrapper">
          <span style={{ color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search barber name, position, or specialty..."
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
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Loading barbers crew...
                </td>
              </tr>
            ) : filteredBarbers.length === 0 ? (
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
                  <td>
                    <div>
                      <div>{barber.position}</div>
                      {barber.specialty && (
                        <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '2px' }}>
                          {barber.specialty}
                        </div>
                      )}
                    </div>
                  </td>
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

      {showAddModal && (
        <AddBarber
          onClose={() => setShowAddModal(false)}
          onSave={handleAddBarber}
        />
      )}

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
