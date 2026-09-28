# TripFit LK

> **Make Your Trip Fit Your Budget**  
> An AI-powered, budget-first travel planner that dynamically engineers, calculates, and optimizes Sri Lankan itineraries around a strict financial ceiling using real regulated tariffs and live travel APIs.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash%20(Free)-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```text
Budget Ceiling → Real Component Pricing → Hybrid Live APIs → 1-Click Budget Optimization
```

---

## 🌟 Overview & Problem Solved

Traditional travel platforms (Expedia, Booking.com, Skyscanner) organize itineraries around **destinations first**. Users pick where they want to go, book chain hotels, and only realize later that local transit (trains, express buses, metered tuk-tuks), food, and attraction tickets caused severe budget overruns. Furthermore, global travel APIs have **zero data on local informal economies**—such as Sri Lanka Railways (SLR) scenic unreserved trains, National Transport Commission (NTC) distance-stage bus models, or verified village homestays.

**TripFit LK reverses this paradigm by placing the user's budget at the center:**
1. **Specific Destination Planning**: The user enters a budget (e.g., `LKR 100,000`) and types any Sri Lankan destination (e.g., *Jaffna*, *Sigiriya*, *Galle*, *Ella*, *Kandy*). The engine fuzzy-matches the location against a **22-destination catalog**, evaluates component costs across 3 tiers (Budget, Mid, Comfort), and selects the highest tier that genuinely fits without arbitrary scaling.
2. **"No Idea Where to Go" Mode**: The user enters a budget and chooses *"Anywhere in Sri Lanka"*. The engine ranks all 22 catalog destinations, matching duration, regional diversity, and user interests to present the top 3 trips that maximize value within that exact spending limit.
3. **Smart Typo Tolerance & Suggestions**: If a destination cannot be resolved (e.g., `"asdfgh"`), the app provides 3 intelligent suggestions rather than arbitrarily defaulting to one location.

---

## 🧠 Real Component Pricing & Hybrid API Architecture

TripFit LK calculates costs from **real, bottom-up components** rather than multiplying arbitrary baseline numbers by budget ratios:

```
                            TripFit LK Client
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       [Live API Tier: Keys Set]        [Regulated Local Tariffs Engine]
        • 12Go Asia (Train & Bus)        • NTC 24-Stage Bus Fare Model
        • Amadeus (Hotels & Stays)       • Sri Lanka Railways Class Tariffs
        • Google Gemini (Custom AI)      • Metered Three-Wheeler Rates
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
       tripCostEngine: Unified Hybrid Breakdown ("Live" vs "Estimated" Badges)
                                    ▼
       Rendered to Google Stitch UI (Timelines, Health Cards, 1-Click Levers)
```

### 1. 22-Destination Comprehensive Catalog (`src/data/destinations.js`)
Complete metadata across 22 Sri Lankan destinations:
- **Central Highlands**: Kandy, Nuwara Eliya, Ella, Haputale, Horton Plains, Sri Pada (Adam's Peak).
- **Southern & Western Coast**: Galle, Unawatuna, Mirissa, Hikkaduwa, Bentota, Negombo, Colombo.
- **Cultural Triangle**: Sigiriya, Dambulla, Anuradhapura, Polonnaruwa.
- **Northern & Eastern Coast**: Jaffna, Trincomalee, Batticaloa, Arugam Bay.
- **Wildlife & Safari**: Yala & Tissamaharama.
- *Attributes per destination*: Distance from Colombo (km), rail accessibility, 3-tier room rates (Budget / Mid / Comfort), daily dining costs per traveler, and real attraction entry fees.

### 2. Component-Based Costing Engine (`src/services/tripBuilder.js`)
- **Transport**: Official Sri Lanka Railways (1st / 2nd / 3rd class) or CTB/Highway coach fares $\times$ roundtrip distance $\times$ travelers $+$ local metered tuk-tuk allowance.
- **Accommodation**: $\text{nights} \times \lceil\text{travelers} / 2\rceil \text{ rooms} \times \text{tier room rate}$.
- **Food**: $\text{durationDays} \times \text{travelers} \times \text{daily food rate}$.
- **Activities**: Exact admission fees for landmarks matching user interests.
- **Tier Selection Rule**: The budget strictly decides the tier:
  $$\text{Comfort} \xrightarrow{\text{if over budget}} \text{Mid} \xrightarrow{\text{if over budget}} \text{Budget}$$
  If even the Budget tier exceeds the user's spending limit, the engine keeps the Budget tier and flags the exact difference for 1-click optimization.

### 3. Regulated Local Fare Engine (`src/services/localFareEngine.js`)
Calculates regulated local transport costs for Sri Lanka without reliance on external live services:
- **Metered Tuk-Tuk**: Configurable base fare (`TUKTUK_BASE_FARE = 100 LKR`) and rate (`TUKTUK_RATE_PER_KM = 80 LKR`), rounded to the nearest 10 LKR with a 3-passenger capacity limit.
- **CTB / NTC Bus Stages**: 24 distance stages (up to 200 km with linear extrapolation) multiplied by service factors (`normal: 1.0`, `semiLuxury: 1.3`, `luxury: 1.6`, `expressway: 2.0`).
- **Sri Lanka Railways (SLR)**: Tiered per-kilometer class benchmarks for 3rd, 2nd, and 1st class.

### 4. Hybrid Live Partner APIs
- **12Go Asia Partner API (`src/services/transitApiService.js`)**: Fetches real train and intercity bus fares, normalized to `{ mode, from, to, class, fare, currency, source: "12go-live" }` with a 1-hour in-memory cache and non-throwing fallback to `localFareEngine`.
- **Amadeus Hotel Search API (`src/services/hotelApiService.js`)**: Handles OAuth2 client-credentials flow with automatic token caching and queries live hotel offers by city, dates, and budget ceiling.
- **Unified Trip Cost Engine (`src/services/tripCostEngine.js`)**: Combines live APIs with regulated fallbacks and tags every category as `"live"` or `"estimated"`, displayed as visual badges on the Itinerary page.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)

