import React, { useState } from 'react';
import { SERVICES_LIST } from '../data/siteData';
import { formatCurrencyPrice } from '../services/flightApi';

export default function ServicesSection({ currency, exchangeInfo }) {
  const [activeService, setActiveService] = useState(null);

  return (
    <section id="services" className="services-section reveal-on-scroll">
      <div className="container">
        <h2 className="service-header">
          <i className="fa-solid fa-jet-fighter-up"></i> What We're Offering
        </h2>
        <h1 className="service-header-h2">
          Select the service <br /> according to your work
        </h1>
        <div className="row">
          <div className="services">
            {SERVICES_LIST.map((srv) => {
              const priceStr = formatCurrencyPrice(
                srv.startingUsd,
                currency,
                exchangeInfo.rates
              );
              return (
                <div
                  className="service service-animated-card"
                  key={srv.id}
                  onClick={() => setActiveService(srv)}
                >
                  <div className="service-img-wrap">
                    <img
                      src={srv.img}
                      alt={srv.title}
                      onError={(e) => {
                        e.currentTarget.src = srv.fallbackImg;
                      }}
                    />
                    <span className="service-speed-pill">{srv.speed}</span>
                  </div>
                  <div className="service-content">
                    <span>{srv.tag}</span>
                    <h3>{srv.title}</h3>
                    <p>{srv.desc}</p>
                    <div className="service-card-meta">
                      <small>From <strong>{priceStr}</strong> / leg</small>
                      <small>{srv.capacity}</small>
                    </div>
                    <a
                      href="#book-ticket"
                      className="arrow"
                      title={`Book ${srv.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      &gt;
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {activeService && (
          <div className="service-detail-banner animate-scale-up">
            <div>
              <span className="detail-kicker">{activeService.tag} • {activeService.speed}</span>
              <h4>{activeService.title} — {activeService.capacity}</h4>
              <p>{activeService.desc}</p>
            </div>
            <div className="service-detail-actions">
              <a href="#book-ticket" className="banner-btn primary-btn">
                Book {activeService.title} Now
              </a>
              <button
                type="button"
                className="detail-close-btn"
                onClick={() => setActiveService(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bac-col row">
        <div className="bac-col-inner">
          <div className="bac-stat">
            <i className="fa-solid fa-shield-halved"></i>
            <span>100% ARGUS Platinum Safety Rating</span>
          </div>
          <div className="bac-stat">
            <i className="fa-solid fa-bolt"></i>
            <span>15-Minute VIP Terminal Boarding</span>
          </div>
          <div className="bac-stat">
            <i className="fa-solid fa-globe"></i>
            <span>Live Multi-Currency API Ticket Pricing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
