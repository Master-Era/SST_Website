import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../assets/images/shreeji-logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownSuppressed, setDropdownSuppressed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownSuppressed(true);
  };

  return (
    <header className="header">
      <div className="container">
        <Link className="logo" to="/" onClick={closeMenus}>
          <img src={logo} alt="Shreeji Samipya Trust" />
          <span>Shreeji Samipya</span>
        </Link>

        <button
          className={`nav-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav${menuOpen ? " is-open" : ""}`}>
          <Link to="/" onClick={closeMenus}>Home</Link>
          <div
            className={`nav-dropdown${dropdownSuppressed ? " is-suppressed" : ""}`}
            onMouseEnter={() => setDropdownSuppressed(false)}
            onMouseLeave={() => setDropdownSuppressed(true)}
          >
            <Link className="nav-dropdown-trigger" to="/activity" onClick={closeMenus}>
              Activity
              <span className="child-menu-icon" aria-hidden="true">⌄</span>
            </Link>
            <div className="nav-dropdown-menu">
              <Link to="/activity#activity-service" onClick={closeMenus}>Activity</Link>
              <Link to="/activity#social-care" onClick={closeMenus}>Social Activity</Link>
            </div>
          </div>
          <Link to="/events" onClick={closeMenus}>Events</Link>
          <Link to="/news" onClick={closeMenus}>News</Link>
          <Link to="/gallery" onClick={closeMenus}>Gallery</Link>
          <Link to="/about" onClick={closeMenus}>About</Link>
          <Link to="/contact" onClick={closeMenus}>Contact</Link>
          <Link className="header-register-btn" to="/hari-bhakto-registration" onClick={closeMenus}>Devotee Registration</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
