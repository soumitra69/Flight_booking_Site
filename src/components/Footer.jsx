import React, { useState } from 'react';

export default function Footer({ onReplayLanding }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToTopAndLand = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onReplayLanding) {
      setTimeout(() => onReplayLanding(), 500);
    }
  };

  return (
    <footer id="footer" className="site-footer">
      {/* Animated Sky-Runway Footer Divider */}
      <div className="footer-runway-strip">
        <div className="footer-moving-jet">
          <i className="fa-solid fa-plane"></i>
          <span className="jet-trail"></span>
        </div>
      </div>

      <div className="container">
        {/* Top CTA Banner inside Footer */}
        <div className="footer-cta-banner">
          <div>
            <span className="footer-cta-kicker">READY FOR TAKEOFF &amp; SMOOTH LANDING?</span>
            <h3>Experience Private Luxury Aviation Today</h3>
          </div>
          <div className="footer-cta-buttons">
            <a href="#book-ticket" className="banner-btn primary-btn">
              <i className="fa-solid fa-ticket"></i> Book Flight Ticket Now
            </a>
            <button
              type="button"
              className="banner-btn secondary-btn"
              onClick={scrollToTopAndLand}
            >
              <i className="fa-solid fa-plane-arrival"></i> Watch Sky Landing
            </button>
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <img
              src="./assets/image_2025_02_24T09_19_04_390Z1.png"
              alt="Jetly Aviation Logo"
              className="footer-logo"
            />
            <p className="footer-about-text">
              Jetly is your premier private jet &amp; luxury flight booking
              platform. Enjoy 15-minute VIP terminal boarding, live API
              multi-currency ticket rates, and access to 5,000+ global runways.
            </p>
            <div className="footer-socials">
              <a
                href="https://github.com/soumitra69/Flight_booking_Site"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#home" aria-label="Twitter / X">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#home" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#home" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#home">Home &amp; Sky Landing</a>
              </li>
              <li>
                <a href="#about">About Jetly Aviation</a>
              </li>
              <li>
                <a href="#book-ticket">Live API Ticket Booking</a>
              </li>
              <li>
                <a href="#services">Our Charter Services</a>
              </li>
              <li>
                <a href="#charters">Empty Leg Flights</a>
              </li>
              <li>
                <a href="#destinations">Popular Destinations</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Aviation Fleet</h4>
            <ul className="footer-links">
              <li>
                <a href="#book-ticket">Executive Seat Share</a>
              </li>
              <li>
                <a href="#book-ticket">Light Business Jets</a>
              </li>
              <li>
                <a href="#book-ticket">Super Midsize Charters</a>
              </li>
              <li>
                <a href="#book-ticket">Ultra-Long Range VIP</a>
              </li>
              <li>
                <a href="#services">Diplomatic &amp; High Profile</a>
              </li>
              <li>
                <a href="#services">Air Ambulance &amp; Cargo</a>
              </li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4>VIP Empty-Leg Alerts</h4>
            <p>
              Subscribe to receive instant notifications on discounted private
              jet legs and live ticket rate drops.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
            {subscribed && (
              <span className="newsletter-success">
                <i className="fa-solid fa-circle-check"></i> Subscribed to VIP Flight Alerts!
              </span>
            )}

            <div className="footer-contact-items">
              <div>
                <i className="fa-solid fa-phone-volume"></i>
                <a href="tel:+919475750163">+91 (947575) - 0163</a>
              </div>
              <div>
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:concierge@jetly-flights.com">
                  concierge@jetly-flights.com
                </a>
              </div>
              <div>
                <i className="fa-solid fa-location-dot"></i>
                <span>VIP Terminal 3, New Delhi • Dubai • London</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} <strong>Jetly Private Aviation</strong>. Crafted by{' '}
            <a
              href="https://github.com/soumitra69"
              target="_blank"
              rel="noreferrer"
            >
              Soumitra (@soumitra69)
            </a>{' '}
            • Powered by React &amp; Live Free Aviation/Rate APIs.
          </p>
          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTopAndLand}
            title="Fly Back to Top"
          >
            <i className="fa-solid fa-plane-up"></i> Top
          </button>
        </div>
      </div>
    </footer>
  );
}
