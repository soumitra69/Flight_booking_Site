import React from 'react';

export default function AboutSection() {
  return (
    <>
      <section id="about" className="about-section reveal-on-scroll">
        <div className="container3">
          <div className="content">
            <h4 className="subtitle">
              <i className="fa-solid fa-plane-up"></i> GET TO KNOW US
            </h4>
            <h1 className="title">
              Our Jetly saves your time <br /> and gives you comfort <br />
              in flights
            </h1>
            <p className="description">
              Experience seamless private aviation tailored around your schedule.
              Whether you are flying for high-stakes executive meetings or a
              private island retreat, Jetly connects you to over 5,000 global
              airfields with zero commercial delays and live transparent ticket
              rates.
            </p>
            <ul className="benefits">
              <li>
                <span className="check-badge">✔️</span> Depart within 15 minutes from private VIP lounges worldwide.
              </li>
              <li>
                <span className="check-badge">✔️</span> Real-time API flight rate calculation &amp; instant e-ticket confirmation.
              </li>
            </ul>

            <div className="stats-strip">
              <div className="stat-item">
                <strong>280+</strong>
                <span>Luxury Aircraft</span>
              </div>
              <div className="stat-item">
                <strong>150+</strong>
                <span>Countries Reached</span>
              </div>
              <div className="stat-item">
                <strong>99.9%</strong>
                <span>On-Time Landings</span>
              </div>
            </div>

            <div className="button-container">
              <a href="#book-ticket" className="discover-btn">
                DISCOVER &amp; BOOK
              </a>
              <span className="call-text">
                <b>📞 CALL ANYTIME</b>
                <br />
                <a href="tel:+9288006780" className="about-phone-link">
                  +92 ( 8800 ) - 6780
                </a>
              </span>
            </div>
          </div>

          <div className="about-img">
            <div className="about-img-wrapper">
              <img
                src="./assets/about-one-img-1.png"
                alt="Jetly Luxury Cabin Experience"
              />
              <div className="floating-experience-badge">
                <i className="fa-solid fa-award"></i>
                <div>
                  <strong>18+ Years</strong>
                  <span>Aviation Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-gallery-section reveal-on-scroll">
        <div className="container4">
          <div className="box2 feature-banner-card">
            <img
              src="./assets/feature-two-shape-1.png"
              alt="Jetly Exclusive Feature"
            />
            <div className="feature-overlay-info">
              <span>VIP CONCIERGE</span>
              <h4>Personalized Flight Planning</h4>
            </div>
          </div>
          <div className="box2 feature-banner-card">
            <img
              src="./assets/pexels-rodnae-productions-5778716.png"
              alt="Executive Boarding"
            />
            <div className="feature-overlay-info">
              <span>DIRECT TARMAC ACCESS</span>
              <h4>Chauffeur to Aircraft Steps</h4>
            </div>
          </div>
          <div className="box2 feature-banner-card">
            <img
              src="./assets/feature-two-1-3.png"
              alt="Luxury Cabin Comfort"
            />
            <div className="feature-overlay-info">
              <span>SKY SUITE COMFORT</span>
              <h4>High-Speed Starlink Cabin</h4>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
