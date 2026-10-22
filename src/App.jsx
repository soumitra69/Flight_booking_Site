import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSkyLanding from './components/HeroSkyLanding';
import AboutSection from './components/AboutSection';
import FlightBookingSection from './components/FlightBookingSection';
import ServicesSection from './components/ServicesSection';
import TestimonialsAndOffers from './components/TestimonialsAndOffers';
import Footer from './components/Footer';
import { fetchLiveExchangeRates } from './services/flightApi';

export default function App() {
  const [currency, setCurrency] = useState('USD');
  const [exchangeInfo, setExchangeInfo] = useState({
    rates: { USD: 1, INR: 84.15, EUR: 0.92, GBP: 0.79, AED: 3.67 },
    isLive: false,
    provider: 'Loading API...',
  });
  const [landingTriggerKey, setLandingTriggerKey] = useState(0);
  const [prefilledRoute, setPrefilledRoute] = useState(null);
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('jetly_booked_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  // Fetch live currency rates from Free API on mount
  useEffect(() => {
    let mounted = true;
    fetchLiveExchangeRates().then((data) => {
      if (mounted) {
        setExchangeInfo(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Scroll-reveal animation observer for sections across the website
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleBookingConfirmed = (ticket) => {
    setBookings((prev) => {
      const updated = [ticket, ...prev];
      try {
        localStorage.setItem('jetly_booked_tickets', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const handleSelectRouteAndScroll = (routeObj) => {
    setPrefilledRoute({ ...routeObj, ts: Date.now() });
    const bookingEl = document.getElementById('book-ticket');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplayLanding = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLandingTriggerKey((k) => k + 1);
  };

  return (
    <div className="jetly-app">
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        exchangeInfo={exchangeInfo}
        bookingsCount={bookings.length}
        onOpenBookingsModal={() => setShowBookingsModal(true)}
        onReplayLanding={handleReplayLanding}
      />

      <main>
        <HeroSkyLanding landingTriggerKey={landingTriggerKey} />
        <AboutSection />
        <FlightBookingSection
          currency={currency}
          setCurrency={setCurrency}
          exchangeInfo={exchangeInfo}
          prefilledRoute={prefilledRoute}
          onBookingConfirmed={handleBookingConfirmed}
        />
        <ServicesSection currency={currency} exchangeInfo={exchangeInfo} />
        <TestimonialsAndOffers
          currency={currency}
          exchangeInfo={exchangeInfo}
          onSelectRouteAndScroll={handleSelectRouteAndScroll}
        />
      </main>

      <Footer onReplayLanding={handleReplayLanding} />

      {/* Saved Tickets / My Bookings Modal */}
      {showBookingsModal && (
        <div
          className="tickets-modal-backdrop"
          onClick={() => setShowBookingsModal(false)}
        >
          <div
            className="tickets-modal-card animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tickets-modal-header">
              <h3>
                <i className="fa-solid fa-ticket"></i> My Booked Flight Tickets ({bookings.length})
              </h3>
              <button
                type="button"
                className="bp-close-btn"
                onClick={() => setShowBookingsModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-tickets-state">
                <i className="fa-solid fa-plane-circle-exclamation"></i>
                <p>You haven't booked any flight tickets yet.</p>
                <a
                  href="#book-ticket"
                  className="banner-btn primary-btn"
                  onClick={() => setShowBookingsModal(false)}
                >
                  Book Your First Flight Now
                </a>
              </div>
            ) : (
              <div className="tickets-modal-list">
                {bookings.map((t, index) => (
                  <div className="saved-ticket-item" key={`${t.pnr}-${index}`}>
                    <div className="saved-ticket-top">
                      <span className="saved-pnr">{t.pnr}</span>
                      <span className="saved-tier">{t.tierName}</span>
                      <strong className="saved-price">{t.priceFormatted}</strong>
                    </div>
                    <div className="saved-ticket-route">
                      <strong>
                        {t.origin.city} ({t.origin.code})
                      </strong>
                      <span className="saved-arrow">
                        <i className="fa-solid fa-plane"></i> {t.durationText}
                      </span>
                      <strong>
                        {t.destination.city} ({t.destination.code})
                      </strong>
                    </div>
                    <div className="saved-ticket-meta">
                      <span>Passenger: {t.passengerName}</span>
                      <span>Date: {t.date} at {t.departureTime}</span>
                      <span>Gate: {t.gate} • Seat: {t.seat}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
