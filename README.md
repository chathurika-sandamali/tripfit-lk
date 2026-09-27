# TripFit LK

> **Make Your Trip Fit Your Budget**  
> An AI-powered, budget-first travel planner that helps travelers create, calculate, and optimize trips around a strict financial ceiling.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash%20(Free)-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```text
Budget Ceiling → Heuristic Planning → AI Recommendations → 1-Click Budget Optimization
```

---

## 🌟 Overview & Problem Solved

Traditional travel platforms (Expedia, Booking.com, Skyscanner) organize itineraries around **destinations first**. Users pick where they want to go, book expensive chain hotels, and only realize afterwards that local transport (taxis, tuk-tuks), food, and attraction passes caused major budget overruns. Moreover, global travel APIs have **zero data on local informal economies**—such as Sri Lanka Railways scenic unreserved trains, PickMe tuk-tuk fares, or authentic village homestays.

**TripFit LK reverses this paradigm by placing the user's budget at the center:**
1. **Persona A (Knows where they want to go)**: The user enters `LKR 100,000` and selects *Ella*. The engine calculates a realistic 3-day itinerary covering transit, homestays, meals, and viewpoint passes. If it exceeds the limit, it recommends specific trade-offs (e.g., train over private cab) to bring the trip within budget.
2. **Persona B (No idea where to go)**: The user enters `LKR 100,000` and selects *"Anywhere in Sri Lanka"*. The platform acts like an expert local travel consultant and presents the 3 best complete trips across the island that maximize their exact budget without overspending.

---

## 🧠 Dual-Mode AI Architecture

TripFit LK features a resilient **Dual-Mode Engine** designed to ensure 100% uptime for GitHub clones and live demos:

```
                            TripFit LK Client
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       [Live Mode: API Key Set]          [Fallback Mode: No Key]
        Google Gemini 1.5 Flash           Curated Sri Lanka Heuristics
        • Real-time AI generation         • Instant local calculation
        • Dynamic itinerary synthesis     • 100% offline reliability
        • Live conversational assistant   • Verified railway & stay tariffs
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
       Rendered to Google Stitch Design System (Cards, Bars, Timelines, Levers)
```

1. **Live AI Mode (Google Gemini Free API)**:
   - When a free Gemini API key is configured, the app prompts `gemini-1.5-flash` with strict JSON schemas.
   - Calculates realistic transport (Sri Lanka Railways Main Line, CTB express buses, tuk-tuks), lodging (certified homestays vs. boutique chalets), dining, and landmark tickets.
   - Powers the interactive **TripFit LK AI Assistant** (`/ai-assistant`) with live conversational travel intelligence.
2. **Deterministic Heuristic Fallback**:
   - If no API key is provided, the application automatically uses a localized Sri Lankan travel model (`src/data/mockData.js`).
   - Anyone cloning this repository can run `npm run dev` and test all 9 screens immediately without signup or configuration errors.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)

### 1. Clone & Install
```bash
git clone https://github.com/<YOUR_USERNAME>/tripfit-lk.git
cd tripfit-lk
npm install
```

