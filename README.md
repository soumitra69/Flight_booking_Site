# ✈️ Jetly — Luxury Private Jet & Live Flight Booking (React)

A modern, animated **React + Vite** flight booking and private charter web application. Features a **cinematic airplane sky-to-runway landing animation**, **scroll-reveal display animations**, **live multi-currency ticket booking powered by free public APIs**, interactive **VIP Boarding Pass / E-Ticket generation**, and a **comprehensive luxury footer**.

## 🌐 Live Website

🔗 **Live Demo:** [https://soumitra69.github.io/Flight_booking_Site/](https://soumitra69.github.io/Flight_booking_Site/)  
📦 **GitHub Repository:** [https://github.com/soumitra69/Flight_booking_Site.git](https://github.com/soumitra69/Flight_booking_Site.git)

---

## ✨ Key Features

- **🛫 Sky-to-Runway Airplane Landing Animation (`HeroSkyLanding.jsx`)**:
  - Watch the luxury flagship jet descend from 35,000 ft through animated sky clouds with wing contrails, LED landing headlight beams, perspective runway approach lights, and realistic tire-smoke touchdown puffs.
  - Interactive **Live Flight Telemetry HUD** (`ALT`, `SPD`, `RWY 09L`) with one-click **"Replay Sky Landing"** and **"Takeoff & Land"** controls.
- **🎟️ Live API Flight Ticket Booking & Rate Calculator (`FlightBookingSection.jsx`)**:
  - **Free Live Currency Exchange Rate API** (`https://open.er-api.com/v6/latest/USD`): Converts ticket prices in real time across `USD ($)`, `INR (₹)`, `EUR (€)`, `GBP (£)`, and `AED`.
  - **Free Global Airport/City Geocoding API** (`https://geocoding-api.open-meteo.com/v1/search`): Search any departure or arrival city worldwide with instant autocomplete.
  - **Free Live Aviation Destination Weather API** (`https://api.open-meteo.com/v1/forecast`): Displays live temperature, wind speed, and flying conditions at the destination airport.
  - **Dynamic Distance & Multi-Tier Ticket Pricing**: Calculates exact great-circle distance (km) and flight duration across 4 bookable tiers (*Executive Seat Share*, *Light Business Charter*, *Super Midsize Luxury Jet*, *Ultra-Long Range Flagship*) with promo code support (`JETLY20`).
  - **Interactive Boarding Pass & E-Ticket**: Animated flight takeoff-and-landing confirmation modal that generates a printable VIP Boarding Pass and saves tickets to **My Tickets**.
- **✨ Display & Scroll Animations**:
  - IntersectionObserver scroll-reveal transitions across all sections, animated flight radar trajectory, interactive charter leg carousel, and hover effects.
- **🏛️ Luxury Aviation Footer (`Footer.jsx`)**:
  - Animated runway strip divider, quick links, fleet categories, VIP Empty-Leg newsletter subscription, direct contact links, and a "Fly Back to Top" button.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 (Functional Components & Hooks)
- **Build Tool:** Vite 6
- **Animations:** Custom CSS3 Keyframes (3D Perspective Runway, Sky Descent, Contrails, Touchdown Smoke, Radar Flight Path) + IntersectionObserver Scroll Reveal
- **Free Public APIs:**
  - Open Exchange Rates API (`open.er-api.com`)
  - Open-Meteo Geocoding API (`geocoding-api.open-meteo.com`)
  - Open-Meteo Aviation Weather API (`api.open-meteo.com`)
- **Deployment:** GitHub Pages (`gh-pages`)

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/soumitra69/Flight_booking_Site.git
cd Flight_booking_Site

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Build for production
npm run build

# 5. Deploy to GitHub Pages
npm run deploy
```

---

## 👨‍💻 Author

**Soumitra Samanta**
- GitHub: [@soumitra69](https://github.com/soumitra69)
- Live Site: [https://soumitra69.github.io/Flight_booking_Site/](https://soumitra69.github.io/Flight_booking_Site/)
