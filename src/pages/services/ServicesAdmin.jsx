import { useEffect, useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/services/ServicesAdmin.css'
import {
  fetchServices,
  createService,
  updateService,
  updateServiceStatus,
  subscribeToServices,
  INITIAL_DEFAULT_SERVICES,
} from '../../services/servicesService'

function ServicesAdmin() {
  const [services, setServices] = useState(INITIAL_DEFAULT_SERVICES)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [activeViewService, setActiveViewService] = useState(null)
  const [activeEditService, setActiveEditService] = useState(null)
  const [activeDeactivateService, setActiveDeactivateService] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Haircut',
    price: '₱200',
    duration: '30 mins',
    description: '',
    status: 'Active',
    imageUrl: '',
  })

  // Load services and subscribe to real-time updates
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const data = await fetchServices()
        if (isMounted && data) {
          setServices(data)
        }
      } catch (err) {
        console.error('Error fetching services in ServicesAdmin:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadData()

    // Real-time subscription (Supabase postgres_changes + local event broadcast)
    const unsubscribe = subscribeToServices((updatedList) => {
      if (isMounted && updatedList) {
        setServices(updatedList)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // Close actions dropdown menu when clicking outside
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

  const filteredServices = services.filter((s) =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleActionClick = async (action, service) => {
    setOpenMenuId(null)
    if (action === 'View') {
      setActiveEditService(null)
      setActiveDeactivateService(null)
      setActiveViewService(service)
    } else if (action === 'Edit') {
      setActiveViewService(null)
      setActiveDeactivateService(null)
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        description: service.description || service.desc || '',
        status: service.status,
        imageUrl: service.imageUrl || service.image_url || '',
      })
      setActiveEditService(service)
    } else if (action === 'Deactivate') {
      setActiveViewService(null)
      setActiveEditService(null)
      setActiveDeactivateService(service)
    } else if (action === 'Activate') {
      try {
        const updated = await updateServiceStatus(service.id, 'Active')
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, ...updated, status: 'Active' } : s))
        )
      } catch (err) {
        console.error('Failed to activate service:', err)
      }
    }
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!activeEditService || isSaving) return
    setIsSaving(true)

    try {
      const updated = await updateService(activeEditService.id, {
        name: formData.name,
        category: formData.category,
        price: formData.price.startsWith('₱') ? formData.price : `₱${formData.price}`,
        duration: formData.duration,
        description: formData.description,
        status: formData.status,
        imageUrl: formData.imageUrl,
      })

      setServices((prev) =>
        prev.map((s) => (s.id === activeEditService.id ? { ...s, ...updated } : s))
      )
      setActiveEditService(null)
    } catch (err) {
      console.error('Failed to update service:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateService = async (e) => {
    e.preventDefault()
    if (isSaving) return
    setIsSaving(true)

    try {
      const created = await createService({
        name: formData.name || 'New Service',
        category: formData.category,
        price: formData.price.startsWith('₱') ? formData.price : `₱${formData.price}`,
        duration: formData.duration,
        description: formData.description,
        status: formData.status,
        imageUrl: formData.imageUrl,
      })

      setServices((prev) => [created, ...prev.filter((s) => s.id !== created.id)])
      setIsAddingNew(false)
      setFormData({
        name: '',
        category: 'Haircut',
        price: '₱200',
        duration: '30 mins',
        description: '',
        status: 'Active',
        imageUrl: '',
      })
    } catch (err) {
      console.error('Failed to create service:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmDeactivate = async () => {
    if (!activeDeactivateService || isSaving) return
    setIsSaving(true)

    try {
      const updated = await updateServiceStatus(activeDeactivateService.id, 'Inactive')
      setServices((prev) =>
        prev.map((s) =>
          s.id === activeDeactivateService.id ? { ...s, ...updated, status: 'Inactive' } : s
        )
      )
      setActiveDeactivateService(null)
    } catch (err) {
      console.error('Failed to deactivate service:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const isModalOpen =
    Boolean(activeViewService) ||
    Boolean(activeEditService) ||
    Boolean(activeDeactivateService) ||
    isAddingNew

  return (
    <div className={`appointment-table-shell${isModalOpen ? ' appointment-table-shell--overlay-open' : ''}`}>
      <div className="appointment-table-titlebar">
        <h2>Services Management</h2>
        <button
          type="button"
          className="services-btn-add"
          onClick={() => {
            setFormData({
              name: '',
              category: 'Haircut',
              price: '₱200',
              duration: '30 mins',
              description: '',
              status: 'Active',
              imageUrl: '',
            })
            setIsAddingNew(true)
          }}
        >
          <span>＋</span> Add Service
        </button>
      </div>

      <div style={{ padding: '0.8rem 1.25rem 0.2rem' }}>
        <div className="services-search-wrapper">
          <span style={{ color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search service name or category..."
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
              <th>Service</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && services.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Loading services...
                </td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No services found matching your search.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div className="service-cell">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="service-cell-img"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="service-cell-icon">✂️</div>
                      )}
                      <div className="service-cell-info">
                        <span className="service-cell-name">{service.name}</span>
                        {(service.description || service.desc) && (
                          <span
                            className="service-cell-category"
                            style={{
                              maxWidth: '240px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {service.description || service.desc}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{service.category}</td>
                  <td>{service.duration}</td>
                  <td>
                    <span className="service-price-badge">{service.price}</span>
                  </td>
                  <td>
                    <div className="bc-status-cell">
                      <span
                        className={`bc-status-dot ${
                          service.status === 'Active' ? 'bc-dot-active' : 'bc-dot-inactive'
                        }`}
                      />
                      <span
                        className={`appointment-status ${
                          service.status === 'Active' ? 'confirmed' : 'cancelled'
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="appointment-actions-menu">
                      <button
                        type="button"
                        className="appointment-actions-trigger"
                        aria-label={`Actions for ${service.name}`}
                        aria-expanded={openMenuId === service.id}
                        onClick={() =>
                          setOpenMenuId((curr) => (curr === service.id ? null : service.id))
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === service.id && (
                        <div className="appointment-actions-dropdown" role="menu">
                          <button
                            type="button"
                            role="menuitem"
                            className="appointment-actions-dropdown-item bc-action-view"
                            onClick={() => handleActionClick('View', service)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="appointment-actions-dropdown-item bc-action-edit"
                            onClick={() => handleActionClick('Edit', service)}
                          >
                            Edit
                          </button>
                          {service.status === 'Active' ? (
                            <button
                              type="button"
                              role="menuitem"
                              className="appointment-actions-dropdown-item bc-action-deactivate"
                              onClick={() => handleActionClick('Deactivate', service)}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              type="button"
                              role="menuitem"
                              className="appointment-actions-dropdown-item bc-action-activate"
                              onClick={() => handleActionClick('Activate', service)}
                            >
                              Activate
                            </button>
                          )}
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

      {/* View Modal */}
      {activeViewService && (
        <div className="appointment-modal-overlay">
          <div className="service-modal-shell">
            <div className="service-modal-titlebar">
              <h2>Service Details</h2>
              <button
                type="button"
                className="service-modal-close"
                onClick={() => setActiveViewService(null)}
              >
                ✕
              </button>
            </div>
            <div className="service-modal-body">
              <div className="service-view-details">
                <div className="service-view-row">
                  <span className="service-view-label">Service Name</span>
                  <span className="service-view-val">{activeViewService.name}</span>
                </div>
                <div className="service-view-row">
                  <span className="service-view-label">Category</span>
                  <span className="service-view-val">{activeViewService.category}</span>
                </div>
                <div className="service-view-row">
                  <span className="service-view-label">Price</span>
                  <span className="service-view-val" style={{ color: '#047857' }}>
                    {activeViewService.price}
                  </span>
                </div>
                <div className="service-view-row">
                  <span className="service-view-label">Duration</span>
                  <span className="service-view-val">{activeViewService.duration}</span>
                </div>
                <div className="service-view-row">
                  <span className="service-view-label">Status</span>
                  <span
                    className={`appointment-status ${
                      activeViewService.status === 'Active' ? 'confirmed' : 'cancelled'
                    }`}
                  >
                    {activeViewService.status}
                  </span>
                </div>
                <div className="service-view-row" style={{ flexDirection: 'column', gap: '0.4rem' }}>
                  <span className="service-view-label">Description</span>
                  <span style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: '1.4' }}>
                    {activeViewService.description || activeViewService.desc || 'No description provided.'}
                  </span>
                </div>
              </div>

              <div className="service-form-actions">
                <button
                  type="button"
                  className="service-btn-submit"
                  onClick={() => setActiveViewService(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {(activeEditService || isAddingNew) && (
        <div className="appointment-modal-overlay">
          <div className="service-modal-shell">
            <div className="service-modal-titlebar">
              <h2>{isAddingNew ? 'Add New Service' : 'Edit Service'}</h2>
              <button
                type="button"
                className="service-modal-close"
                onClick={() => {
                  setActiveEditService(null)
                  setIsAddingNew(false)
                }}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={isAddingNew ? handleCreateService : handleSaveEdit}
              className="service-modal-body"
            >
              <div className="service-form-grid">
                <div className="service-form-group full-width">
                  <label htmlFor="service-name">Service Name</label>
                  <input
                    id="service-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="service-form-input"
                    placeholder="e.g. Skin Fade"
                  />
                </div>

                <div className="service-form-group">
                  <label htmlFor="service-category">Category</label>
                  <select
                    id="service-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="service-form-select"
                  >
                    <option value="Haircut">Haircut</option>
                    <option value="Beard & Shave">Beard & Shave</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Combo Package">Combo Package</option>
                  </select>
                </div>

                <div className="service-form-group">
                  <label htmlFor="service-price">Price</label>
                  <input
                    id="service-price"
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="service-form-input"
                    placeholder="₱250"
                  />
                </div>

                <div className="service-form-group">
                  <label htmlFor="service-duration">Duration</label>
                  <select
                    id="service-duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    className="service-form-select"
                  >
                    <option value="20 mins">20 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="35 mins">35 mins</option>
                    <option value="40 mins">40 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="50 mins">50 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
                </div>

                <div className="service-form-group">
                  <label htmlFor="service-status">Status</label>
                  <select
                    id="service-status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="service-form-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="service-form-group full-width">
                  <label htmlFor="service-image-url">Image URL (Optional)</label>
                  <input
                    id="service-image-url"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    className="service-form-input"
                    placeholder="https://... or leave empty for default style icon"
                  />
                </div>

                <div className="service-form-group full-width">
                  <label htmlFor="service-desc">Description</label>
                  <textarea
                    id="service-desc"
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="service-form-textarea"
                    placeholder="Short description of the service..."
                  />
                </div>
              </div>

              <div className="service-form-actions">
                <button
                  type="button"
                  className="service-btn-cancel"
                  onClick={() => {
                    setActiveEditService(null)
                    setIsAddingNew(false)
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="service-btn-submit" disabled={isSaving}>
                  {isSaving
                    ? 'Saving...'
                    : isAddingNew
                    ? 'Create Service'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {activeDeactivateService && (
        <div className="appointment-modal-overlay">
          <div className="service-modal-shell" style={{ maxWidth: '420px' }}>
            <div className="service-modal-titlebar" style={{ background: '#dc2626' }}>
              <h2>Deactivate Service</h2>
              <button
                type="button"
                className="service-modal-close"
                onClick={() => setActiveDeactivateService(null)}
                disabled={isSaving}
              >
                ✕
              </button>
            </div>
            <div className="service-modal-body">
              <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', color: '#374151' }}>
                Are you sure you want to deactivate{' '}
                <strong>{activeDeactivateService.name}</strong>? Clients will no longer be able
                to book this service.
              </p>
              <div className="service-form-actions">
                <button
                  type="button"
                  className="service-btn-cancel"
                  onClick={() => setActiveDeactivateService(null)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="service-btn-submit"
                  style={{ background: '#dc2626' }}
                  onClick={handleConfirmDeactivate}
                  disabled={isSaving}
                >
                  {isSaving ? 'Deactivating...' : 'Yes, Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesAdmin
