import React, { useState } from 'react';
import {
  TESTIMONIALS,
  CHARTER_LEGS,
  POPULAR_DESTINATIONS,
} from '../data/siteData';
import { formatCurrencyPrice } from '../services/flightApi';

export default function TestimonialsAndOffers({
  currency,
  exchangeInfo,
  onSelectRouteAndScroll,
}) {
  const [legStartIndex, setLegStartIndex] = useState(0);
  const [copiedPromo, setCopiedPromo] = useState(false);

  const visibleLegs = [
    CHARTER_LEGS[legStartIndex % CHARTER_LEGS.length],
    CHARTER_LEGS[(legStartIndex + 1) % CHARTER_LEGS.length],
  ];

  const handlePrevLegs = () => {
    setLegStartIndex(
      (prev) => (prev - 1 + CHARTER_LEGS.length) % CHARTER_LEGS.length
    );
  };

  const handleNextLegs = () => {
    setLegStartIndex((prev) => (prev + 1) % CHARTER_LEGS.length);
  };

  const handleCopyPromo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('JETLY20').catch(() => {});
    }
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 3000);
  };

  return (
    <>
      {/* Customer Feedback Section */}
      <section className="testimonials-section reveal-on-scroll">
        <div className="container">
          <div className="customer-header">
            <p>
              <i className="fa-solid fa-comments"></i> CUSTOMER FEEDBACK
            </p>
            <h2>
              What they're talking about <br /> our flight service
            </h2>
            <div className="customar-box">
              {TESTIMONIALS.map((item) => (
                <div className="Second-customer testimonial-card" key={item.id}>
                  <span className="testimonial-route-tag">
                    <i className="fa-solid fa-plane"></i> {item.route}
                  </span>
                  <p>"{item.quote}"</p>
                  <div className="customer-footer-row">
                    <div className="customer-img">
                      <img src={item.avatar} alt={item.name} />
                    </div>
                    <div className="customer-content-box">
                      <div className="star-box">
                        {Array.from({ length: item.rating }).map((_, idx) => (
                          <div className="star-img" key={idx}>
                            <img src="./assets/star-fill copy.png" alt="Star" />
                          </div>
                        ))}
                      </div>
                      <div className="customer-name">
                        <span>{item.name}</span>
                        <span className="customer-role">{item.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="offers reveal-on-scroll">
        <div className="offer-container">
          <div className="offer-row">
            <div className="offer-content">
              <p className="offer-badge-kicker">
                <i className="fa-solid fa-crown"></i> SPECIAL OFFER • SAVE 20%
              </p>
              <h2>
                The best service <br />
                for business people <br />
                who appreciate time
              </h2>
              <p>
                Book any private charter or executive seat ticket today and use
                promo code <strong>JETLY20</strong> in our live API booking
                engine for an instant 20% executive discount.
              </p>
              <div className="offer-cta-group">
                <a href="#book-ticket" className="discover-btn2">
                  Claim Offer &amp; Book
                </a>
                <button
                  type="button"
                  className="promo-copy-btn"
                  onClick={handleCopyPromo}
                >
                  <i className="fa-solid fa-ticket-simple"></i>{' '}
                  {copiedPromo ? 'Copied JETLY20!' : 'Copy Code: JETLY20'}
                </button>
              </div>
            </div>
            <div className="content-img">
              <img
                src="./assets/special-offer-one-bg-1.png"
                alt="Special Offer Luxury Jet"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Private Flights / Charter Legs Section */}
      <section id="charters" className="private-flight reveal-on-scroll">
        <div className="container3">
          <div className="private-flight-content">
            <p>
              <i className="fa-solid fa-plane-circle-check"></i> PRIVATE FLIGHTS
            </p>
            <h2>
              Browse legs <br />
              of our charters
            </h2>
            <h3>
              Take advantage of live empty-leg and scheduled private jet
              charters with instant live currency rates and immediate runway
              clearance.
            </h3>
            <div className="navigation">
              <button
                type="button"
                className="nav-arrow"
                onClick={handlePrevLegs}
                aria-label="Previous charter legs"
              >
                <img src="./assets/arrow-right-line copy.png" alt="Previous" />
              </button>
              <button
                type="button"
                className="nav-arrow"
                onClick={handleNextLegs}
                aria-label="Next charter legs"
              >
                <img src="./assets/arrow-right-line.png" alt="Next" />
              </button>
            </div>
          </div>

          <div className="plane-card">
            {visibleLegs.map((leg) => {
              const formattedRate = formatCurrencyPrice(
                leg.priceUsd,
                currency,
                exchangeInfo.rates
              );
              return (
                <div className="flight-card animated-leg-card" key={leg.id}>
                  <div className="plane-header">
                    <div className="leg-endpoint">
                      <small>Departure</small>
                      <strong>{leg.fromCity} ({leg.fromCode})</strong>
                    </div>
                    <img
                      src="./assets/plane-fill.png"
                      alt="Plane Icon"
                      className="header-plane-icon"
                    />
                    <div className="leg-endpoint">
                      <small>Arrival</small>
                      <strong>{leg.toCity} ({leg.toCode})</strong>
                    </div>
                  </div>
                  <div className="flight-card-content">
                    <img
                      src="./assets/plane.png"
                      alt={leg.aircraft}
                      className="leg-plane-illustration"
                    />
                    <span className="leg-aircraft-badge">{leg.aircraft}</span>
                    <span>Date : {leg.date}</span>
                    <span>
                      Departure : {leg.departure} • Arrival : {leg.arrival}
                    </span>
                    <span className="leg-price-highlight">
                      Starting From : <strong>{formattedRate}</strong>
                    </span>
                    <span>Passengers : {leg.persons}</span>
                    <button
                      type="button"
                      className="book-now"
                      onClick={() =>
                        onSelectRouteAndScroll({
                          fromCode: leg.fromCode,
                          fromCity: leg.fromCity,
                          toCode: leg.toCode,
                          toCity: leg.toCity,
                        })
                      }
                    >
                      Book Now <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Jet Charter Destinations Section */}
      <section id="destinations" className="get-section reveal-on-scroll">
        <div className="get-header">
          <p>
            <i className="fa-solid fa-earth-americas"></i> WHAT WILL YOU GET
          </p>
          <h2>
            Checkout the popular jet <br />
            Charter Destinations
          </h2>
        </div>
        <div className="get-card">
          {POPULAR_DESTINATIONS.map((dest, idx) => {
            const formattedDestPrice = formatCurrencyPrice(
              dest.priceUsd,
              currency,
              exchangeInfo.rates
            );
            const cardClass =
              idx === 0
                ? 'first-card'
                : idx === 1
                ? 'second-card'
                : 'third-card';
            return (
              <div
                className={`${cardClass} destination-card`}
                key={dest.id}
                onClick={() =>
                  onSelectRouteAndScroll({
                    fromCity: dest.fromCity,
                    toCity: dest.toCity,
                  })
                }
              >
                <div className="dest-img-container">
                  <img src={dest.img} alt={dest.title} />
                  <span className="dest-price-badge">
                    From {formattedDestPrice}
                  </span>
                </div>
                <div className="card-content">
                  <span className="dest-tag-pill">{dest.tag}</span>
                  <p>{dest.title}</p>
                  <span>
                    Departure: {dest.departure} • Arrival: {dest.arrival}
                  </span>
                  <button type="button" className="dest-book-link">
                    Select &amp; Book Route <i className="fa-solid fa-plane-up"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
