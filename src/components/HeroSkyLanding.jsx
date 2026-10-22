import React, { useState, useEffect } from 'react';
import { HERO_FEATURES } from '../data/siteData';

export default function HeroSkyLanding({ landingTriggerKey }) {
  const [flightState, setFlightState] = useState('descending'); // 'descending' | 'touchdown' | 'landed' | 'takeoff'
  const [altitude, setAltitude] = useState(35000);
  const [speedKts, setSpeedKts] = useState(510);
  const [animCycle, setAnimCycle] = useState(0);

  const triggerSkyLanding = () => {
    setAnimCycle((c) => c + 1);
    setFlightState('descending');
    setAltitude(35000);
    setSpeedKts(510);
  };

  const triggerTakeoffAndLand = () => {
    setFlightState('takeoff');
    setAltitude(0);
    setSpeedKts(195);
    setTimeout(() => {
      triggerSkyLanding();
    }, 2400);
  };

  useEffect(() => {
    if (landingTriggerKey > 0) {
      triggerSkyLanding();
    }
  }, [landingTriggerKey]);

  useEffect(() => {
    if (flightState !== 'descending' && flightState !== 'touchdown') return;

    const startTime = Date.now();
    const duration = 3800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease out altitude & speed as airplane descends from sky and lands
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAlt = Math.max(0, Math.round(35000 * (1 - easeOut)));
      const currentSpeed =
        progress < 0.75
          ? Math.round(510 - 350 * (progress / 0.75))
          : Math.max(0, Math.round(160 * (1 - (progress - 0.75) / 0.25)));

      setAltitude(currentAlt);
      setSpeedKts(currentSpeed);

      if (progress >= 0.72 && progress < 0.98) {
        setFlightState('touchdown');
      } else if (progress >= 0.98) {
        setFlightState('landed');
        setAltitude(0);
        setSpeedKts(0);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [animCycle]);

  return (
    <>
      <section id="home" className="banner-section">
        {/* Animated Sky Clouds & Stars Layer */}
        <div className="sky-atmosphere" aria-hidden="true">
          <div className="sky-stars"></div>
          <div className="sky-cloud cloud-1"></div>
          <div className="sky-cloud cloud-2"></div>
          <div className="sky-cloud cloud-3"></div>
          <div className="sky-cloud cloud-4"></div>

          {/* High-Altitude Distant Jet Trajectory Arc across the Sky */}
          <svg
            className="sky-flight-arc"
            viewBox="0 0 1200 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-50 40 Q 450 -10, 600 280"
              stroke="rgba(196, 168, 46, 0.35)"
              strokeWidth="2.5"
              strokeDasharray="8 8"
            />
          </svg>
        </div>

        <div className="container hero-z">
          <div className="row">
            <div className="banner-content">
              {/* Live Flight Telemetry HUD Pill */}
              <div className={`telemetry-hud hud-${flightState}`}>
                <span className="hud-status-badge">
                  {flightState === 'descending' && (
                    <>
                      <i className="fa-solid fa-plane-arrival fa-bounce"></i> DESCENDING FROM SKY
                    </>
                  )}
                  {flightState === 'touchdown' && (
                    <>
                      <i className="fa-solid fa-dharmachakra fa-spin"></i> TOUCHDOWN ON RUNWAY
                    </>
                  )}
                  {flightState === 'landed' && (
                    <>
                      <i className="fa-solid fa-circle-check"></i> LANDED AT VIP TERMINAL
                    </>
                  )}
                  {flightState === 'takeoff' && (
                    <>
                      <i className="fa-solid fa-plane-departure"></i> CLIMBING TO SKY
                    </>
                  )}
                </span>
                <div className="hud-metrics">
                  <span>
                    ALT: <strong>{altitude.toLocaleString()} FT</strong>
                  </span>
                  <span className="hud-sep">|</span>
                  <span>
                    SPD: <strong>{speedKts} KTS</strong>
                  </span>
                  <span className="hud-sep">|</span>
                  <span>RWY: <strong>09L / VIP</strong></span>
                </div>
              </div>

              <span className="hero-tagline animate-fade-down">
                Save time and fly with comfort
              </span>
              <h2 className="hero-main-title animate-scale-up">
                Luxury Jet <br />
                Flights
              </h2>
              <p className="hero-subcopy">
                Watch our flagship jet descend from the sky &amp; book instant private charters with live API ticket rates.
              </p>

              <div className="banner-btns">
                <a className="banner-btn primary-btn" href="#book-ticket">
                  <i className="fa-solid fa-ticket"></i> Book Now
                </a>
                <button
                  type="button"
                  className="banner-btn secondary-btn landing-trigger-btn"
                  onClick={triggerSkyLanding}
                >
                  <i className="fa-solid fa-plane-arrival"></i> Replay Sky Landing
                </button>
                <button
                  type="button"
                  className="banner-btn outline-sky-btn"
                  onClick={triggerTakeoffAndLand}
                >
                  <i className="fa-solid fa-plane-up"></i> Takeoff &amp; Land
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plane Banner with Animated Runway & Sky-to-Land Jet */}
      <section className="plane-banner">
        {/* Animated Perspective Runway & Approach Lights */}
        <div className="runway-environment" aria-hidden="true">
          <div className="runway-strip">
            <div className="runway-centerline"></div>
            <div className="runway-edge-lights left-lights">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="runway-edge-lights right-lights">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div
              key={animCycle}
              className={`plane-img plane-anim-${flightState}`}
            >
              {/* Wing Contrails while descending from sky */}
              <div className="wing-contrail left-contrail"></div>
              <div className="wing-contrail right-contrail"></div>

              {/* Bright LED Landing Beams */}
              <div className="landing-light-beam left-beam"></div>
              <div className="landing-light-beam right-beam"></div>

              {/* Tire Touchdown Smoke Puffs when wheels hit runway */}
              <div className="touchdown-smoke-group">
                <span className="smoke-puff puff-1"></span>
                <span className="smoke-puff puff-2"></span>
                <span className="smoke-puff puff-3"></span>
                <span className="smoke-puff puff-4"></span>
              </div>

              <img
                src="./assets/image_2025_02_24T09_19_04_390Z.png"
                alt="Jetly Luxury Private Jet Landing from Sky"
                className="hero-jet-aircraft"
              />

              <div className="runway-shadow"></div>
            </div>
          </div>
        </div>

        <div className="container2">
          {HERO_FEATURES.map((feat, idx) => (
            <div
              className="box1 feature-card-animated"
              key={feat.id}
              style={{ animationDelay: `${0.15 * idx}s` }}
            >
              <div className="icon">
                <img src={feat.icon} alt={feat.title} />
              </div>
              <div className="box1-title">{feat.title}</div>
              <p className="box1-sub">{feat.subtitle}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
