// Free Public APIs used (No API Key Required, CORS-enabled):
// 1. Open Exchange Rates API: https://open.er-api.com/v6/latest/USD
// 2. Open-Meteo Geocoding API: https://geocoding-api.open-meteo.com/v1/search
// 3. Open-Meteo Aviation Weather API: https://api.open-meteo.com/v1/forecast

export const POPULAR_AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi Intl', lat: 28.5562, lon: 77.1000 },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Intl', lat: 19.0896, lon: 72.8656 },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhas Chandra Bose Intl', lat: 22.6547, lon: 88.4467 },
  { code: 'BLR', city: 'Bengaluru', country: 'India', name: 'Kempegowda Intl', lat: 13.1986, lon: 77.7066 },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai Al Maktoum VIP Terminal', lat: 25.2532, lon: 55.3657 },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'London Farnborough / Heathrow', lat: 51.4700, lon: -0.4543 },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Paris Le Bourget / CDG', lat: 48.9694, lon: 2.4414 },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', name: 'Josep Tarradellas Barcelona-El Prat', lat: 41.2974, lon: 2.0833 },
  { code: 'JFK', city: 'New York', country: 'USA', name: 'Teterboro / JFK International', lat: 40.6413, lon: -73.7781 },
  { code: 'MIA', city: 'Miami', country: 'USA', name: 'Miami Opa-Locka Executive', lat: 25.7959, lon: -80.2870 },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Seletar / Changi VIP Jet', lat: 1.3644, lon: 103.9915 },
  { code: 'HND', city: 'Tokyo', country: 'Japan', name: 'Tokyo Haneda Premier', lat: 35.5494, lon: 139.7798 },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', name: 'Zurich Kloten VIP', lat: 47.4582, lon: 8.5555 },
  { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International Atoll', lat: 4.1918, lon: 73.5291 },
];

export const CURRENCY_META = {
  USD: { symbol: '$', label: 'USD ($)', name: 'US Dollar' },
  INR: { symbol: '₹', label: 'INR (₹)', name: 'Indian Rupee' },
  EUR: { symbol: '€', label: 'EUR (€)', name: 'Euro' },
  GBP: { symbol: '£', label: 'GBP (£)', name: 'British Pound' },
  AED: { symbol: 'AED ', label: 'AED (د.إ)', name: 'UAE Dirham' },
};

const FALLBACK_RATES = {
  USD: 1,
  INR: 84.15,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
};

/**
 * Fetches live currency exchange rates from free Open Exchange Rates API
 */
export async function fetchLiveExchangeRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('Exchange API response not ok');
    const data = await res.json();
    if (data && data.rates) {
      return {
        rates: {
          USD: 1,
          INR: data.rates.INR || FALLBACK_RATES.INR,
          EUR: data.rates.EUR || FALLBACK_RATES.EUR,
          GBP: data.rates.GBP || FALLBACK_RATES.GBP,
          AED: data.rates.AED || FALLBACK_RATES.AED,
        },
        lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
        isLive: true,
        provider: 'open.er-api.com',
      };
    }
  } catch (err) {
    console.warn('Using fallback exchange rates:', err);
  }
  return {
    rates: FALLBACK_RATES,
    lastUpdated: new Date().toUTCString(),
    isLive: false,
    provider: 'Fallback Cache',
  };
}

/**
 * Searches global cities/airports using free Open-Meteo Geocoding API + local airport matches
 */
export async function searchLocationsApi(query) {
  if (!query || query.trim().length < 2) {
    return POPULAR_AIRPORTS.slice(0, 6);
  }
  const q = query.trim().toLowerCase();
  const localMatches = POPULAR_AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
  );

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        const apiLocations = data.results.map((item) => {
          const existing = POPULAR_AIRPORTS.find(
            (a) => a.city.toLowerCase() === item.name.toLowerCase()
          );
          const code =
            existing?.code ||
            item.name
              .replace(/[^a-zA-Z]/g, '')
              .slice(0, 3)
              .toUpperCase();
          return {
            code,
            city: item.name,
            country: item.country || item.admin1 || 'International',
            name: existing?.name || `${item.name} International Airport`,
            lat: item.latitude,
            lon: item.longitude,
            fromApi: true,
          };
        });

        const merged = [...localMatches];
        for (const loc of apiLocations) {
          if (!merged.some((m) => m.city.toLowerCase() === loc.city.toLowerCase())) {
            merged.push(loc);
          }
        }
        return merged.slice(0, 6);
      }
    }
  } catch (err) {
    console.warn('Geocoding lookup fallback to local:', err);
  }

  return localMatches.length > 0 ? localMatches : POPULAR_AIRPORTS.slice(0, 5);
}

/**
 * Fetches live aviation weather at destination coordinates from free Open-Meteo API
 */
export async function fetchDestinationWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();
    if (data && data.current_weather) {
      const cw = data.current_weather;
      return {
        tempC: Math.round(cw.temperature),
        windSpeedKmh: Math.round(cw.windspeed),
        weatherCode: cw.weathercode,
        condition: getWeatherDescription(cw.weathercode),
        isDay: cw.is_day === 1,
        isLive: true,
      };
    }
  } catch (err) {
    console.warn('Weather fallback:', err);
  }
  return {
    tempC: 24,
    windSpeedKmh: 14,
    weatherCode: 1,
    condition: 'Clear Sky — Optimal Flying Conditions',
    isDay: true,
    isLive: false,
  };
}

