import homepageImage from '../assets/images/gallery/homepage.webp'
import '../styles/Home.css'

function Home() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-wrapper">
        <img
          src={homepageImage}
          alt="Teresita's Barbershop Homepage Banner"
          className="hero-bg-img"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <span className="hero-tag">Established &amp; Trusted</span>
        <h1>Teresita&apos;s Barbershop</h1>
        <p className="hero-subtitle">
          Classic cuts. Modern style. Walk-ins welcome. Experience premium grooming tailored just for you.
        </p>
        <div className="hero-actions">
          <a href="#contact-us" className="btn-primary">
            Book Appointment
          </a>
          <a href="#about" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}

export default Home
