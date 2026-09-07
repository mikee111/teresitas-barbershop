import { useState, useEffect } from 'react'
import '../../styles/UserServices.css'
import {
  fetchServices,
  subscribeToServices,
  INITIAL_DEFAULT_SERVICES,
} from '../../services/servicesService'
import { servicesScissorIcon } from '../../assets/images'

function UserServices({ onSelectServiceToBook }) {
  const [services, setServices] = useState(INITIAL_DEFAULT_SERVICES)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const data = await fetchServices()
        if (isMounted && data) {
          setServices(data)
        }
      } catch (err) {
        console.error('Error fetching services in UserServices:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadData()

    // Real-time synchronization
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

  // Only show active services to client
  const activeServices = services.filter((s) => s.status === 'Active')

  const categories = ['All', ...new Set(activeServices.map((s) => s.category).filter(Boolean))]

  const filtered = activeServices.filter((s) => {
    const matchesCategory =
      selectedCategory === 'All' || s.category === selectedCategory
    const matchesSearch =
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description || s.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="user-services-container">
      {/* Top Header with Controls */}
      <div className="user-services-header">
        <div className="user-services-title-area">
          <h2>Barbershop Services</h2>
          <p>Browse our grooming treatments, haircut styles, and beard care packages.</p>
        </div>

        <div className="user-services-controls">
          {/* Search Box */}
          <div className="user-services-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="user-services-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`user-services-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Services */}
      {isLoading && services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading live services...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', color: '#64748b' }}>
          No services found matching your criteria.
        </div>
      ) : (
        <div className="user-services-grid">
          {filtered.map((service) => (
            <div key={service.id} className="user-service-card">
              <div className="user-service-thumb-wrap">
                <img
                  src={service.image || servicesScissorIcon}
                  alt={service.name}
                  className="user-service-thumb"
                  onError={(e) => {
                    e.currentTarget.src = servicesScissorIcon
                  }}
                />
                <span className="user-service-cat-badge">{service.category}</span>
                <span className="user-service-duration-badge">⏱ {service.duration}</span>
              </div>

              <div className="user-service-body">
                <div className="user-service-name-row">
                  <h3 className="user-service-name">{service.name}</h3>
                  <span className="user-service-price">{service.price}</span>
                </div>

                <p className="user-service-desc">
                  {service.description || service.desc || 'Premium professional styling.'}
                </p>

                <button
                  type="button"
                  className="user-service-book-btn"
                  onClick={() => onSelectServiceToBook && onSelectServiceToBook(service)}
                >
                  📅 Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserServices
