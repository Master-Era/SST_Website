import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-overlay"></div>
      <div className="footer-content page-shell">
        <div className="footer-summary">
          <strong>Shreeji Samipya Trust</strong>
          <p>Mandir seva, satsang and gurukul sanskar sathe samaj ne jodtu NGO.</p>
          <p>Gaushala, Anna Dan, events, gallery and devotee connection in one place.</p>
          <p>Bhakti, seva and samipya through a clean professional digital presence.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/activity">Activity</Link>
          <Link to="/events">Events</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-social">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">yt</a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="WhatsApp">wa</a>
        </div>
      </div>

      <p className="footer-copy">(c) 2026 Shreeji Samipya Trust</p>
    </footer>
  );
}

export default Footer;
