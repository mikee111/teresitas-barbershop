import { useEffect, useState, useMemo } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/Client/Client.css'
import ClientHistory from './ClientHistory'
import ClientEdit from './ClientEdit'
import ClientAdd from './ClientAdd'
import { fetchRegisteredClients, subscribeToUsers } from '../../services/authService'

const initialClientsData = [
  {
    id: 'mock-1',
    name: 'Juan Dela Cruz',
    contact: '0912-345-6789',
    totalVisits: 8,
    lastVisit: 'Aug 15, 2026',
    totalSpent: '₱1,200',
    status: 'Active',
    history: [
      { id: 'h-101', date: 'Aug 15, 2026', service: 'Haircut', barber: 'Mark Reyes', price: '₱150' },
      { id: 'h-102', date: 'Aug 05, 2026', service: 'Beard Trim', barber: 'John Carlio', price: '₱100' },
      { id: 'h-103', date: 'Jul 28, 2026', service: 'Haircut + Beard', barber: 'Mark Reyes', price: '₱250' },
    ],
  },
  {
    id: 'mock-2',
    name: 'Pedro Santos',
    contact: '0998-765-4321',
    totalVisits: 3,
    lastVisit: 'Aug 10, 2026',
    totalSpent: '₱500',
    status: 'Active',
    history: [
      { id: 'h-201', date: 'Aug 10, 2026', service: 'Haircut', barber: 'Luis Santos', price: '₱180' },
      { id: 'h-202', date: 'Jul 15, 2026', service: 'Beard Trim', barber: 'Pedro Santos', price: '₱120' },
      { id: 'h-203', date: 'Jun 20, 2026', service: 'Haircut', barber: 'Luis Santos', price: '₱200' },
    ],
  },
  {
    id: 'mock-3',
    name: 'Mark Reyes',
    contact: '0917-222-3333',
    totalVisits: 5,
    lastVisit: 'Aug 12, 2026',
    totalSpent: '₱850',
    status: 'Active',
    history: [
      { id: 'h-301', date: 'Aug 12, 2026', service: 'Buzz Cut', barber: 'Marco Cruz', price: '₱180' },
      { id: 'h-302', date: 'Jul 22, 2026', service: 'Taper Fade', barber: 'Marco Cruz', price: '₱250' },
      { id: 'h-303', date: 'Jul 02, 2026', service: 'Crew Cut', barber: 'Antonio', price: '₱200' },
    ],
  },
]

