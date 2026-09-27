// TripFit LK - Mock Data & Travel Knowledge Base

export const DEFAULT_PLAN_PARAMS = {
  targetBudget: 100000,
  destination: "Kandy",
  travelers: 2,
  duration: "3 Days",
  durationDays: 3,
  interests: ["Nature", "Culture", "Food"],
  travelStyle: "Balanced",
};

export const PRESET_BUDGETS = [
  { amount: 25000, label: "LKR 25,000", tag: "Backpacker / Solo" },
  { amount: 50000, label: "LKR 50,000", tag: "Weekend Explorer" },
  { amount: 100000, label: "LKR 100,000", tag: "Island Highlights", isDefault: true },
  { amount: 200000, label: "LKR 200,000", tag: "Comfort Island Tour" },
  { amount: 500000, label: "LKR 500,000+", tag: "Comprehensive Sri Lanka & Private Driver" },
];

export const DESTINATIONS = [
  { name: "Kandy", province: "Central Province", highlight: "Royal Palace, Temple of Tooth & Botanical Gardens" },
  { name: "Ella", province: "Uva Province", highlight: "Nine Arch Bridge, Little Adam's Peak & Tea Trails" },
  { name: "Galle & South Coast", province: "Southern Province", highlight: "Dutch Fort, Mirissa Beach & Coastal Train" },
  { name: "Sigiriya & Dambulla", province: "Central Province", highlight: "Lion Rock Citadel & Golden Cave Temple" },
  { name: "Nuwara Eliya", province: "Central Province", highlight: "Little England, Tea Estates & Gregory Lake" },
];

export const INTEREST_OPTIONS = [
  { id: "nature", label: "Nature", icon: "forest" },
  { id: "culture", label: "Culture", icon: "temple_hindu" },
  { id: "food", label: "Food & Dining", icon: "restaurant" },
  { id: "adventure", label: "Adventure & Hiking", icon: "hiking" },
  { id: "wildlife", label: "Wildlife & Safari", icon: "pets" },
  { id: "beaches", label: "Beaches & Coast", icon: "beach_access" },
  { id: "photography", label: "Photography", icon: "photo_camera" },
];

export const TRAVEL_STYLES = [
  {
    id: "Budget",
    title: "Budget / Backpacker",
    desc: "Hostels, scenic public trains, local eateries, maximum value.",
    badge: "Maximum Savings",
    icon: "backpack",
  },
  {
    id: "Balanced",
    title: "Balanced / Smart",
    desc: "Boutique homestays, reserved 2nd/3rd class trains, mixed dining.",
    badge: "Most Popular",
    icon: "balance",
  },
  {
    id: "Comfort",
    title: "Comfort / Upgraded",
    desc: "Heritage 4-star hotels, private AC car/van transfers, guided tours.",
    badge: "High Comfort",
    icon: "hotel",
  },
];

