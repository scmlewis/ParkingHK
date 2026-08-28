# ParkingHK | 泊好位

> Find the best parking in Hong Kong — real-time vacancies, smart scoring, instant navigation.

ParkingHK is a production-ready Progressive Web App (PWA) built for Hong Kong drivers. It fetches live car park data directly from the Transport Department's open API, scores each car park with a transparent 100-point algorithm, and helps you choose the right spot based on availability, distance, price, and more.

---

## Features

### Real-Time Data
- Live vacancy feeds from the HKSAR Transport Department (`data.one.gov.hk`)
- 60-second auto-refresh with countdown timer and manual refresh
- Data freshness indicators: green pulsing = **LIVE**, amber = **CACHED**, red = **OFFLINE**

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
- District and sub-district cluster markers at lower zoom levels
- MarkerCluster for individual car parks at higher zoom levels

### Discovery & Search
- Global search — find any car park across Hong Kong by name, address, or district
- Token-based fuzzy matching with relevance ranking
- Car park autocomplete suggestions with vacancy badges in the search dropdown
- Destination search for 37 popular Hong Kong landmarks, malls, and districts
- GPS-based "Near Me" with Haversine distance and walking estimates
- GPS re-centres map on every click; validates location is within Hong Kong bounds

### Filters
- Vehicle types: Private Car, Motorcycle, Light Goods Vehicle (LGV), Heavy Goods Vehicle (HGV), Coach
- Region and district filters across all 18 HK districts
- EV charging, Has Vacancy, and Open Now quick filters
- Max distance and max hourly rate controls
- Limit to map zone toggle (disabled during search for global results)

### Favourites
- Save preferred car parks locally (no account required)
- Persistent across sessions via localStorage

### Navigation
- One-tap handoff to Google Maps, Apple Maps, or Waze

### Bilingual & Theme
- Traditional Chinese (Hong Kong driver terminology) and English
- Dark mode only

### Settings
- Parking duration selector (affects pricing calculations)
- GitHub repo link and author info

### PWA
- Web App Manifest, offline caching, responsive mobile-first UI with 44px+ touch targets

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Map | Leaflet, MapLibre GL, Leaflet.markercluster |
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
├── api/                   # Client-side API fetcher & localStorage caching
├── domain/                # Core TypeScript type definitions
├── constants/             # Districts (18), destinations (37), vehicle types
├── services/              # Distance, freshness, recommendation scoring
├── hooks/                 # Data fetching, location, favourites, preferences
├── components/
│   ├── modern/            # TopBar, BottomBar, Carousel, ListView
│   ├── desktop/           # Desktop split-view side panel
│   ├── parking/           # Map, detail modal, score explanation
│   ├── favourites/        # Saved car parks view
│   ├── settings/          # Settings modal
│   └── common/            # CarParkCard, ScoreBadge, VacancyBadge, AppLogo
├── i18n/                  # Bilingual translations & context
└── server/                # Shared data service & seed dataset
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- npm, yarn, or bun

### Install

```bash
git clone https://github.com/scmlewis/ParkingHK.git
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

### Lint / Type Check

```bash
npm run lint          # runs tsc --noEmit
```

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
