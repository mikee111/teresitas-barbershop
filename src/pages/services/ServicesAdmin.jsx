import { useEffect, useState } from 'react'
import '../../styles/SharedAdminTable.css'
import '../../styles/services/ServicesAdmin.css'
import taperFadeImg from '../../assets/images/gallery/Taper Fade.jpeg'
import buzzCutImg from '../../assets/images/gallery/Buzz Cut.jpg'
import crewCutImg from '../../assets/images/gallery/Crew Cut.jpeg'
import frenchCropImg from '../../assets/images/gallery/French Crop.jpeg'
import undercutImg from '../../assets/images/gallery/Undercut.jpeg'
import scissorCutImg from '../../assets/images/gallery/Scissor Cut.jpg'
import lowFadeImg from '../../assets/images/gallery/Low Fade.jpeg'

const initialServicesData = [
  {
    id: 1,
    name: 'Taper Fade',
    category: 'Haircut',
    price: '₱250',
    duration: '45 mins',
    status: 'Active',
    description: 'Clean fade with seamless blend on sides and back, scissor styled top.',
    image: taperFadeImg,
  },
  {
    id: 2,
    name: 'Buzz Cut',
    category: 'Haircut',
    price: '₱180',
    duration: '30 mins',
    status: 'Active',
    description: 'Even length all over with clean edge lineup.',
    image: buzzCutImg,
  },
  {
    id: 3,
    name: 'Crew Cut',
    category: 'Haircut',
    price: '₱200',
    duration: '35 mins',
    status: 'Active',
    description: 'Classic tapered short cut, styled neatly at the top.',
    image: crewCutImg,
  },
  {
    id: 4,
    name: 'French Crop',
    category: 'Haircut',
    price: '₱250',
    duration: '40 mins',
    status: 'Active',
    description: 'Modern textured crop with blunt fringe and tapered fade sides.',
    image: frenchCropImg,
  },
  {
    id: 5,
    name: 'Undercut',
    category: 'Haircut',
    price: '₱250',
    duration: '45 mins',
    status: 'Active',
    description: 'Short sides and back with distinct long top contrast.',
    image: undercutImg,
  },
  {
    id: 6,
    name: 'Beard Trim & Shave',
    category: 'Beard & Shave',
    price: '₱150',
    duration: '25 mins',
    status: 'Active',
    description: 'Precision beard shaping and hot towel razor line detailing.',
    image: scissorCutImg,
  },
  {
    id: 7,
    name: 'Hair Treatment & Wash',
    category: 'Hair Care',
    price: '₱300',
    duration: '50 mins',
    status: 'Inactive',
    description: 'Deep conditioning scalp wash with relaxing head massage.',
    image: lowFadeImg,
  },
]

function ServicesAdmin() {
  const [services, setServices] = useState(initialServicesData)
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
  })

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
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleActionClick = (action, service) => {
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
        description: service.description || '',
        status: service.status,
      })
      setActiveEditService(service)
    } else if (action === 'Deactivate') {
      setActiveViewService(null)
      setActiveEditService(null)
      setActiveDeactivateService(service)
    } else if (action === 'Activate') {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, status: 'Active' } : s))
      )
    }
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!activeEditService) return
    setServices((prev) =>
      prev.map((s) =>
        s.id === activeEditService.id
          ? {
              ...s,
              name: formData.name,
              category: formData.category,
              price: formData.price.startsWith('₱') ? formData.price : `₱${formData.price}`,
              duration: formData.duration,
              description: formData.description,
              status: formData.status,
            }
          : s
      )
    )
    setActiveEditService(null)
  }

  const handleCreateService = (e) => {
    e.preventDefault()
    const newService = {
      id: Date.now(),
      name: formData.name || 'New Service',
      category: formData.category,
      price: formData.price.startsWith('₱') ? formData.price : `₱${formData.price}`,
      duration: formData.duration,
      description: formData.description,
      status: formData.status,
      image: taperFadeImg,
    }
    setServices((prev) => [newService, ...prev])
    setIsAddingNew(false)
    setFormData({
      name: '',
      category: 'Haircut',
      price: '₱200',
      duration: '30 mins',
      description: '',
      status: 'Active',
    })
  }

  const handleConfirmDeactivate = () => {
    if (!activeDeactivateService) return
    setServices((prev) =>
      prev.map((s) =>
        s.id === activeDeactivateService.id ? { ...s, status: 'Inactive' } : s
      )
    )
    setActiveDeactivateService(null)
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
            {filteredServices.length === 0 ? (
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
                        />
                      ) : (
                        <div className="service-cell-icon">✂️</div>
                      )}
                      <div className="service-cell-info">
                        <span className="service-cell-name">{service.name}</span>
                        {service.description && (
                          <span className="service-cell-category" style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {service.description}
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
                    {activeViewService.description || 'No description provided.'}
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
                >
                  Cancel
                </button>
                <button type="submit" className="service-btn-submit">
                  {isAddingNew ? 'Create Service' : 'Save Changes'}
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
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="service-btn-submit"
                  style={{ background: '#dc2626' }}
                  onClick={handleConfirmDeactivate}
                >
                  Yes, Deactivate
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
