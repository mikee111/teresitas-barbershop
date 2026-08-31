import contactBgImage from '../assets/images/about/contact us.jpg'
import '../styles/Contact.css'

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for reaching out! We will contact you shortly.')
  }

  return (
    <section id="contact-us" className="contact-section">
      {/* Background Image */}
      <div className="contact-bg-wrapper">
        <img
          src={contactBgImage}
          alt="Teresita's Barbershop Contact Background"
          className="contact-bg-img"
        />
        <div className="contact-overlay"></div>
      </div>

      {/* Content */}
      <div className="contact-hero-content">
        <div className="section-header">
          <span className="section-subtitle">Get In Touch</span>
          <h2>Contact Us</h2>
        </div>

        <div className="contact-container">
          <div className="contact-info-list">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <h4>Location</h4>
                <p>964 Barangay Bambang</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div>
                <h4>Business Hours</h4>
                <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                <p>Sun: 10:00 AM - 5:00 PM</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">💈</span>
              <div>
                <h4>Walk-ins</h4>
                <p>Walk-ins are always welcome!</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 style={{ color: 'var(--text-h)' }}>Send Us a Message</h3>

            <div className="form-group">
              <label htmlFor="contact-name">Full Name</label>
              <input id="contact-name" type="text" placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="contact-phone">Phone Number</label>
              <input id="contact-phone" type="tel" placeholder="(555) 000-0000" required />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message or Service Request</label>
              <textarea
                id="contact-message"
                rows={3}
                placeholder="Tell us what service you are looking for..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
