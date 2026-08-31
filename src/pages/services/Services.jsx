import { useState, useEffect } from 'react'
import servicesImage from '../../assets/images/gallery/services ..webp'
import taperFadeImg from '../../assets/images/gallery/Taper Fade.jpeg'
import buzzCutImg from '../../assets/images/gallery/Buzz Cut.jpg'
import crewCutImg from '../../assets/images/gallery/Crew Cut.jpeg'
import frenchCropImg from '../../assets/images/gallery/French Crop.jpeg'
import undercutImg from '../../assets/images/gallery/Undercut.jpeg'
import '../../styles/services/Services.css'

const haircutServices = [
  { name: 'Taper Fade', image: taperFadeImg },
  { name: 'Buzz Cut', image: buzzCutImg },
  { name: 'Crew Cut', image: crewCutImg },
  { name: 'French Crop', image: frenchCropImg },
  { name: 'Undercut', image: undercutImg }
]

const extendedServices = [...haircutServices, ...haircutServices]

function Services() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handlePrevService = () => {
    setCurrentServiceIndex((prev) =>
      prev === 0 ? haircutServices.length - 1 : prev - 1
    )
  }

  const handleNextService = () => {
    setCurrentServiceIndex((prev) => (prev + 1) % haircutServices.length)
  }

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      handleNextService()
    }, 3000)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section id="services" className="services-section">
      <div className="services-bg-wrapper">
        <img
          src={servicesImage}
          alt="Teresita's Barbershop Services"
          className="services-bg-img"
        />
        <div className="services-overlay"></div>
      </div>

      <div className="services-content">
        <div className="section-header services-header">
          <span className="section-subtitle">What We Offer</span>
          <h2>Our Services</h2>
        </div>

        {/* 3-Image Animated Banner Carousel */}
        <div
          className="services-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            type="button"
            className="carousel-arrow left-arrow"
            onClick={handlePrevService}
            aria-label="Previous Haircut"
          >
            &#10094;
          </button>

          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentServiceIndex * 260}px)`
              }}
            >
              {extendedServices.map((item, idx) => (
                <div key={`${item.name}-${idx}`} className="carousel-card">
                  <div className="haircut-img-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="haircut-img"
                    />
                  </div>
                  <div className="haircut-name-badge">
                    <h3>{item.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="carousel-arrow right-arrow"
            onClick={handleNextService}
            aria-label="Next Haircut"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  )
}

export default Services