function getWeatherDescription(code) {
  if (code === 0) return 'Clear Sky • CAVOK';
  if (code <= 3) return 'Partly Cloudy • Good Visibility';
  if (code <= 49) return 'Light Mist • IFR Ready';
  if (code <= 69) return 'Light Rain • Smooth Cruise Above Clouds';
  if (code <= 79) return 'Snow Showers • De-icing Active';
  return 'Scattered Clouds • VFR/IFR Active';
}

/**
 * Calculates great-circle distance in km between two coordinates (Haversine formula)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c);
  return Math.max(dist, 350); // minimum regional leg 350 km
}

/**
 * Generates live flight options & ticket rates based on route distance, passengers, and baggage
 */
export function generateFlightOffers({
  origin,
  destination,
  passengers = 1,
  baggage = 'light',
  date,
}) {
  const distanceKm = calculateDistanceKm(
    origin.lat,
    origin.lon,
    destination.lat,
    destination.lon
  );

  const baggageMultiplier =
    baggage === 'heavy' ? 1.15 : baggage === 'medium' ? 1.07 : 1.0;

  const paxCount = Math.max(1, Number(passengers) || 1);

  const tiers = [
    {
      id: 'jet-seat-share',
      tierName: 'Jetly Executive Seat (Shared Jet)',
      aircraft: 'Embraer Praetor 600 VIP',
      badge: 'MOST POPULAR TICKET',
      speedKmh: 820,
      pricingType: 'Per Passenger Ticket',
      baseUsd: Math.round((240 + distanceKm * 0.24) * paxCount * baggageMultiplier),
      perPersonUsd: Math.round((240 + distanceKm * 0.24) * baggageMultiplier),
      departureTime: '09:30 AM',
      cabinFeatures: ['VIP Lounge Access', 'Lie-Flat Leather Seat', 'Starlink High-Speed Wi-Fi', 'Gourmet Dining'],
      seatsAvailable: 6,
      image: './assets/plane.png',
    },
    {
      id: 'light-business-jet',
      tierName: 'Light Business Charter',
      aircraft: 'Cessna Citation CJ4 Gen2',
      badge: 'FAST REGIONAL JET',
      speedKmh: 835,
      pricingType: `Private Cabin (Up to ${Math.max(paxCount, 6)} Pax)`,
      baseUsd: Math.round((1450 + distanceKm * 0.85) * baggageMultiplier),
      perPersonUsd: Math.round(((1450 + distanceKm * 0.85) * baggageMultiplier) / paxCount),
      departureTime: '12:15 PM',
      cabinFeatures: ['Private Terminal Boarding in 15m', 'Full Cabin Privacy', 'Custom Flight Schedule', 'Chauffeur Tarmac Transfer'],
      seatsAvailable: 7,
      image: './assets/plane.png',
    },
    {
      id: 'super-midsize-charter',
      tierName: 'Super Midsize Luxury Jet',
      aircraft: 'Bombardier Challenger 3500',
      badge: 'BUSINESS FAVORITE',
      speedKmh: 870,
      pricingType: `Private Cabin (Up to ${Math.max(paxCount, 9)} Pax)`,
      baseUsd: Math.round((2350 + distanceKm * 1.18) * baggageMultiplier),
      perPersonUsd: Math.round(((2350 + distanceKm * 1.18) * baggageMultiplier) / paxCount),
      departureTime: '04:45 PM',
      cabinFeatures: ['Stand-Up Flat Floor Cabin', 'Voice-Controlled Suite', 'Zero-Gravity Nuage Seats', 'Dedicated Flight Attendant'],
      seatsAvailable: 9,
      image: './assets/plane.png',
    },
    {
      id: 'ultra-long-vip',
      tierName: 'Ultra-Long Range Flagship',
      aircraft: 'Gulfstream G650ER SkySuite',
      badge: 'ROYAL VIP SUITE',
      speedKmh: 956,
      pricingType: `Entire Flagship Jet (Up to 16 Pax)`,
      baseUsd: Math.round((3900 + distanceKm * 1.65) * baggageMultiplier),
      perPersonUsd: Math.round(((3900 + distanceKm * 1.65) * baggageMultiplier) / paxCount),
      departureTime: '08:20 PM',
      cabinFeatures: ['Private Master Stateroom & Shower', 'Mach 0.925 High-Speed Cruise', '100% Fresh Cabin Air', 'Michelin-Curated Onboard Chef'],
      seatsAvailable: 14,
      image: './assets/plane.png',
    },
  ];

  return tiers.map((tier) => {
    const flightHoursFloat = distanceKm / tier.speedKmh + 0.45; // includes climb & approach
    const hrs = Math.floor(flightHoursFloat);
    const mins = Math.round((flightHoursFloat - hrs) * 60);
    const durationText = `${hrs}h ${mins < 10 ? '0' + mins : mins}m`;

    return {
      ...tier,
      distanceKm,
      durationText,
      origin,
      destination,
      passengers: paxCount,
      baggage,
      date: date || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    };
  });
}

export function formatCurrencyPrice(amountUsd, currencyCode = 'USD', rates = FALLBACK_RATES) {
  const rate = rates[currencyCode] || 1;
  const converted = Math.round(amountUsd * rate);
  const meta = CURRENCY_META[currencyCode] || CURRENCY_META.USD;
  return `${meta.symbol}${converted.toLocaleString()}`;
}
