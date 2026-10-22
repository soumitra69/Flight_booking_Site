import React, { useState, useEffect } from 'react';
import {
  POPULAR_AIRPORTS,
  CURRENCY_META,
  searchLocationsApi,
  fetchDestinationWeather,
  generateFlightOffers,
  formatCurrencyPrice,
} from '../services/flightApi';

export default function FlightBookingSection({
  currency,
  setCurrency,
  exchangeInfo,
  prefilledRoute,
  onBookingConfirmed,
}) {
  const tomorrowStr = new Date(Date.now() + 86400000 * 2)
    .toISOString()
    .split('T')[0];

  const [origin, setOrigin] = useState(POPULAR_AIRPORTS[0]); // New Delhi (DEL)
  const [destination, setDestination] = useState(POPULAR_AIRPORTS[4]); // Dubai (DXB)
  const [originQuery, setOriginQuery] = useState('New Delhi (DEL)');
  const [destQuery, setDestQuery] = useState('Dubai (DXB)');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showOriginDrop, setShowOriginDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);

  const [departureDate, setDepartureDate] = useState(tomorrowStr);
  const [returnDate, setReturnDate] = useState('');
  const [baggage, setBaggage] = useState('medium');
  const [passengers, setPassengers] = useState(2);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const [destWeather, setDestWeather] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('jet-seat-share');

  // Booking animation & boarding pass state
  const [isLandingAnim, setIsLandingAnim] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Sync if user clicked "Book Now" on a Charter Leg or Destination card elsewhere on the page
  useEffect(() => {
    if (prefilledRoute) {
      const foundOrigin =
        POPULAR_AIRPORTS.find(
          (a) =>
            a.city.toLowerCase() === prefilledRoute.fromCity?.toLowerCase() ||
            a.code === prefilledRoute.fromCode
        ) || POPULAR_AIRPORTS[0];

      const foundDest =
        POPULAR_AIRPORTS.find(
          (a) =>
            a.city.toLowerCase() === prefilledRoute.toCity?.toLowerCase() ||
            a.code === prefilledRoute.toCode
        ) || POPULAR_AIRPORTS[4];

      setOrigin(foundOrigin);
      setDestination(foundDest);
      setOriginQuery(`${foundOrigin.city} (${foundOrigin.code})`);
      setDestQuery(`${foundDest.city} (${foundDest.code})`);
      setConfirmedTicket(null);
    }
  }, [prefilledRoute]);

  // Fetch live destination weather and calculate live offers whenever route/pax/baggage changes
  useEffect(() => {
    let active = true;
    async function loadLiveFlightData() {
      setLoadingApi(true);
      const calculatedOffers = generateFlightOffers({
        origin,
        destination,
        passengers,
        baggage,
        date: departureDate,
      });
      if (active) {
        setOffers(calculatedOffers);
      }

      const weather = await fetchDestinationWeather(
        destination.lat,
        destination.lon
      );
      if (active) {
        setDestWeather(weather);
        setLoadingApi(false);
      }
    }
    loadLiveFlightData();
    return () => {
      active = false;
    };
  }, [origin, destination, passengers, baggage, departureDate]);

  // Handle origin autocomplete with free Open-Meteo Geocoding API
  const handleOriginInput = async (val) => {
    setOriginQuery(val);
    setShowOriginDrop(true);
    const results = await searchLocationsApi(val);
    setOriginSuggestions(results);
  };

  // Handle destination autocomplete with free Open-Meteo Geocoding API
  const handleDestInput = async (val) => {
    setDestQuery(val);
    setShowDestDrop(true);
    const results = await searchLocationsApi(val);
    setDestSuggestions(results);
  };

  const selectOriginAirport = (loc) => {
    setOrigin(loc);
    setOriginQuery(`${loc.city} (${loc.code})`);
    setShowOriginDrop(false);
  };

  const selectDestAirport = (loc) => {
    setDestination(loc);
    setDestQuery(`${loc.city} (${loc.code})`);
    setShowDestDrop(false);
  };

  const swapRoute = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    setOriginQuery(`${destination.city} (${destination.code})`);
    setDestQuery(`${tempOrigin.city} (${tempOrigin.code})`);
  };

  const selectedOffer =
    offers.find((o) => o.id === selectedOfferId) || offers[0];

  const isPromoValid = promoCode.trim().toUpperCase() === 'JETLY20';
  const discountMultiplier = isPromoValid ? 0.8 : 1;

  const handleBookTicket = (e, offerToBook = selectedOffer) => {
    if (e) e.preventDefault();
    if (!offerToBook) return;

    setIsLandingAnim(true);
    setConfirmedTicket(null);

    const finalUsd = Math.round(offerToBook.baseUsd * discountMultiplier);
    const finalFormattedPrice = formatCurrencyPrice(
      finalUsd,
      currency,
      exchangeInfo.rates
    );

    const newTicket = {
      pnr: 'JTL-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      passengerName: passengerName.trim() || 'VIP Charter Guest',
      passengerEmail: passengerEmail.trim() || 'vip@jetly-aviation.com',
      origin: offerToBook.origin,
      destination: offerToBook.destination,
      date: departureDate || tomorrowStr,
      returnDate: returnDate || 'One-Way Charter',
      departureTime: offerToBook.departureTime,
      durationText: offerToBook.durationText,
      distanceKm: offerToBook.distanceKm,
      aircraft: offerToBook.aircraft,
      tierName: offerToBook.tierName,
      passengers,
      baggage: baggage.toUpperCase(),
      gate: 'VIP-0' + (Math.floor(Math.random() * 4) + 1),
      seat: passengers > 1 ? `1A - ${passengers}A (VIP Suite)` : '1A (Window Suite)',
      priceFormatted: finalFormattedPrice,
      currency,
      weather: destWeather,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTimeout(() => {
      setIsLandingAnim(false);
      setConfirmedTicket(newTicket);
      if (onBookingConfirmed) {
        onBookingConfirmed(newTicket);
      }
    }, 2200);
  };

  return (
    <section id="book-ticket" className="form-section reveal-on-scroll">
      <div className="container5">
        <div className="booking-top-bar">
          <div>
            <span className="booking-kicker">
              <i className="fa-solid fa-satellite-dish"></i> Get Your Flight • Live API Rate Engine
            </span>
            <h3>Book Flight Ticket &amp; Private Charter</h3>
          </div>

          {/* Live API Status & Currency Strip */}
          <div className="api-status-card">
            <div className="api-pill">
              <span className="pulse-green"></span>
              <span>
                Free API Live Rates: <strong>1 USD = {exchangeInfo.rates[currency]?.toFixed(2)} {currency}</strong>
              </span>
            </div>
            <div className="currency-pills">
              {Object.keys(CURRENCY_META).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`curr-chip ${currency === code ? 'active' : ''}`}
                  onClick={() => setCurrency(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Live Flight Route Radar Display */}
        <div className="live-flight-radar-banner">
          <div className="radar-endpoint">
            <span className="endpoint-label">DEPARTURE</span>
            <strong className="endpoint-code">{origin.code}</strong>
            <span className="endpoint-city">{origin.city}, {origin.country}</span>
          </div>

          <div className="radar-flight-track">
            <div className="track-metrics-top">
              <span>
                <i className="fa-solid fa-route"></i> {selectedOffer?.distanceKm?.toLocaleString() || 2200} km
              </span>
              <span>
                <i className="fa-regular fa-clock"></i> Est. {selectedOffer?.durationText || '2h 45m'}
              </span>
              {destWeather && (
                <span className="weather-chip">
                  <i className="fa-solid fa-cloud-sun"></i> {destination.city}: {destWeather.tempC}°C ({destWeather.condition})
                </span>
              )}
            </div>

            <div className="animated-sky-track">
              <span className="track-dot origin-dot"></span>
              <div className="track-dashed-line">
                <div className="flying-radar-plane">
                  <i className="fa-solid fa-plane"></i>
                </div>
              </div>
              <span className="track-dot dest-dot">
                <i className="fa-solid fa-location-dot"></i>
              </span>
            </div>
          </div>

          <div className="radar-endpoint right-endpoint">
            <span className="endpoint-label">ARRIVAL &amp; LANDING</span>
            <strong className="endpoint-code">{destination.code}</strong>
            <span className="endpoint-city">{destination.city}, {destination.country}</span>
          </div>
        </div>

        {/* Quick Popular Route Buttons */}
        <div className="quick-routes-bar">
          <span className="quick-label">Popular Instant Routes:</span>
          {[
            { from: POPULAR_AIRPORTS[0], to: POPULAR_AIRPORTS[4], label: 'Delhi ✈ Dubai' },
            { from: POPULAR_AIRPORTS[0], to: POPULAR_AIRPORTS[1], label: 'Delhi ✈ Mumbai' },
            { from: POPULAR_AIRPORTS[6], to: POPULAR_AIRPORTS[7], label: 'Paris ✈ Barcelona' },
            { from: POPULAR_AIRPORTS[5], to: POPULAR_AIRPORTS[8], label: 'London ✈ New York' },
            { from: POPULAR_AIRPORTS[2], to: POPULAR_AIRPORTS[10], label: 'Kolkata ✈ Singapore' },
          ].map((r, i) => (
            <button
              key={i}
              type="button"
              className="quick-route-chip"
              onClick={() => {
                selectOriginAirport(r.from);
                selectDestAirport(r.to);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search & Passenger Form */}
        <form className="booking-form-grid" onSubmit={(e) => handleBookTicket(e, selectedOffer)}>
          <div className="row">
            <div>
              {/* Fly From with Live API Autocomplete */}
              <div className="autocomplete-field">
                <label className="field-label" htmlFor="source">
                  <i className="fa-solid fa-plane-departure"></i> Fly From (City or Airport)
                </label>
                <div className="input-with-swap">
                  <input
                    type="text"
                    name="source"
                    id="source"
                    value={originQuery}
                    onChange={(e) => handleOriginInput(e.target.value)}
                    onFocus={() => {
                      setOriginSuggestions(POPULAR_AIRPORTS.slice(0, 6));
                      setShowOriginDrop(true);
                    }}
                    onBlur={() => setTimeout(() => setShowOriginDrop(false), 200)}
                    placeholder="Fly from (e.g. New Delhi, London, Paris)"
                    required
                  />
                  <button
                    type="button"
                    className="swap-route-btn"
                    onClick={swapRoute}
                    title="Swap Origin & Destination"
                  >
                    <i className="fa-solid fa-right-left"></i>
                  </button>
                </div>
                {showOriginDrop && originSuggestions.length > 0 && (
                  <ul className="airport-dropdown">
                    {originSuggestions.map((loc, idx) => (
                      <li
                        key={`${loc.code}-${idx}`}
                        onMouseDown={() => selectOriginAirport(loc)}
                      >
                        <div>
                          <strong>{loc.city}</strong> ({loc.code})
                          <span className="dropdown-sub">{loc.name}</span>
                        </div>
                        <span className="country-tag">{loc.country}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Departure Date */}
              <div>
                <label className="field-label" htmlFor="dep-date">
                  <i className="fa-regular fa-calendar-days"></i> Departure Date
                </label>
                <input
                  id="dep-date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>

              {/* Baggage Select */}
              <div>
                <label className="field-label" htmlFor="luggage-type">
                  <i className="fa-solid fa-suitcase-rolling"></i> Baggage Allowance
                </label>
                <select
                  name="luggage-type"
                  id="luggage-type"
                  value={baggage}
                  onChange={(e) => setBaggage(e.target.value)}
                >
                  <option value="light">Light Baggage (15 kg Cabin)</option>
                  <option value="medium">Medium Baggage (30 kg Standard +7%)</option>
                  <option value="heavy">Heavy VIP Trunk (60 kg + Golf/Ski +15%)</option>
                </select>
              </div>

              {/* Passenger Name */}
              <div>
                <label className="field-label" htmlFor="pax-name">
                  <i className="fa-regular fa-user"></i> Lead Passenger Name
                </label>
                <input
                  id="pax-name"
                  type="text"
                  placeholder="Enter your full name for E-Ticket"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                />
              </div>
            </div>

            <div>
              {/* Fly To with Live API Autocomplete */}
              <div className="autocomplete-field">
                <label className="field-label" htmlFor="dest">
                  <i className="fa-solid fa-plane-arrival"></i> Fly To (City or Airport)
                </label>
                <input
                  type="text"
                  name="dest"
                  id="dest"
                  value={destQuery}
                  onChange={(e) => handleDestInput(e.target.value)}
                  onFocus={() => {
                    setDestSuggestions(POPULAR_AIRPORTS.slice(0, 6));
                    setShowDestDrop(true);
                  }}
                  onBlur={() => setTimeout(() => setShowDestDrop(false), 200)}
                  placeholder="Fly to (e.g. Dubai, Mumbai, Barcelona)"
                  required
                />
                {showDestDrop && destSuggestions.length > 0 && (
                  <ul className="airport-dropdown">
                    {destSuggestions.map((loc, idx) => (
                      <li
                        key={`${loc.code}-${idx}`}
                        onMouseDown={() => selectDestAirport(loc)}
                      >
                        <div>
                          <strong>{loc.city}</strong> ({loc.code})
                          <span className="dropdown-sub">{loc.name}</span>
                        </div>
                        <span className="country-tag">{loc.country}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Return Date & Passengers */}
              <div className="date-passenger">
                <div style={{ flex: 1 }}>
                  <label className="field-label" htmlFor="ret-date">
                    <i className="fa-regular fa-calendar-check"></i> Return (Optional)
                  </label>
                  <input
                    type="date"
                    id="ret-date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label" htmlFor="pass-count">
                    <i className="fa-solid fa-users"></i> Passengers
                  </label>
                  <select
                    name="pass-count"
                    id="pass-count"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Promo Code & Email */}
              <div className="date-passenger">
                <div style={{ flex: 1 }}>
                  <label className="field-label" htmlFor="pax-email">
                    <i className="fa-regular fa-envelope"></i> Email for E-Ticket
                  </label>
                  <input
                    id="pax-email"
                    type="email"
                    placeholder="you@example.com"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label" htmlFor="promo-code">
                    <i className="fa-solid fa-tag"></i> Promo (Try: JETLY20)
                  </label>
                  <input
                    id="promo-code"
                    type="text"
                    placeholder="Enter JETLY20 for 20% off"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit / Instant Book CTA */}
              <div className="submit-cta-wrap">
                <button type="submit" className="submit book-submit-btn">
                  <i className="fa-solid fa-plane-circle-check"></i> Book Selected Ticket (
                  {selectedOffer
                    ? formatCurrencyPrice(
                        Math.round(selectedOffer.baseUsd * discountMultiplier),
                        currency,
                        exchangeInfo.rates
                      )
                    : '...'}
                  )
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Live API Calculated Ticket Rate Cards */}
        <div className="live-offers-header">
          <h4>
            <i className="fa-solid fa-bolt"></i> Live Available Flights &amp; Ticket Rates ({origin.city} → {destination.city})
          </h4>
          {loadingApi && (
            <span className="sync-spinner">
              <i className="fa-solid fa-rotate fa-spin"></i> Syncing Live Aviation &amp; Rate API...
            </span>
          )}
        </div>

        <div className="live-offers-grid">
          {offers.map((offer) => {
            const isSelected = offer.id === selectedOfferId;
            const discountedUsd = Math.round(offer.baseUsd * discountMultiplier);
            const totalFormatted = formatCurrencyPrice(
              discountedUsd,
              currency,
              exchangeInfo.rates
            );
            const perPaxFormatted = formatCurrencyPrice(
              Math.round(offer.perPersonUsd * discountMultiplier),
              currency,
              exchangeInfo.rates
            );

            return (
              <div
                key={offer.id}
                className={`live-offer-card ${isSelected ? 'selected-offer' : ''}`}
                onClick={() => setSelectedOfferId(offer.id)}
              >
                <div className="offer-card-top">
                  <span className="offer-badge">{offer.badge}</span>
                  <span className="offer-dep-time">
                    <i className="fa-regular fa-clock"></i> Departs {offer.departureTime}
                  </span>
                </div>

                <div className="offer-aircraft-row">
                  <img src={offer.image} alt={offer.aircraft} className="offer-mini-plane" />
                  <div>
                    <h5>{offer.tierName}</h5>
                    <p className="aircraft-model">{offer.aircraft} • {offer.durationText}</p>
                  </div>
                </div>

                <ul className="offer-features-list">
                  {offer.cabinFeatures.map((feat, idx) => (
                    <li key={idx}>
                      <i className="fa-solid fa-check"></i> {feat}
                    </li>
                  ))}
                </ul>

                <div className="offer-price-footer">
                  <div>
                    <span className="pricing-type-label">{offer.pricingType}</span>
                    <div className="offer-total-price">{totalFormatted}</div>
                    <span className="per-person-sub">
                      ~{perPaxFormatted} / passenger {isPromoValid && ' (20% Promo Applied!)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="book-tier-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOfferId(offer.id);
                      handleBookTicket(null, offer);
                    }}
                  >
                    Book Ticket <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Sky Takeoff-to-Landing Overlay when booking a ticket */}
        {isLandingAnim && (
          <div className="booking-sky-animation-modal">
            <div className="sky-anim-box">
              <div className="sky-anim-clouds"></div>
              <div className="anim-plane-landing-track">
                <div className="anim-Origin-tag">{origin.code}</div>
                <div className="anim-jet-wrapper">
                  <img
                    src="./assets/image_2025_02_24T09_19_04_390Z.png"
                    alt="Jet Flying and Landing"
                  />
                </div>
                <div className="anim-Dest-tag">
                  <i className="fa-solid fa-location-dot"></i> {destination.code} Runway
                </div>
              </div>
              <h4>✈️ Flying from {origin.city} &amp; Landing in {destination.city}...</h4>
              <p>Locking live API exchange rate ({currency}) &amp; generating your VIP Boarding Pass...</p>
            </div>
          </div>
        )}

        {/* Confirmed Interactive Boarding Pass E-Ticket */}
        {confirmedTicket && (
          <div className="boarding-pass-showcase animate-scale-up">
            <div className="boarding-pass-header">
              <div>
                <span className="bp-verified">
                  <i className="fa-solid fa-circle-check"></i> CONFIRMED VIP E-TICKET • LANDING SLOT RESERVED
                </span>
                <h4>Jetly Private Aviation Boarding Pass</h4>
              </div>
              <div className="bp-actions">
                <button
                  type="button"
                  className="bp-print-btn"
                  onClick={() => window.print()}
                >
                  <i className="fa-solid fa-print"></i> Print / Save PDF
                </button>
                <button
                  type="button"
                  className="bp-close-btn"
                  onClick={() => setConfirmedTicket(null)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="boarding-pass-body">
              <div className="bp-main-section">
                <div className="bp-route-row">
                  <div className="bp-city">
                    <span className="bp-code">{confirmedTicket.origin.code}</span>
                    <strong>{confirmedTicket.origin.city}</strong>
                    <small>{confirmedTicket.origin.name}</small>
                  </div>

                  <div className="bp-flight-graphic">
                    <span className="bp-duration">{confirmedTicket.durationText} • {confirmedTicket.distanceKm} km</span>
                    <div className="bp-plane-line">
                      <i className="fa-solid fa-plane"></i>
                    </div>
                    <span className="bp-aircraft-pill">{confirmedTicket.aircraft}</span>
                  </div>

                  <div className="bp-city right">
                    <span className="bp-code">{confirmedTicket.destination.code}</span>
                    <strong>{confirmedTicket.destination.city}</strong>
                    <small>{confirmedTicket.destination.name}</small>
                  </div>
                </div>

                <div className="bp-details-grid">
                  <div>
                    <span>PASSENGER</span>
                    <strong>{confirmedTicket.passengerName}</strong>
                  </div>
                  <div>
                    <span>DATE &amp; TIME</span>
                    <strong>{confirmedTicket.date} • {confirmedTicket.departureTime}</strong>
                  </div>
                  <div>
                    <span>CLASS / TIER</span>
                    <strong>{confirmedTicket.tierName}</strong>
                  </div>
                  <div>
                    <span>GATE &amp; SEAT</span>
                    <strong>{confirmedTicket.gate} • {confirmedTicket.seat}</strong>
                  </div>
                  <div>
                    <span>BAGGAGE &amp; PAX</span>
                    <strong>{confirmedTicket.passengers} Pax • {confirmedTicket.baggage}</strong>
                  </div>
                  <div>
                    <span>DESTINATION WEATHER</span>
                    <strong>
                      {confirmedTicket.weather
                        ? `${confirmedTicket.weather.tempC}°C, Wind ${confirmedTicket.weather.windSpeedKmh} km/h`
                        : 'Clear Sky'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bp-stub-section">
                <span className="bp-pnr-label">BOOKING PNR</span>
                <strong className="bp-pnr-code">{confirmedTicket.pnr}</strong>
                <div className="bp-price-box">
                  <span>TOTAL LIVE RATE</span>
                  <strong>{confirmedTicket.priceFormatted}</strong>
                </div>
                <div className="bp-barcode" aria-hidden="true">
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <small>Ready for VIP Tarmac Boarding</small>
              </div>
            </div>
          </div>
        )}

        <p className="from-about">
          * Live flight rates fetched via Open Exchange Rate API &amp; Open-Meteo Aviation Weather API. Instant E-Ticket issued upon booking.
        </p>
      </div>
    </section>
  );
}
