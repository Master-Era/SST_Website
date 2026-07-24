import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-background"></div>
      <div className="footer-overlay"></div>

      <div className="footer-main page-shell">
        <div className="footer-grid">
          {/* Trust Information */}
          <div className="footer-column footer-about">
            <div className="footer-logo-area">
              {/* <div className="footer-logo-icon"></div> */}

              <div>
                <h2>Shreeji Samipya Trust</h2>
                <span>Connection Be Must</span>
              </div>
            </div>

            <p className="footer-description">
              Shreeji Samipya Trust is dedicated to spiritual growth,
              social service and cultural values through Mandir seva,
              satsang, gurukul education and community welfare activities.
            </p>

            <p className="footer-description">
              Our mission is to connect devotees, support society and
              preserve the values of compassion, devotion and selfless
              service.
            </p>

            <div className="footer-social">
              <a
                href="https://m.facebook.com/search_results/?q=Shreeji+Samipya+Trust"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/shreeji_samipya_trust/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.youtube.com/channel/UCFupl8zGAC817dFp4k3hnRg"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                title="YouTube"
              >
                <FaYoutube />
              </a>

              <a
                href="https://wa.me/919601151124"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>

            <div className="footer-title-line"></div>

            <ul className="footer-links">
              <li>
                <Link to="/">
                  <FaArrowRight />
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about">
                  <FaArrowRight />
                  About Trust
                </Link>
              </li>

              <li>
                <Link to="/activity">
                  <FaArrowRight />
                  Social Activities
                </Link>
              </li>

              <li>
                <Link to="/events">
                  <FaArrowRight />
                  Temple Events
                </Link>
              </li>

              <li>
                <Link to="/gallery">
                  <FaArrowRight />
                  Photo Gallery
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  <FaArrowRight />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Activities */}
          <div className="footer-column">
            <h3>Our Activities</h3>

            <div className="footer-title-line"></div>

            <ul className="footer-links">
              <li>
                <Link to="/activity">
                  <FaArrowRight />
                  Food Donation
                </Link>
              </li>

              <li>
                <Link to="/activity">
                  <FaArrowRight />
                  Child Education
                </Link>
              </li>

              <li>
                <Link to="/activity">
                  <FaArrowRight />
                  Health Camp
                </Link>
              </li>

              <li>
                <Link to="/activity">
                  <FaArrowRight />
                  Tree Plantation
                </Link>
              </li>

              <li>
                <Link to="/activity">
                  <FaArrowRight />
                  Gaushala Seva
                </Link>
              </li>

              <li>
                <Link to="/events">
                  <FaArrowRight />
                  Religious Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-column">
            <h3>Contact Information</h3>

            <div className="footer-title-line"></div>

            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <strong>Our Address</strong>
                  <p>
                    Hari Tirth AaShram,
                    Oppsite, Central University,
                    Kundhela, Vadodara,
                    <br />
                    Vadodara, Gujarat, India
                  </p>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <FaPhoneAlt />
                </div>

                <div>
                  <strong>Call Us</strong>
                  <a href="tel:+919876543210">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <strong>Email Us</strong>
                  <a href="mailto:info@shreejisamipya.org">
                    info@shreejisamipya.org
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <FaClock />
                </div>

                <div>
                  <strong>Darshan Time</strong>
                  <p>
                    Morning: 6:00 AM – 12:30 PM
                    <br />
                    Evening: 4:00 PM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="page-shell footer-bottom-content">
          <p>
            © {new Date().getFullYear()} Shreeji Samipya Trust. All
            Rights Reserved.
          </p>

          <p className="footer-developed">
            Designed with <FaHeart /> for Bhakti and Seva
          </p>

          <div className="footer-policy-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;