### 1. Clone & Install
```bash
git clone https://github.com/chathurika-sandamali/tripfit-lk.git
cd tripfit-lk
npm install
```

### 2. Configure Environment Variables (Optional)
TripFit LK works out of the box with 100% offline reliability using the regulated tariff engine. To enable live AI generation, live transit fares, or hotel lookups, create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` to supply any desired keys:
```env
# 1. Google Gemini AI (100% Free at https://aistudio.google.com)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 2. 12Go Asia Partner / Affiliate API (Optional)
VITE_12GO_API_KEY=your_12go_api_key_here

# 3. Amadeus for Developers Hotel Search API (Free tier at https://developers.amadeus.com)
VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id_here
VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗺️ Application Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Dynamic hero preview, value pillars, and fast start wizard CTAs. |
| `/plan/budget` | **Step 1: Budget Ceiling** | Interactive slider & preset buttons (LKR 25k–500k) with real category preview. |
| `/plan/details` | **Step 2: Trip Criteria** | Destination search across 22 regions, "Anywhere in Sri Lanka", party size, duration, interests, and style. |
| `/plan/ai` | **Step 3: AI Processing** | Animated multi-stage synthesis with live Gemini connection status. |
| `/recommendations` | **Step 3: Recommendations** | Dynamic featured trip for typed destination (or top 3 for open-ended queries) + fallback suggestions on typo. |
| `/trip/:tripId` | **Itinerary Timeline** | Day-by-day morning, afternoon, and evening schedule with leg costs and "Live price" vs "Estimated" badges. |
| `/trip/:tripId/optimize` | **Step 4: Optimizer** | Non-double-counting toggles (rail substitution, family homestays, self-guided passes). |
| `/my-trips` | **Saved Trips** | Saved trips dashboard with real-time budget compliance indicators. |
| `/ai-assistant` | **AI Assistant** | Conversational chat powered by Google Gemini with Sri Lankan travel expertise. |

---

## 📂 Project Structure

```text
├── .env.example                     # Environment template for Gemini, 12Go & Amadeus APIs
├── src/
│   ├── assets/
│   │   └── images/                  # Photography & branding assets
│   ├── components/
│   │   ├── Navbar.jsx               # Header with mobile menu & active route pills
│   │   ├── Footer.jsx               # Application footer & minimal wizard variant
│   │   ├── ProgressSteps.jsx        # 4-step wizard stepper with checkmarks
│   │   ├── BudgetCard.jsx           # Reusable budget summary & status card
│   │   ├── TripCard.jsx             # Destination preview card
│   │   └── Button.jsx               # Design system button variants
│   ├── context/
│   │   └── PlanContext.jsx          # Reactive state for budget, details, optimizations & custom built trips
│   ├── data/
│   │   ├── destinations.js          # Catalog of 22 Sri Lankan destinations with realistic pricing
│   │   └── mockData.js              # Base presets, destinations, styles & formatters
│   ├── services/
│   │   ├── tripBuilder.js           # Fuzzy destination matching, component costing & recommendations
│   │   ├── tripCostEngine.js        # Multi-tiered cost orchestrator with live/estimated badges
│   │   ├── localFareEngine.js       # NTC bus stages, metered tuk-tuks & Sri Lanka Railways tariffs
│   │   ├── transitApiService.js     # 12Go Asia live transit API client with 1-hr in-memory cache
│   │   ├── hotelApiService.js       # Amadeus hotel search client with OAuth2 token caching
│   │   └── geminiService.js         # Google Gemini Free API client, JSON prompt engine & assistant chat
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page with dynamic hero preview
│   │   ├── Budget.jsx               # Step 1: Target budget configuration & allocation preview
│   │   ├── TripDetails.jsx          # Step 2: Destination, travelers, duration, interests, style
│   │   ├── AIPlanning.jsx           # Step 3: Multi-stage animated AI synthesis screen
│   │   ├── Recommendations.jsx      # Step 3: Curated & live AI trip cards with typo suggestions
│   │   ├── Itinerary.jsx            # Day-by-day timeline & leg cost breakdown with live badges
│   │   ├── BudgetOptimization.jsx  # Step 4: Interactive trade-offs to eliminate overruns
│   │   ├── MyTrips.jsx              # Saved trips dashboard with status badges
│   │   └── AIAssistant.jsx          # Live Gemini AI travel consultation chat interface
│   ├── App.jsx                      # Top-level route switch & layout
│   └── main.jsx                     # Application mount
├── tailwind.config.js               # Google Stitch design tokens, color ramps & typography
├── package.json                     # Project dependencies & scripts
└── .gitignore                       # Clean exclusions (node_modules, dist, *.zip, .env*)
```

