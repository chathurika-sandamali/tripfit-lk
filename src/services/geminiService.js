/**
 * TripFit LK - Google Gemini AI Service
 * Connects to Google's Free Gemini API (gemini-1.5-flash) to generate real budget-fitted
 * travel itineraries and power the live AI Travel Assistant.
 * 
 * Includes automatic graceful fallback to local Sri Lankan heuristics if no API key is provided.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Check if a Gemini API key is configured in the environment.
 */
export const isGeminiConfigured = () => {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '' && GEMINI_API_KEY !== 'your_free_gemini_api_key_here');
};

/**
 * Generate a complete, realistic trip plan fitted to the user's budget using Google Gemini.
 * Supports current Sri Lankan travel as well as future global event travel.
 */
export const generateTripWithAI = async ({
  budget = 100000,
  destination = 'Anywhere in Sri Lanka',
  travelers = 2,
  duration = 4,
  interests = ['Culture & Heritage', 'Scenic Nature'],
  travelStyle = 'Balanced Explorer',
  event = '',
  currency = 'LKR',
}) => {
  if (!isGeminiConfigured()) {
    console.info('[TripFit LK] No Gemini API key detected. Using high-fidelity local Sri Lankan heuristic engine.');
    return null; // Signals caller to use local engine
  }

  const prompt = `
You are the master AI budget travel planner for "TripFit LK" (Sri Lanka's premier budget-first travel planner, expanding globally).
Your mission: Calculate a realistic, high-value itinerary where every expense fits comfortably within the user's budget.

USER CONSTRAINTS:
- Total Budget: ${currency} ${Number(budget).toLocaleString()}
- Destination Preference: ${destination}
- Travelers: ${travelers} people
- Trip Duration: ${duration} days
- Interests: ${interests.join(', ')}
- Travel Style: ${travelStyle}
${event ? `- Special Event / Focus: ${event}` : ''}

REALISM GUIDELINES FOR SRI LANKA (or destination):
1. TRANSPORT: Use realistic local options (Sri Lanka Railways reserved/unreserved trains, express buses, metered tuk-tuks, or hired vans). Break down costs accurately.
2. ACCOMMODATION: Choose real-world certified homestays, guesthouses, or boutique hotels matching the budget.
3. FOOD: Calculate authentic local dining (rice & curry, street food, local cafes) multiplied by travelers and days.
4. ACTIVITIES: Use actual landmark entry fees (e.g. Temple of the Tooth, Sigiriya, tea factory tours, national parks, viewpoints).
5. BUDGET RULE: The total estimated cost MUST be less than or very close to the user's spending limit (${currency} ${budget}). Provide surplus amount.

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON object (no markdown, no backticks, no explanations outside JSON) matching this exact JSON schema:
{
  "id": "ai-generated-custom-trip",
  "title": "${duration}-Day Personalized AI Journey",
  "subtitle": "Short descriptive route subtitle with key highlights",
  "destination": "${destination === 'Anywhere in Sri Lanka' ? 'Top Recommended Region' : destination}",
  "duration": ${duration},
  "travelers": ${travelers},
  "targetBudget": ${budget},
  "estimatedCost": 92000,
  "savingsAmount": 8000,
  "fitStatus": "Fits Budget",
  "whyRecommended": "2-3 sentences explaining how this trip maximizes the user's budget and why these specific transit and lodging options were selected.",
  "breakdown": {
    "transport": 18000,
    "accommodation": 35000,
    "food": 23000,
    "activities": 16000
  },
  "days": [
    {
      "day": 1,
      "title": "Arrival & Initial Exploration",
      "legs": [
        {
          "time": "Morning (08:30)",
          "title": "Departure & Transit",
          "description": "Scenic train journey or highway express bus with detailed route advice",
          "cost": 2500,
          "category": "transport"
        },
        {
          "time": "Afternoon (13:00)",
          "title": "Check-in & Cultural Walk",
          "description": "Boutique homestay check-in followed by local heritage walk",
          "cost": 1500,
          "category": "activities"
        }
      ]
    }
  ],
  "optimizationOptions": [
    {
      "id": "ai_transport_lever",
      "category": "Transit",
      "categoryKey": "transport",
      "title": "Smart Public Transit Option",
      "description": "Trade private vehicle transfers for scenic express train",
      "savings": 6500,
      "currentCost": 18000,
      "optimizedCost": 11500
    },
    {
      "id": "ai_accommodation_lever",
      "category": "Stay",
      "categoryKey": "accommodation",
      "title": "Certified Boutique Homestay",
      "description": "Opt for highly rated family guesthouses with breakfast included",
      "savings": 9000,
      "currentCost": 35000,
      "optimizedCost": 26000
    }
  ]
}
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn(`[TripFit LK] Gemini API returned error ${response.status}:`, errBody);
      return null;
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean JSON response (strip markdown fences if present)
    const cleanedJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedTrip = JSON.parse(cleanedJson);

    return parsedTrip;
  } catch (error) {
    console.error('[TripFit LK] Error calling Gemini API, falling back to local engine:', error);
    return null;
  }
};

/**
 * Chat with Gemini AI Assistant for live travel advice, Sri Lankan transit queries,
 * and future event travel consulting.
 */
export const chatWithGemini = async (messages, context = {}) => {
  if (!isGeminiConfigured()) {
    return getLocalAssistantResponse(messages[messages.length - 1]?.text || '');
  }

  const systemContext = `
You are the official "TripFit LK AI Travel Assistant".
Your goal is to give accurate, friendly, highly practical travel and budgeting advice for Sri Lanka (and global budget travel).
Key attributes:
- Deep knowledge of Sri Lanka Railways (timetables, classes: 1st, 2nd, 3rd, reservation rules).
- Real tuk-tuk and bus fares across major routes (Colombo, Kandy, Ella, Galle, Sigiriya, Nuwara Eliya).
- Budget-conscious tips (how to eat authentic food cheaply, best free viewpoints, off-peak homestay deals).
- Forward-looking: Can also provide advice on traveling to international concerts (BTS, Coldplay) and sports events on a budget.
- Format responses cleanly with short bullet points, friendly emojis, and exact LKR figures where applicable.
Current context: User has ${context.budget ? `a budget of LKR ${Number(context.budget).toLocaleString()}` : 'not yet entered a budget'}.
`;

  const conversationContents = [
    {
      role: 'user',
      parts: [{ text: systemContext }],
    },
    {
      role: 'model',
      parts: [{ text: 'Ayubowan! I am your TripFit LK AI Assistant. How can I help make your trip fit your budget today?' }],
    },
    ...messages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[TripFit LK] Gemini chat returned error ${response.status}`);
      return getLocalAssistantResponse(messages[messages.length - 1]?.text || '');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalAssistantResponse(messages[messages.length - 1]?.text || '');
  } catch (error) {
    console.error('[TripFit LK] Gemini chat error, using local fallback:', error);
    return getLocalAssistantResponse(messages[messages.length - 1]?.text || '');
  }
};