export const MOCK_TRIPS = {
  "kandy-cultural-escape": {
    id: "kandy-cultural-escape",
    title: "Kandy Cultural Escape",
    subtitle: "Sacred Relics, Lakeside Serenity & Royal Botanic Splendor",
    durationDays: 3,
    durationNights: 2,
    destination: "Kandy",
    travelers: 2,
    travelStyle: "Balanced",
    targetBudget: 100000,
    estimatedCost: 94500,
    savingsFromBudget: 5500,
    image: "kandy-lake",
    route: "Colombo Fort → Kandy (Intercity Express) → Peradeniya → Kandy Lake Promenade",
    tags: ["Culture", "Nature", "Scenic Train"],
    breakdown: {
      transport: 22000,
      accommodation: 35000,
      food: 21500,
      activities: 16000,
    },
    highlights: [
      "Temple of the Sacred Tooth Relic evening pooja ceremony",
      "Royal Botanic Gardens of Peradeniya orchid collection",
      "Scenic Colombo Fort to Kandy Intercity Express observation car",
      "Lakeside stroll and panoramic view from Arthur's Seat lookout",
      "Traditional authentic Kandyan dance performance at Cultural Centre",
    ],
    whyRecommended:
      "This trip perfectly fits your LKR 100,000 budget with a comfortable LKR 5,500 buffer. By combining Sri Lanka Railways reserved 2nd class seating with a scenic lakeview boutique homestay, you enjoy prime central locations and verified authentic Sri Lankan hospitality without private driver surcharges.",
    days: [
      {
        day: 1,
        title: "Scenic Train Ride & Sacred Hill Capital",
        dateLabel: "Day 1 • Arrival & Heritage",
        legs: [
          {
            time: "07:00 AM – 09:45 AM",
            title: "Colombo Fort to Kandy via Intercity Express",
            category: "Transport",
            cost: 3600,
            desc: "Reserved 2nd Class seats on the morning train through misty Kadugannawa pass.",
            icon: "train",
          },
          {
            time: "10:30 AM – 01:00 PM",
            title: "Check-in at Lake View Boutique Homestay & Lunch",
            category: "Accommodation & Food",
            cost: 16500,
            desc: "Tranquil family-run guesthouse 5 minutes walk from Kandy Lake. Authentic rice & curry lunch included.",
            icon: "hotel",
          },
          {
            time: "05:00 PM – 07:30 PM",
            title: "Temple of the Tooth (Sri Dalada Maligawa) Evening Ceremony",
            category: "Activity",
            cost: 4000,
            desc: "Experience the revered evening drumming and flower offering pooja ceremony at the UNESCO World Heritage site.",
            icon: "temple_hindu",
          },
        ],
      },
      {
        day: 2,
        title: "Royal Gardens & Mountain Tea Heritage",
        dateLabel: "Day 2 • Flora & Hill Trails",
        legs: [
          {
            time: "08:30 AM – 11:30 AM",
            title: "Royal Botanic Gardens, Peradeniya",
            category: "Activity",
            cost: 6000,
            desc: "Explore the 147-acre world-renowned collection of over 4,000 plant species, giant Javan fig trees, and palm avenues.",
            icon: "park",
          },
          {
            time: "12:30 PM – 02:00 PM",
            title: "Traditional Clay Pot Buffet Lunch",
            category: "Food",
            cost: 3200,
            desc: "Savor local clay pot organic vegetarian curry and pol sambol at a local garden kitchen.",
            icon: "restaurant",
          },
          {
            time: "03:30 PM – 06:00 PM",
            title: "Arthur's Seat Panorama & Kandyan Cultural Dance",
            category: "Activity",
            cost: 5000,
            desc: "Sunset view over the lake valley followed by the traditional drum & fire dance showcase.",
            icon: "theater_comedy",
          },
        ],
      },
      {
        day: 3,
        title: "Ceylon Spices & Scenic Return Voyage",
        dateLabel: "Day 3 • Craft & Departure",
        legs: [
          {
            time: "09:00 AM – 11:30 AM",
            title: "Udawatta Kele Sanctuary Morning Walk",
            category: "Activity",
            cost: 2000,
            desc: "Gentle historical rainforest walk above the royal palace teeming with endemic birds and giant lianas.",
            icon: "hiking",
          },
          {
            time: "02:00 PM – 04:45 PM",
            title: "Return Intercity Train to Colombo Fort",
            category: "Transport",
            cost: 3600,
            desc: "Comfortable air-conditioned coach descent from the hills back to the western coast.",
            icon: "train",
          },
        ],
      },
    ],
    optimizationOptions: [
      {
        id: "transport",
        categoryKey: "transport",
        category: "Transport Optimization",
        title: "Switch Transport",
        description: "Use standard scenic rail and local transit for selected legs instead of private hired car.",
        current: "Private taxi / hired car",
        alternative: "Intercity Express Train 2nd Class",
        currentCost: 12000,
        optimizedCost: 7000,
        savings: 5000,
        icon: "train",
      },
      {
        id: "accommodation",
        categoryKey: "accommodation",
        category: "Accommodation Optimization",
        title: "Change Accommodation",
        description: "Choose a verified lakeside family-run heritage homestay with authentic breakfast included.",
        current: "Boutique hotel",
        alternative: "Lakeside heritage homestay",
        currentCost: 22000,
        optimizedCost: 15000,
        savings: 7000,
        icon: "hotel",
      },
      {
        id: "activities",
        categoryKey: "activities",
        category: "Activities & Sightseeing",
        title: "Choose Lower-Cost Experiences",
        description: "Opt for self-guided botanical garden trails and free Udawatta Kele nature walks.",
        current: "Commercial guided agency tours",
        alternative: "Public garden & sanctuary self-guided walks",
        currentCost: 10000,
        optimizedCost: 7000,
        savings: 3000,
        icon: "hiking",
      },
    ],
  },

  "ella-adventure": {
    id: "ella-adventure",
    title: "4-Day Ella Adventure",
    subtitle: "Nine Arch Bridge, Little Adam's Peak & Demodara Loop",
    durationDays: 4,
    durationNights: 3,
    destination: "Ella",
    travelers: 2,
    travelStyle: "Balanced",
    targetBudget: 100000,
    estimatedCost: 109500,
    overBudgetAmount: 9500,
    image: "ella-bridge",
    route: "Colombo Fort → Kandy → Ella Mainline Train → Nine Arch Viaduct → Demodara Loop",
    tags: ["Nature", "Adventure", "Train"],
    breakdown: {
      transport: 32000,
      accommodation: 44000,
      food: 21000,
      activities: 12500,
    },
    highlights: [
      "World-famous scenic train journey crossing Demodara Nine Arch Bridge",
      "Sunrise hike up Little Adam's Peak with 360° Ella Gap views",
      "Ravana Falls waterfall dip & ancient cave exploration",
      "Local Ceylon high-grown tea factory manufacturing tour",
      "Cozy cafe evenings with live acoustic music in Ella village",
    ],
    whyRecommended:
      "A bucket-list journey through Sri Lanka's central highlands. This plan currently sits at LKR 109,500 (LKR 9,500 over your target budget) due to private cab legs and mid-tier resort lodging. With TripFit LK's 1-click optimization, it easily drops to LKR 98,000 while keeping all prime attractions intact.",
    days: [
      {
        day: 1,
        title: "The Legendary Highland Rail Journey",
        dateLabel: "Day 1 • High Country Train",
        legs: [
          {
            time: "06:00 AM – 03:30 PM",
            title: "Colombo Fort to Ella on the Scenic Mainline",
            category: "Transport",
            cost: 6000,
            desc: "One of the world's most photogenic train rides curving through emerald tea carpets and mountain tunnels.",
            icon: "train",
          },
          {
            time: "04:30 PM – 07:00 PM",
            title: "Check-in at Valley View Lodgings & Ella Town Stroll",
            category: "Accommodation",
            cost: 14000,
            desc: "Settle into your balcony room with uninterrupted view of Ella Rock. Walk down the lively main street.",
            icon: "hotel",
          },
        ],
      },
      {
        day: 2,
        title: "Nine Arch Viaduct & Little Adam's Peak",
        dateLabel: "Day 2 • Icons & Treks",
        legs: [
          {
            time: "06:30 AM – 09:30 AM",
            title: "Sunrise at Little Adam's Peak",
            category: "Activity",
            cost: 1000,
            desc: "Crisp mountain air and easy 45-minute hike overlooking the southern plains.",
            icon: "hiking",
          },
          {
            time: "11:00 AM – 02:00 PM",
            title: "Nine Arch Bridge Train Crossing & Tea Terrace Lunch",
            category: "Activity & Food",
            cost: 5500,
            desc: "Watch the colonial blue express train rumble over the 91-meter stone bridge amid tea pickers.",
            icon: "photo_camera",
          },
        ],
      },
      {
        day: 3,
        title: "Ravana Cascades & Tea Processing Tour",
        dateLabel: "Day 3 • Waterfalls & Tea",
        legs: [
          {
            time: "09:00 AM – 12:00 PM",
            title: "Halpewatte Tea Factory & Tasting Session",
            category: "Activity",
            cost: 3500,
            desc: "Guided walk-through of traditional rolling, fermentation, and tasting of high-grown BOP and silver tips.",
            icon: "emoji_food_beverage",
          },
          {
            time: "01:30 PM – 04:30 PM",
            title: "Ravana Falls & River Pools",
            category: "Activity",
            cost: 2500,
            desc: "Visit the cascading 25-meter waterfall wrapped in Ramayana legend.",
            icon: "water",
          },
        ],
      },
      {
        day: 4,
        title: "Demodara Loop & Return Journey",
        dateLabel: "Day 4 • Engineering Feat & Departure",
        legs: [
          {
            time: "08:30 AM – 10:30 AM",
            title: "Demodara Railway Spiral Station Inspection",
            category: "Activity",
            cost: 1000,
            desc: "Visit the ingenious colonial railway track that loops around the mountain and passes beneath itself.",
            icon: "alt_route",
          },
          {
            time: "11:30 AM – 07:30 PM",
            title: "Return Transit to Colombo",
            category: "Transport",
            cost: 12000,
            desc: "Transit back via express highway connection.",
            icon: "directions_bus",
          },
        ],
      },
    ],
    optimizationOptions: [
      {
        id: "transport",
        categoryKey: "transport",
        category: "Transport Optimization",
        title: "Switch Transport",
        description:
          "Replace the highway private taxi leg with Sri Lanka Railways scenic mainline train and local transit.",
        current: "Private AC vehicle",
        alternative: "Train + local transport",
        currentCost: 18000,
        optimizedCost: 13000,
        savings: 5000,
        icon: "train",
      },
      {
        id: "accommodation",
        categoryKey: "accommodation",
        category: "Accommodation Optimization",
        title: "Change Accommodation",
        description:
          "Opt for a family-run hillside homestay near Little Adam's Peak trail with breathtaking gap views and homemade breakfast.",
        current: "Resort accommodation",
        alternative: "Scenic budget guesthouse",
        currentCost: 26000,
        optimizedCost: 19000,
        savings: 7000,
        icon: "hotel",
      },
      {
        id: "activities",
        categoryKey: "activities",
        category: "Activities & Sightseeing",
        title: "Choose Lower-Cost Experiences",
        description:
          "Replace selected private guided tour fees with self-guided open community trails and authentic local eateries.",
        current: "Private guided agency",
        alternative: "Local trail passes & public viewpoints",
        currentCost: 16500,
        optimizedCost: 13500,
        savings: 3000,
        icon: "hiking",
      },
    ],
  },

  "galle-coast": {
    id: "galle-coast",
    title: "Galle & South Coast Explorer",
    subtitle: "Colonial Fort Bastions, Mirissa Coast & Marine Life",
    durationDays: 3,
    durationNights: 2,
    destination: "Galle & South Coast",
    travelers: 2,
    travelStyle: "Balanced",
    targetBudget: 100000,
    estimatedCost: 98000,
    savingsFromBudget: 2000,
    image: "galle-coast",
    route: "Colombo Fort → Coastal Line Express → Galle Fort Ramparts → Mirissa Beach",
    tags: ["Beaches", "History", "Seafood"],
    breakdown: {
      transport: 24000,
      accommodation: 38000,
      food: 22000,
      activities: 14000,
    },
    highlights: [
      "UNESCO Galle Dutch Fort sunset walk along Flag Rock bastion",
      "Coastal train journey with waves crashing metres from the track",
      "Morning boat tour to see blue whales off Mirissa bay",
      "Fresh grilled jumbo prawns and Ceylon coconut seafood curries",
      "Stilt fishermen observation and Unawatuna coral reef snorkel",
    ],
    whyRecommended:
      "A vibrant coastal getaway that fits comfortably inside your LKR 100,000 budget with LKR 2,000 to spare. The Coastal Line train hugs the Indian Ocean for under LKR 1,000 per passenger, keeping transit expenses down while allowing comfortable colonial-quarters lodging.",
    days: [
      {
        day: 1,
        title: "Coastal Train to Historic Galle Fort",
        dateLabel: "Day 1 • Bastions & Ocean",
        legs: [
          {
            time: "06:50 AM – 09:10 AM",
            title: "Colombo Fort to Galle via Samudra Devi Coastal Express",
            category: "Transport",
            cost: 2400,
            desc: "Oceanfront rail journey along the southwest palm-lined coast.",
            icon: "train",
          },
          {
            time: "10:30 AM – 01:00 PM",
            title: "Check-in at Fort Heritage Inn & Lunch",
            category: "Accommodation",
            cost: 18000,
            desc: "Charming Dutch colonial townhouse within the walled fort citadel.",
            icon: "hotel",
          },
          {
            time: "04:30 PM – 07:00 PM",
            title: "Galle Fort Sunset Ramparts Walk & Lighthouse",
            category: "Activity",
            cost: 0,
            desc: "Free public walk along 400-year-old stone fortifications as the sun dips into the sea.",
            icon: "fort",
          },
        ],
      },
      {
        day: 2,
        title: "Mirissa Ocean Safari & Tropical Beaches",
        dateLabel: "Day 2 • Whales & Waves",
        legs: [
          {
            time: "06:00 AM – 11:30 AM",
            title: "Mirissa Ethical Whale Watching Boat Excursion",
            category: "Activity",
            cost: 12000,
            desc: "Venture into deep southern waters frequented by blue whales, sperm whales, and spinner dolphins.",
            icon: "sailing",
          },
          {
            time: "01:00 PM – 04:00 PM",
            title: "Coconut Tree Hill & Secret Beach Relaxation",
            category: "Activity & Food",
            cost: 4500,
            desc: "Iconic palm promontory and fresh king coconuts followed by beachfront lunch.",
            icon: "beach_access",
          },
        ],
      },
      {
        day: 3,
        title: "Coral Reefs & Return Coastal Line",
        dateLabel: "Day 3 • Marine Life & Departure",
        legs: [
          {
            time: "09:00 AM – 11:30 AM",
            title: "Jungle Beach Snorkeling & Peace Pagoda",
            category: "Activity",
            cost: 3000,
            desc: "Sheltered bay swimming with sea turtles and visits to the Japanese Peace Pagoda.",
            icon: "scuba_diving",
          },
          {
            time: "03:00 PM – 05:30 PM",
            title: "Return Coastal Train to Colombo Fort",
            category: "Transport",
            cost: 2400,
            desc: "Sunset return ride alongside crashing coastal breakers.",
            icon: "train",
          },
        ],
      },
    ],
    optimizationOptions: [
      {
        id: "transport",
        categoryKey: "transport",
        category: "Transport Optimization",
        title: "Switch Transport",
        description: "Opt for Samudra Devi Coastal Line Express instead of southern expressway private taxi.",
        current: "Private expressway taxi",
        alternative: "Samudra Devi Coastal Express Train",
        currentCost: 10000,
        optimizedCost: 5000,
        savings: 5000,
        icon: "train",
      },
      {
        id: "accommodation",
        categoryKey: "accommodation",
        category: "Accommodation Optimization",
        title: "Change Accommodation",
        description: "Select a boutique heritage guesthouse just outside the main fort ramparts.",
        current: "High-end fort colonial hotel",
        alternative: "Fort fringe heritage guesthouse",
        currentCost: 24000,
        optimizedCost: 17000,
        savings: 7000,
        icon: "hotel",
      },
      {
        id: "activities",
        categoryKey: "activities",
        category: "Activities & Sightseeing",
        title: "Choose Lower-Cost Experiences",
        description: "Enjoy sunset fort rampart walks and self-guided coral reef snorkeling at Jungle Beach.",
        current: "Commercial guided boat tour agencies",
        alternative: "Public rampart trails & local reef beach access",
        currentCost: 9000,
        optimizedCost: 6000,
        savings: 3000,
        icon: "scuba_diving",
      },
    ],
  },
};