---

## 🧪 Verified Engine Test Bench

The component cost engine and fuzzy matcher have been verified across real-world Sri Lankan scenarios without artificial budget scaling:

| Test Case | Budget | Selected Tier | Calculated Cost | Status | Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kandy** | LKR 30,000 | **Budget** | LKR 38,282 | Over by LKR 8,282 | Real transit + homestay exceeds 30k; prompts optimizer |
| **Kandy** | LKR 100,000 | **Mid** | LKR 70,580 | Fits (LKR 29,420 buffer) | Upgrades to boutique homestay & reserved 2nd class rail |
| **Galle** | LKR 30,000 | **Budget** | LKR 32,322 | Over by LKR 2,322 | Coastal train + local guesthouse |
| **Galle** | LKR 100,000 | **Mid** | LKR 64,460 | Fits (LKR 35,540 buffer) | Upgrades to Fort heritage stay & expressway transport |
| **Jaffna** | LKR 30,000 | **Budget** | LKR 26,682 | Fits (LKR 3,318 buffer) | Yal Devi 3rd class rail + regional guesthouse fits safely |
| **Jaffna** | LKR 100,000 | **Mid** | LKR 56,380 | Fits (LKR 43,620 buffer) | Yal Devi 2nd class rail + mid hotel |
| **Sigiriya** | LKR 30,000 | **Budget** | LKR 57,002 | Over by LKR 27,002 | Lion Rock citadel ticket (LKR 10.5k/pax) reflected accurately |
| **Sigiriya** | LKR 100,000 | **Mid** | LKR 83,884 | Fits (LKR 16,116 buffer) | Lion Rock + Pidurangala + mid lodge fits comfortably |
| **"asdfgh"** | LKR 50,000 | — | — | **Not Found** | Shows friendly banner with 3 closest suggestions |
| **Empty ("No Idea")**| LKR 30,000 | **Budget** | ~LKR 24k–28k | Fits | Curates top 3: *Anuradhapura*, *Sri Pada*, *Unawatuna* |
| **Empty ("No Idea")**| LKR 100,000| **Mid/Comfort** | ~LKR 68k–88k | Fits | Curates top 3: *Kandy*, *Anuradhapura*, *Sri Pada* |

---

## 🔮 Future Roadmap: Global Expansion & Event-Driven Travel

TripFit LK is built on a modular architecture designed for rapid scaling into global and event-centric travel planning:

```
[Phase 1: Sri Lanka Localized] ──► [Phase 2: Global Expansion] ──► [Phase 3: Event-Driven Planner]
  • LKR Currency                     • Multi-currency (USD, EUR)    • Concerts (Coldplay, BTS, Taylor Swift)
  • Railways, Tuk-Tuks, Homestays    • International flights & rail • Major Sports (FIFA World Cup, ICC Cricket)
  • Cultural & Scenic Itineraries    • Global hostel & stay tiers   • Ticket + Transit + Stay Budget Bundling
```

### 1. Global Multi-Currency Engine (`TripFit Global`)
- Support for international destinations (Southeast Asia, Europe, East Asia, Americas).
- Dynamic currency switching (USD, EUR, GBP, AUD, JPY, LKR) with live purchasing-power parity adjustments.

### 2. Event & Concert Budget Travel Planner
- **The Core Problem**: Attending high-profile international concerts or major sports tournaments is prohibitively expensive and complex. Fans often secure a ticket only to be stranded by inflated airfare and hotel surcharges.
- **The TripFit Solution**:
  - Users input their **total event travel budget** (e.g., `$1,200` total).
  - The engine bundles:
    1. **Concert / Match Ticket Tier** (General Admission vs. Reserved).
    2. **Transit**: Budget airline routes or cross-border express trains.
    3. **Lodging**: Verified social hostels within 3–4 metro stops of the venue.
    4. **Local Metro Pass**: City transit day cards for hassle-free venue commutes.
  - Generates a guaranteed all-in trip that keeps the entire event experience within the user's spending limit.

---

## 📄 License & Attribution

This project is open-source under the [MIT License](LICENSE).  
Designed based on the **Google Stitch** design system with authentic Sri Lankan travel research, official National Transport Commission benchmarks, and Google Gemini AI.