/**
 * Intelligent local fallback responses for offline or unconfigured states.
 */
function getLocalAssistantResponse(userPrompt) {
  const query = userPrompt.toLowerCase();

  if (query.includes('train') || query.includes('railway') || query.includes('ticket')) {
    return `🚂 **Sri Lanka Railways Train Advice:**
- **Colombo to Kandy:** 2nd Class reserved is approx. LKR 1,200 - 1,500; unreserved 2nd Class is ~LKR 500.
- **Kandy to Ella (Scenic Main Line):** Unreserved tickets cost ~LKR 600 - 800 at the station counter 1 hour before departure. Reserved seats sell out 30 days in advance.
- **Tip:** Booking 2nd Class gives open windows for world-class hill country photos at half the cost of 1st class AC cars!`;
  }

  if (query.includes('concert') || query.includes('coldplay') || query.includes('bts') || query.includes('event')) {
    return `🎵 **Budget Event Travel Strategy:**
- **Tier 1 (Tickets):** Secure general admission/standing passes early at face value rather than secondary resale.
- **Tier 2 (Flights & Transit):** Book budget carriers (AirAsia, Scoot) 3-4 months ahead or travel overland via express rail.
- **Tier 3 (Lodging):** Choose verified social hostels within 3-4 metro stops of the venue instead of city-center luxury hotels.
- **Tip:** TripFit's upcoming Global Event engine will automatically bundle tickets + hostel + local metro into one fixed spending limit!`;
  }

  if (query.includes('food') || query.includes('eat') || query.includes('restaurant')) {
    return `🍛 **Sri Lanka Dining on a Budget:**
- **Local 'Bath Kade' (Rice & Curry):** LKR 400 - 800 per plate with unlimited dhal, pol sambol, and fresh vegetables.
- **Dinner Favorites:** Kottu roti and egg hoppers at local eateries cost ~LKR 500 - 900.
- **Tourist Cafes:** Expect LKR 2,000 - 3,500 per meal. Mix 1 tourist cafe meal with 2 authentic local meals to save over LKR 4,000 daily!`;
  }

  if (query.includes('hotel') || query.includes('stay') || query.includes('homestay')) {
    return `🏡 **Smart Accommodation Savings:**
- **Certified Homestays:** In Ella and Kandy, family-run guesthouses offer clean private rooms with authentic Sri Lankan breakfast for LKR 5,000 - 8,000/night.
- **Resorts:** Often exceed LKR 30,000/night. Toggling our 'Homestay Lever' in the Optimizer immediately brings high-end itineraries into budget!`;
  }

  return `Ayubowan! TripFit LK helps you plan and optimize trips around your exact budget. 
Whether you're exploring Sri Lanka by scenic train or planning a future trip for a major concert like Coldplay or BTS, I can help you break down transport, lodging, food, and passes to keep you 100% within your spending limit. What destination or budget are you considering?`;
}
