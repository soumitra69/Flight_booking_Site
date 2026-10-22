import React, { useState, useEffect } from 'react';
import { CURRENCY_META } from '../services/flightApi';

export default function Navbar({
  currency,
  setCurrency,
  exchangeInfo,
  bookingsCount,
  onOpenBookingsModal,
  onReplayLanding,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="row header-row">
          <a href="#home" className="nav-logo" onClick={handleNavClick}>
            <img
              src="./assets/image_2025_02_24T09_19_04_390Z1.png"
              alt="Jetly Company Logo"
            />
          </a>

          <button
            className="ham-menu"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          <nav className={`main-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <ul className="navul">
              <li>
                <a href="#home" onClick={handleNavClick}>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={handleNavClick}>
                  About
                </a>
              </li>
              <li>
                <a href="#book-ticket" onClick={handleNavClick} className="nav-highlight">
                  <i className="fa-solid fa-plane-departure"></i> Book Ticket
                </a>
              </li>
              <li>
                <a href="#services" onClick={handleNavClick}>
                  Services
                </a>
              </li>
              <li>
                <a href="#charters" onClick={handleNavClick}>
                  Charters
                </a>
              </li>
              <li>
                <a href="#destinations" onClick={handleNavClick}>
                  Destinations
                </a>
              </li>
              <li>
                <a href="#footer" onClick={handleNavClick}>
                  Contact
                </a>
              </li>
            </ul>

            <div className="header-actions-mobile">
              <button
                type="button"
                className="replay-nav-btn"
                onClick={() => {
                  handleNavClick();
                  onReplayLanding();
                }}
              >
                <i className="fa-solid fa-plane-arrival"></i> Replay Sky Landing
              </button>
            </div>
          </nav>

          <div className="icon-section">
            <div className="currency-switcher-wrap" title={`Live API Rate (${exchangeInfo.provider})`}>
              <span className="live-dot"></span>
              <select
                aria-label="Select Currency"
                className="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {Object.keys(CURRENCY_META).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCY_META[code].label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="icon-btn ticket-drawer-btn"
              onClick={onOpenBookingsModal}
              title="View Booked Flight Tickets"
            >
              <i className="fa-solid fa-ticket"></i>
              <span className="ticket-btn-label">My Tickets</span>
              {bookingsCount > 0 && (
                <span className="ticket-badge">{bookingsCount}</span>
              )}
            </button>

            <a
              href="#book-ticket"
              className="icon-btn"
              title="Search Flights"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </a>
          </div>

          <div className="nav-btn">
            <p>Call us Anytime</p>
            <a href="tel:+919475750163">+91 (947575) - 0163</a>
          </div>
        </div>
      </div>
    </header>
  );
}
