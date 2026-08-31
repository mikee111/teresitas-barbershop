import { useEffect, useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/Client/Client.css'
import ClientHistory from './ClientHistory'
import ClientEdit from './ClientEdit'
import ClientAdd from './ClientAdd'

const initialClientsData = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    contact: '0912-345-6789',
    totalVisits: 8,
    lastVisit: 'Aug 15, 2026',
    totalSpent: '₱1,200',
    status: 'Active',
    history: [
      { id: 101, date: 'Aug 15, 2026', service: 'Haircut', barber: 'Mark', price: '₱150' },
      { id: 102, date: 'Aug 05, 2026', service: 'Beard Trim', barber: 'John', price: '₱100' },
      { id: 103, date: 'Jul 28, 2026', service: 'Haircut + Beard', barber: 'Mark', price: '₱250' },
    ],
  },
  {
    id: 2,
    name: 'Pedro Santos',
    contact: '0998-765-4321',
    totalVisits: 3,
    lastVisit: 'Aug 10, 2026',
    totalSpent: '₱500',
    status: 'Active',
    history: [
      { id: 201, date: 'Aug 10, 2026', service: 'Haircut', barber: 'Luis', price: '₱180' },
      { id: 202, date: 'Jul 15, 2026', service: 'Beard Trim', barber: 'Pedro', price: '₱120' },
      { id: 203, date: 'Jun 20, 2026', service: 'Haircut', barber: 'Luis', price: '₱200' },
    ],
  },
  {
    id: 3,
    name: 'Mark Reyes',
    contact: '0917-222-3333',
    totalVisits: 5,
    lastVisit: 'Aug 12, 2026',
    totalSpent: '₱850',
    status: 'Active',
    history: [
      { id: 301, date: 'Aug 12, 2026', service: 'Buzz Cut', barber: 'Marco', price: '₱180' },
      { id: 302, date: 'Jul 22, 2026', service: 'Taper Fade', barber: 'Marco', price: '₱250' },
      { id: 303, date: 'Jul 02, 2026', service: 'Crew Cut', barber: 'Antonio', price: '₱200' },
    ],
  },
]

function Client() {
  const [clients, setClients] = useState(initialClientsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [activeHistoryClient, setActiveHistoryClient] = useState(null)
  const [editClient, setEditClient] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

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

  const filteredClients = clients.filter(
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
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, status: 'Inactive' } : c))
      )
    }
  }

  const handleSaveEdit = (updatedClient) => {
    setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)))
    setEditClient(null)
  }

  const handleAddClient = (newClient) => {
    setClients((prev) => [...prev, newClient])
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
