import { getCurrentYear } from '../utils/helpers'
import '../styles/Footer.css'

import facebookIcon from '../assets/images/gallery/icons/facebook--png.webp'
import tiktokIcon from '../assets/images/gallery/icons/titok.png'
import ytIcon from '../assets/images/gallery/icons/yt.png'

function Footer() {
  return (
    <footer className="site-footer">
      <div
        className="brand-logo"
        style={{ justifyContent: 'center', marginBottom: '0.4rem', fontSize: '1.05rem' }}
      >
        <span className="brand-badge">💈</span>
        Teresita&apos;s Barbershop
      </div>

      <div className="footer-social-wrapper">
        <p className="social-follow-text">Follow Us On Social Media</p>
        <div className="footer-social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link facebook"
            aria-label="Facebook"
          >
            <img src={facebookIcon} alt="Facebook" className="footer-social-icon-img" />
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link tiktok"
            aria-label="TikTok"
          >
            <img src={tiktokIcon} alt="TikTok" className="footer-social-icon-img" />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link youtube"
            aria-label="YouTube"
          >
            <img src={ytIcon} alt="YouTube" className="footer-social-icon-img" />
          </a>
        </div>
      </div>

      <p className="copyright-text">
        Copyright © {getCurrentYear()} Teresita&apos;s Barbershop.
        All rights reserved.
      </p>
    </footer>
  )
}

export default Footer