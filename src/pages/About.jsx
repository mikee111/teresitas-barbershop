import aboutImage from '../assets/images/about/about-bg.jpeg'
import '../styles/About.css'

function About() {
  return (
    <section id="about" className="about-section-hero">
      <div className="about-bg-wrapper">
        <img
          src={aboutImage}
          alt="Teresita's Barbershop About Us Background"
          className="about-bg-img"
        />
        <div className="about-overlay"></div>
      </div>

      <div className="about-hero-content">
        <div className="section-header">
          <span className="section-subtitle">Our Heritage &amp; Story</span>
          <h2>About Teresita&apos;s Barbershop</h2>
        </div>

        <div className="about-grid">
          <div className="about-text">
            <p>
              Welcome to <strong>Teresita&apos;s Barbershop</strong> — where classic cuts meet modern style.
              Our skilled barbers are here to give you a fresh look every time you visit.
            </p>
            <p>
              From precision fades and razor shaves to traditional hot towel treatments, we combine time-honored barbering craftsmanship with contemporary trends.
            </p>
            <div className="about-features">
              <div className="feature-card">
                <h4>Master Barbers</h4>
                <p>Years of expertise in precision cuts and custom styling.</p>
              </div>
              <div className="feature-card">
                <h4>Classic Shaves</h4>
                <p>Traditional hot towel razor shaves for ultimate comfort.</p>
              </div>
            </div>
          </div>

          <div className="about-card-badge">
            <span style={{ fontSize: '3rem' }}>💈</span>
            <h3>Quality Grooming</h3>
            <p style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>
              Dedicated to providing an authentic barbershop experience for all clients.
            </p>
            <a href="#contact-us" className="btn-primary" style={{ display: 'inline-block' }}>
              Visit Us Today
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
