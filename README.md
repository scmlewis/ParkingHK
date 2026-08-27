# ParkingHK | 泊好位

> Find the best parking in Hong Kong — real-time vacancies, smart scoring, instant navigation.

ParkingHK is a production-ready Progressive Web App (PWA) built for Hong Kong drivers. It fetches live car park data directly from the Transport Department's open API, scores each car park with a transparent 100-point algorithm, and helps you choose the right spot based on availability, distance, price, and more.

---

## Features

### Real-Time Data
- Live vacancy feeds from the HKSAR Transport Department (`data.one.gov.hk`)
- 60-second auto-refresh with countdown timer and manual refresh
- Data freshness indicators: **LIVE** (<2m), **RECENT** (2–5m), **STALE** (5–15m), **VERY STALE** (>15m)

### Smart Scoring
Transparent 100-point recommendation engine combining:
- 40% — Availability & Vacancy
- 25% — Distance & Walking Time
- 20% — Hourly Rates
- 10% — Opening Status
- 5% — Data Freshness

### Interactive Map
- Leaflet map with colour-coded pins (Green = Available, Yellow = Limited, Red = Full)
- Search radius visualisers (500m, 1km, 2km, 5km)
- Desktop split view (list + map side by side) and mobile map/list toggle

### Discovery & Search
- GPS-based "Near Me" with Haversine distance and walking estimates
- Destination search for Hong Kong landmarks, malls, and districts
- "Search This Area" for map viewport-based discovery

### Filters
- Vehicle types: Private Car, Motorcycle, Light Goods Vehicle (LGV), Heavy Goods Vehicle (HGV), Coach
- Region and district filters across all 18 HK districts
- EV charging and Open Now quick filters
- Max distance and max hourly rate controls

### Favourites
- Save preferred car parks locally (no account required)
- Persistent across sessions via localStorage

### Navigation
- One-tap handoff to Google Maps, Apple Maps, or Waze

### Bilingual & Themes
- Traditional Chinese (Hong Kong driver terminology) and English
- System default, Light, and Dark mode

### PWA
- Web App Manifest, offline caching, responsive mobile-first UI with 44px+ touch targets

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Map | Leaflet, MapLibre GL |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| Build | Vite 6 |
| Backend | Vercel Serverless Functions (Node.js) |
| Data | HKSAR Transport Department Open API |

---

## Project Structure

```
api/                       # Vercel serverless functions (backend)
├── health.ts              # Health check endpoint
└── parking/
    ├── all.ts             # Merged car parks + vacancy data
    └── vacancy.ts         # Vacancy-only refresh
src/
├── api/                  # Client-side API fetcher & localStorage caching
├── domain/               # Core TypeScript type definitions
├── constants/            # Districts, destinations, vehicle types
├── services/             # Distance, freshness, recommendation scoring
├── hooks/                # Data fetching, location, favourites, preferences
├── components/
│   ├── modern/           # TopBar, BottomBar, Carousel, ListView
│   ├── desktop/          # Desktop split-view side panel
│   ├── parking/          # Map, detail modal, score explanation
│   ├── favourites/       # Saved car parks view
│   └── settings/         # Settings & data disclaimer
├── i18n/                 # Bilingual translations & context
└── server/               # Shared data service & seed dataset
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- npm, yarn, or bun

### Install

```bash
git clone https://github.com/your-username/ParkingHK.git
cd ParkingHK
npm install
```

### Development

For full-stack local development (frontend + API functions), use Vercel CLI:

```bash
npm install -g vercel
npm run vercel:dev
```

Or run the frontend alone with `npm run dev` (API calls will fall back to cached/seed data when the backend isn't running).

### Production Build

```bash
npm run build
```

Output is served as a static site on Vercel, with `api/` functions handling the backend.

### Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Optional. Only needed if you enable AI-powered features |
| `APP_URL` | Public URL where the app is hosted |

---

## Deploy to Vercel

1. Push the repository to GitHub.
2. In the Vercel dashboard, **Import** the repository.
3. Vercel auto-detects the Vite framework and `vercel.json` settings — no extra config needed.
4. (Optional) Add environment variables from `.env.example` in the Vercel project settings.
5. Deploy. The app is live at your Vercel URL.

---

## API Endpoints

The Vercel serverless backend exposes:

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/parking/all` | All car parks with merged vacancy data |
| `GET /api/parking/vacancy` | Vacancies only (lightweight refresh). Add `?force=true` to bypass cache. |

---

## Data Source

Car park information and live vacancy data are sourced from the [Transport Department of the Government of the Hong Kong Special Administrative Region](https://data.gov.hk). Data freshness depends on reporting intervals from individual operators.

---

## License

MIT