// Helper: Calculate exact budget state avoiding contradictory numbers
export function calculateBudgetStatus(targetBudget, estimatedCost, isOptimized = false) {
  const diff = targetBudget - estimatedCost;
  const fits = diff >= 0;

  let statusText = fits ? "Within Budget" : "Over Budget";
  let statusBadgeClass = fits
    ? "bg-primary-fixed text-on-primary-fixed"
    : "bg-amber-100 text-amber-900 border border-amber-300";

  if (fits && isOptimized) {
    statusText = "Optimized";
    statusBadgeClass = "bg-primary text-on-primary shadow-xs";
  }

  return {
    fits,
    isOptimized: fits && isOptimized,
    difference: Math.abs(diff),
    targetBudget,
    estimatedCost,
    statusText,
    statusBadgeClass,
    message: fits
      ? (isOptimized
          ? `Optimized: within spending limit by LKR ${Math.abs(diff).toLocaleString()}`
          : `Within spending limit by LKR ${Math.abs(diff).toLocaleString()}`)
      : `LKR ${Math.abs(diff).toLocaleString()} over spending limit`,
  };
}

// Currency formatting helper
export function formatLKR(amount) {
  if (amount === undefined || amount === null) return "LKR 0";
  return `LKR ${Number(amount).toLocaleString()}`;
}