function Client({ appointments = [] }) {
  const [dbUsers, setDbUsers] = useState([])
  const [customClients, setCustomClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [activeHistoryClient, setActiveHistoryClient] = useState(null)
  const [editClient, setEditClient] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch registered users from Supabase and subscribe to real-time additions
  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        const data = await fetchRegisteredClients()
        if (isMounted && data) {
          setDbUsers(data)
        }
      } catch (err) {
        console.error('Failed to fetch users for clients list:', err)
      }
    }

    loadUsers()

    // Real-time subscription to newly registered clients
    const unsubscribe = subscribeToUsers((updatedUsers) => {
      if (isMounted && updatedUsers) {
        setDbUsers(updatedUsers)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
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

  // Merge registered users, appointments, and custom clients into a dynamic clients array
  const computedClients = useMemo(() => {
    // Collect all base client identities
    const clientMap = new Map()

    // 1. Add base initial clients
    initialClientsData.forEach((c) => {
      clientMap.set(c.name.toLowerCase(), { ...c })
    })

    // 2. Add registered users from Supabase
    dbUsers.forEach((u) => {
      const first = u.first_name || u.firstName || ''
      const last = u.last_name || u.lastName || ''
      const fullName = `${first} ${last}`.trim() || u.name || u.username || 'User'
      const key = fullName.toLowerCase()
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          id: u.id,
          name: fullName,
          contact: u.contact || u.email || '—',
          totalVisits: 0,
          lastVisit: '—',
          totalSpent: '₱0',
          status: 'Active',
          history: []
        })
      } else {
        const existing = clientMap.get(key)
        if (u.contact) existing.contact = u.contact
      }
    })

    // 3. Add clients from appointments who might not have registered yet
    appointments.forEach((appt) => {
      const customerName = (appt.customer || '').trim()
      if (!customerName) return
      const key = customerName.toLowerCase()
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          id: `appt-client-${customerName}`,
          name: customerName,
          contact: '—',
          totalVisits: 0,
          lastVisit: '—',
          totalSpent: '₱0',
          status: 'Active',
          history: []
        })
      }
    })

    // 4. Add custom added clients
    customClients.forEach((c) => {
      clientMap.set(c.name.toLowerCase(), { ...c })
    })

    // 5. For each client, link their completed appointments from the database
    const result = Array.from(clientMap.values()).map((client) => {
      const clientNameLower = client.name.toLowerCase()

      // Find all completed appointments matching this client
      const completedBookings = appointments.filter((appt) => {
        const apptCustomer = (appt.customer || '').toLowerCase()
        const isMatch = apptCustomer === clientNameLower || apptCustomer.includes(clientNameLower) || clientNameLower.includes(apptCustomer)
        const isCompleted = (appt.status || '').toLowerCase() === 'completed'
        return isMatch && isCompleted
      })

      // Map completed bookings into history records
      const dbHistory = completedBookings.map((b) => ({
        id: b.id || b.refCode,
        date: b.date || 'Recent',
        time: b.time || '',
        service: b.service?.name || (typeof b.service === 'string' ? b.service : 'Haircut'),
        barber: b.barber?.name || (typeof b.barber === 'string' ? b.barber : 'Barber'),
        price: typeof b.price === 'number' ? `₱${b.price.toLocaleString()}` : b.price || '₱0'
      }))

      // Combine base mock history and real DB history (avoiding duplicate ids)
      const baseHistory = client.history || []
      const existingIds = new Set(baseHistory.map((h) => String(h.id)))
      const newHistory = dbHistory.filter((h) => !existingIds.has(String(h.id)))
      const allHistory = [...newHistory, ...baseHistory]

      // Calculate total visits and total spent
      const totalVisits = allHistory.length
      const lastVisit = allHistory[0]?.date || client.lastVisit || '—'

      const totalSpentNum = allHistory.reduce((sum, item) => {
        const raw = String(item.price || '0').replace(/[₱,\s]/g, '')
        const val = parseFloat(raw)
        return sum + (isNaN(val) ? 0 : val)
      }, 0)

      return {
        ...client,
        totalVisits,
        lastVisit,
        totalSpent: `₱${totalSpentNum.toLocaleString()}`,
        history: allHistory
      }
    })

    return result
  }, [appointments, dbUsers, customClients])

  const filteredClients = computedClients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAction = (actionName, client) => {
    setOpenMenuId(null)
    if (actionName === 'Service History' || actionName === 'View Profile') {
      setActiveHistoryClient(client)
    } else if (actionName === 'Edit Profile') {
      setEditClient(client)
    } else if (actionName === 'Deactivate Client') {
      setCustomClients((prev) => [
        ...prev.filter((c) => c.name.toLowerCase() !== client.name.toLowerCase()),
        { ...client, status: 'Inactive' }
      ])
    }
  }

  const handleSaveEdit = (updatedClient) => {
    setCustomClients((prev) => [
      ...prev.filter((c) => c.id !== updatedClient.id && c.name.toLowerCase() !== updatedClient.name.toLowerCase()),
      updatedClient
    ])
    setEditClient(null)
  }

  const handleAddClient = (newClient) => {
    setCustomClients((prev) => [...prev, newClient])
    setShowAddModal(false)
  }

  // If Service History / Client details is selected, render the history view
  if (activeHistoryClient) {
    return (
      <ClientHistory
        client={activeHistoryClient}
        onBack={() => setActiveHistoryClient(null)}
      />
    )
  }

  return (
    <div className="appointment-table-shell">
      {/* Add Client Modal */}
      {showAddModal && (
        <ClientAdd
          onClose={() => setShowAddModal(false)}
          onSave={handleAddClient}
        />
      )}

      {/* Edit Client Modal */}
      {editClient && (
        <ClientEdit
          client={editClient}
          onClose={() => setEditClient(null)}
          onSave={handleSaveEdit}
        />
      )}
      {/* Titlebar consistent with Services & Appointment */}
      <div className="appointment-table-titlebar">
        <h2>Clients</h2>
        <button
          type="button"
          className="services-btn-add"
          onClick={() => setShowAddModal(true)}
        >
          <span>＋</span> Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0.8rem 1.25rem 0.2rem' }}>
        <div className="services-search-wrapper">
          <span style={{ color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search client name or contact number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="services-search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="appointment-table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Number</th>
              <th>Total Visits</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}
                >
                  No clients found matching your search.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-name-cell">
                      <span className="client-avatar-badge">👤</span>
                      <span className="client-name-text">{client.name}</span>
                    </div>
                  </td>
                  <td>{client.contact}</td>
                  <td>
                    <span className="client-visits-badge">{client.totalVisits}</span>
                  </td>
                  <td>{client.lastVisit}</td>
                  <td>
                    <div className="bc-status-cell">
                      <span
                        className={`bc-status-dot ${
                          client.status === 'Active' ? 'bc-dot-active' : 'bc-dot-inactive'
                        }`}
                      />
                      <span
                        className={`appointment-status ${
                          client.status === 'Active' ? 'confirmed' : 'cancelled'
                        }`}
                      >
                        {client.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="appointment-actions-menu">
                      <button
                        type="button"
                        className="appointment-actions-trigger"
                        aria-label={`Actions for ${client.name}`}
                        aria-expanded={openMenuId === client.id}
                        onClick={() =>
                          setOpenMenuId((curr) => (curr === client.id ? null : client.id))
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === client.id && (
                        <div className="appointment-actions-dropdown" role="menu">
                          <button
                            type="button"
                            role="menuitem"
                            className="appointment-actions-dropdown-item client-action-view"
                            onClick={() => handleAction('View Profile', client)}
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="appointment-actions-dropdown-item client-action-edit"
                            onClick={() => handleAction('Edit Profile', client)}
                          >
                            Edit Profile
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="appointment-actions-dropdown-item client-action-history"
                            onClick={() => handleAction('Service History', client)}
                          >
                            Service History
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="appointment-actions-dropdown-item client-action-deactivate"
                            onClick={() => handleAction('Deactivate Client', client)}
                          >
                            Deactivate Client
                          </button>
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
    </div>
  )
}

export default Client