### 2. Configure Free Google Gemini API (Optional)
To enable live AI generation and live chat, get a **100% free Gemini API key** (no credit card required):
1. Visit **[Google AI Studio](https://aistudio.google.com)** and sign in with any Google/Gmail account.
2. Click **"Get API key"** -> **"Create API key"**.
3. Create a `.env` file in the project root:
```bash
cp .env.example .env
```
4. Paste your key:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(If you skip this step, the app will smoothly run using the high-fidelity local Sri Lankan travel model!)*

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
| `/` | **Landing Page** | Value pillars, dynamic budget allocation preview card, and quick start CTAs. |
| `/plan/budget` | **Step 1: Budget Ceiling** | Interactive slider & preset buttons (LKR 50k–200k) with live category distribution. |
| `/plan/details` | **Step 2: Trip Criteria** | Multi-select chips for regions, "Anywhere in Sri Lanka", party size, duration, interests, and style. |
| `/plan/ai` | **Step 3: AI Processing** | Animated multi-stage synthesis with live Gemini connection status. |
| `/recommendations` | **Step 3: Best Trips** | Dynamic recommendation cards with surplus/over-budget badges and criteria filters. |
| `/trip/:tripId` | **Itinerary Timeline** | Day-by-day morning, afternoon, and evening schedule with leg costs and 1-click trip saving. |
| `/trip/:tripId/optimize` | **Step 4: Optimizer** | Non-double-counting toggles (rail substitution, family homestays, group passes). |
| `/my-trips` | **Saved Trips** | Saved trips dashboard with real-time budget compliance indicators. |
| `/ai-assistant` | **AI Assistant** | Conversational chat powered by Google Gemini with Sri Lankan travel advice. |

---

## 📂 Project Structure

```text
├── .env.example            # Environment template for Google Gemini Free API key
├── src/
│   ├── assets/
│   │   └── images/         # Google Stitch photography & branding assets
│   ├── components/
│   │   ├── Navbar.jsx      # Fixed header with mobile navigation & active route pills
│   │   ├── Footer.jsx      # Comprehensive application footer & minimal wizard variant
│   │   ├── ProgressSteps.jsx # 4-step wizard stepper with checkmarks
│   │   ├── BudgetCard.jsx  # Reusable budget summary & status card
│   │   ├── TripCard.jsx    # Destination preview card
│   │   └── Button.jsx      # Design system button variants
│   ├── context/
│   │   └── PlanContext.jsx # Global reactive state for budget, details, optimizations & AI trips
│   ├── services/
│   │   └── geminiService.js # Google Gemini Free API client, JSON prompt engine & chat helper
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with dynamic hero preview
│   │   ├── Budget.jsx      # Step 1: Target budget configuration & allocation preview
│   │   ├── TripDetails.jsx # Step 2: Destination, travelers, duration, interests, style
│   │   ├── AIPlanning.jsx  # Step 3: Multi-stage animated AI synthesis screen
│   │   ├── Recommendations.jsx # Step 3: Curated & live AI trip cards
│   │   ├── Itinerary.jsx   # Day-by-day timeline & leg cost breakdown
│   │   ├── BudgetOptimization.jsx # Step 4: Interactive trade-offs to eliminate overruns
│   │   ├── MyTrips.jsx     # Saved trips dashboard with status badges
│   │   └── AIAssistant.jsx # Live Gemini AI travel consultation chat interface
│   ├── data/
│   │   └── mockData.js     # Sri Lankan travel tariffs, routes & baseline knowledge
│   ├── App.jsx             # Top-level route switch & layout
│   └── main.jsx            # Application mount
├── tailwind.config.js      # Google Stitch design tokens, color ramps & typography
├── package.json            # Project dependencies & scripts
└── .gitignore              # Clean exclusions (node_modules, dist, *.zip, .env*)
```

---

## 🔮 Future Roadmap: Global Expansion & Event-Driven Travel

TripFit LK is built on a modular architecture designed for rapid scaling into global and event-centric travel planning:

```
[Phase 1: Sri Lanka Localized] ──► [Phase 2: Global Expansion] ──► [Phase 3: Event-Driven Planner]
  • LKR Currency                     • Multi-currency (USD, EUR)    • Concerts (Coldplay, BTS, Taylor Swift)
  • Railways, Tuk-Tuks, Homestays    • International flights & rail • Major Sports (FIFA World Cup, Premier League)
  • Cultural & Scenic Itineraries    • Global hostel & stay tiers   • Ticket + Transit + Stay Budget Bundling
```

### 1. Global Multi-Currency Engine (`TripFit Global`)
- Support for international destinations (Southeast Asia, Europe, East Asia, Americas).
- Dynamic currency switching (USD, EUR, GBP, AUD, JPY, LKR) with live purchasing-power parity adjustments.

### 2. Event & Concert Budget Travel Planner
- **The Core Problem**: Attending high-profile international concerts (e.g., **Coldplay Music of the Spheres**, **BTS World Tours**, **Taylor Swift Eras Tour**) or major sports tournaments (**FIFA World Cup**, **UEFA Champions League**, **ICC Cricket World Cup**) is prohibitively expensive and complex. Fans often secure a ticket only to be stranded by inflated airfare and hotel surcharges.
- **The TripFit Solution**:
  - Users input their **total event travel budget** (e.g., `$1,200` total).
  - The AI bundles:
    1. **Concert / Match Ticket Tier** (General Admission vs. Reserved).
    2. **Transit**: Budget airline routes (AirAsia, Scoot, Ryanair) or cross-border express trains.
    3. **Lodging**: Verified social hostels within 3–4 metro stops of the stadium or arena.
    4. **Local Metro Pass**: City transit day cards for hassle-free venue commutes.
  - Generates a guaranteed all-in trip that keeps the entire event experience within the user's spending limit.

---

## 📄 License & Attribution

This project is open-source under the [MIT License](LICENSE).  
Designed based on the **Google Stitch** design system with local Sri Lankan travel research and powered by Google Gemini AI.