// Mock AI Assistant conversation knowledge base
export const AI_MOCK_CONVERSATIONS = [
  {
    role: "assistant",
    id: "msg-welcome",
    text: "Ayubowan! I'm TripFit LK AI, your budget-first travel intelligence companion for Sri Lanka. I analyze real transit timetables, local guesthouses, and regional cost curves to design realistic itineraries that stay inside your spending limit.",
    time: "Just now",
  },
  {
    role: "assistant",
    id: "msg-status",
    text: "I see your active plan is the 4-Day Ella Adventure. It currently totals LKR 109,500 against your LKR 100,000 budget (LKR 9,500 over). Would you like me to simulate alternative train connections or switch to verified scenic homestays to bring it under LKR 98,000?",
    time: "Just now",
    actions: [
      { label: "Optimize for LKR 85,000", action: "optimize-plan" },
      { label: "Simulate Timetable", action: "simulate-timetable" },
    ],
  },
];

export const AI_FAQ_RESPONSES = {
  "cost":
    "To reduce the cost of your Sri Lanka trip, the highest-impact adjustment is transport. Switching from private AC vans to Sri Lanka Railways 2nd/3rd Class reserved seats saves between LKR 5,000 and LKR 12,000 per leg while offering world-famous hill country views. Choosing family-run homestays over commercial hotels also saves ~30% with homemade breakfasts included.",
  "train":
    "Yes! Sri Lanka Railways operates iconic lines: the Mainline (Colombo to Kandy, Nanu Oya/Nuwara Eliya, Ella, Badulla) and the Coastal Line (Colombo to Galle and Matara). Reserved 2nd Class seats typically cost LKR 1,500–2,500, which is over 75% cheaper than private taxis and far more scenic.",
  "accommodation":
    "Sri Lanka has an extensive network of government-registered and community-rated homestays. In Ella and Kandy, clean private homestays with hot water and mountain balconies average LKR 4,000–7,000/night for two, compared to LKR 15,000–25,000 for standard tourist hotels.",
  "days":
    "Yes, you can streamline the 4-Day Ella trip into 3 days by taking the early morning express train directly to Ella on Day 1, exploring Nine Arch Bridge and Little Adam's Peak on Day 2, and visiting Ravana Falls before catching the evening return on Day 3. This reduces accommodation costs by ~LKR 14,000!",
  "default":
    "Thank you for asking! As an AI trained on Sri Lankan travel logistics, I recommend balancing train transit, authentic homestays, and local food stops to maximize cultural immersion while respecting your target budget. What specific aspect of your itinerary would you like to tweak?",
};
