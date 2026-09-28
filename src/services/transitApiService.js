/**
 * TripFit LK - 12Go Asia Partner Transit API Service
 * 
 * Integration layer for fetching live Sri Lanka Railways and intercity bus fares
 * via 12Go Asia's partner/affiliate API.
 * 
 * Features:
 * - Checks API configuration via VITE_12GO_API_KEY environment variable.
 * - In-memory Map cache keyed by route and travel class with 1-hour TTL.
 * - Graceful fallback: returns null (never throws) if unconfigured or on network/API failure,
 *   enabling callers to fall back directly to src/services/localFareEngine.js.
 */

const TWELVE_GO_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_12GO_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_12GO_API_KEY) ||
  '';

/**
 * 1-hour cache Time-To-Live in milliseconds.
 */
export const CACHE_TTL_MS = 60 * 60 * 1000; // 3,600,000 ms

/**
 * In-memory transit fare cache.
 * Key: `${mode}:${from}:${to}:${class}`
 * Value: { data: NormalizedFareObject, timestamp: number }
 */
export const transitCache = new Map();

/**
 * Helper to generate a normalized cache key.
 * 
 * @param {'train'|'bus'} mode - Transport mode
 * @param {string} from - Origin station or city
 * @param {string} to - Destination station or city
 * @param {string} travelClass - Seat or bus service category
 * @returns {string}
 */
export const buildTransitCacheKey = (mode, from, to, travelClass) => {
  const m = (mode || '').toLowerCase().trim();
  const f = (from || '').toLowerCase().trim();
  const t = (to || '').toLowerCase().trim();
  const c = (travelClass || '').toLowerCase().trim();
  return `${m}:${f}:${t}:${c}`;
};

/**
 * Retrieve cached fare data if present and not expired.
 * 
 * @param {string} cacheKey - Generated cache key
 * @returns {Object|null} Cached fare object or null if expired/missing
 */
export const getCachedTransitFare = (cacheKey) => {
  const entry = transitCache.get(cacheKey);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    transitCache.delete(cacheKey);
    return null;
  }

  return entry.data;
};

/**
 * Store fare record in the in-memory cache with current timestamp.
 * 
 * @param {string} cacheKey - Generated cache key
 * @param {Object} data - Normalized fare payload
 */
export const setCachedTransitFare = (cacheKey, data) => {
  transitCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Clear the in-memory cache (useful for testing or manual refreshes).
 */
export const clearTransitCache = () => {
  transitCache.clear();
};

/**
 * Check if the 12Go Asia partner API key is configured in the environment.
 * Follows the same pattern as isGeminiConfigured() in geminiService.js.
 * 
 * @returns {boolean}
 */
export const isTransitApiConfigured = () => {
  return Boolean(
    TWELVE_GO_API_KEY &&
    TWELVE_GO_API_KEY.trim() !== '' &&
    TWELVE_GO_API_KEY !== 'your_12go_api_key_here'
  );
};

/**
 * Fetch real train fare between Sri Lanka Railways stations from 12Go Asia API.
 * 
 * @param {Object} params
 * @param {string} params.originStation - Departure station (e.g., 'Colombo Fort', 'Kandy')
 * @param {string} params.destinationStation - Arrival station (e.g., 'Ella', 'Galle')
 * @param {string} [params.travelClass='2nd Class'] - Class category (e.g., '1st Class', '2nd Class', '3rd Class')
 * @returns {Promise<{
 *   mode: 'train',
 *   from: string,
 *   to: string,
 *   class: string,
 *   fare: number,
 *   currency: string,
 *   source: '12go-live'
 * } | null>} Normalized fare object, or null on failure/unconfigured
 */
export const fetchTrainFare = async ({
  originStation,
  destinationStation,
  travelClass = '2nd Class',
}) => {
  const cacheKey = buildTransitCacheKey('train', originStation, destinationStation, travelClass);

  // 1. Check in-memory cache first (1-hour TTL)
  const cached = getCachedTransitFare(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Check if API credentials are configured
  if (!isTransitApiConfigured()) {
    console.info(
      '[TripFit LK - Transit API] No 12Go API key configured. Skipping live train fare lookup (fallback available).'
    );
    return null;
  }

  try {
    // ------------------------------------------------------------------------
    // TODO: [12Go Asia Partner API Integration]
    // Once affiliate/partner application is approved:
    // 1. Verify endpoint URL (e.g., https://api.12go.asia/v1/schedules or partner gateway).
    // 2. Update auth header format ('X-API-Key', 'Authorization: Bearer', etc.).
    // 3. Map originStation & destinationStation to 12Go location slugs if required.
    // 4. Extract price from 12Go's ticket array based on travelClass.
    //
    // Endpoint placeholder:
    const ENDPOINT = `https://api.12go.asia/v1/schedules?from=${encodeURIComponent(
      originStation
    )}&to=${encodeURIComponent(destinationStation)}&mode=train`;

    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${TWELVE_GO_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(
        `[TripFit LK - Transit API] 12Go Train API error ${response.status}: ${errText}`
      );
      return null;
    }

    const payload = await response.json();

    // Map 12Go API response payload to normalized shape
    // (Adjust property paths once final API response schema is received)
    const fareAmount = Number(
      payload?.price ||
      payload?.fare ||
      payload?.tickets?.[0]?.price ||
      payload?.data?.[0]?.fare
    );

    if (!fareAmount || isNaN(fareAmount)) {
      console.warn('[TripFit LK - Transit API] Unable to extract valid train fare from 12Go response payload.');
      return null;
    }

    const normalizedResult = {
      mode: 'train',
      from: originStation,
      to: destinationStation,
      class: travelClass,
      fare: fareAmount,
      currency: payload?.currency || 'LKR',
      source: '12go-live',
    };

    // Store in 1-hour cache
    setCachedTransitFare(cacheKey, normalizedResult);

    return normalizedResult;
  } catch (error) {
    console.error(
      '[TripFit LK - Transit API] Error fetching train fare from 12Go API, falling back to local engine:',
      error
    );
    return null;
  }
};

/**
 * Fetch real intercity bus fare between Sri Lankan cities from 12Go Asia API.
 * 
 * @param {Object} params
 * @param {string} params.originCity - Departure city (e.g., 'Colombo', 'Kandy')
 * @param {string} params.destinationCity - Arrival city (e.g., 'Galle', 'Nuwara Eliya')
 * @param {string} [params.busType='Expressway AC'] - Bus service category (e.g., 'Expressway AC', 'Luxury', 'Standard')
 * @returns {Promise<{
 *   mode: 'bus',
 *   from: string,
 *   to: string,
 *   class: string,
 *   fare: number,
 *   currency: string,
 *   source: '12go-live'
 * } | null>} Normalized fare object, or null on failure/unconfigured
 */
export const fetchBusFare = async ({
  originCity,
  destinationCity,
  busType = 'Expressway AC',
}) => {
  const cacheKey = buildTransitCacheKey('bus', originCity, destinationCity, busType);

  // 1. Check in-memory cache first (1-hour TTL)
  const cached = getCachedTransitFare(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Check if API credentials are configured
  if (!isTransitApiConfigured()) {
    console.info(
      '[TripFit LK - Transit API] No 12Go API key configured. Skipping live bus fare lookup (fallback available).'
    );
    return null;
  }

  try {
    // ------------------------------------------------------------------------
    // TODO: [12Go Asia Partner API Integration]
    // Once affiliate/partner application is approved:
    // 1. Verify endpoint URL for intercity bus schedules.
    // 2. Update auth header and query parameters.
    // 3. Extract matching coach fare for busType.
    //
    // Endpoint placeholder:
    const ENDPOINT = `https://api.12go.asia/v1/schedules?from=${encodeURIComponent(
      originCity
    )}&to=${encodeURIComponent(destinationCity)}&mode=bus`;

    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${TWELVE_GO_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(
        `[TripFit LK - Transit API] 12Go Bus API error ${response.status}: ${errText}`
      );
      return null;
    }

    const payload = await response.json();

    // Map 12Go API response payload to normalized shape
    const fareAmount = Number(
      payload?.price ||
      payload?.fare ||
      payload?.tickets?.[0]?.price ||
      payload?.data?.[0]?.fare
    );

    if (!fareAmount || isNaN(fareAmount)) {
      console.warn('[TripFit LK - Transit API] Unable to extract valid bus fare from 12Go response payload.');
      return null;
    }

    const normalizedResult = {
      mode: 'bus',
      from: originCity,
      to: destinationCity,
      class: busType,
      fare: fareAmount,
      currency: payload?.currency || 'LKR',
      source: '12go-live',
    };

    // Store in 1-hour cache
    setCachedTransitFare(cacheKey, normalizedResult);

    return normalizedResult;
  } catch (error) {
    console.error(
      '[TripFit LK - Transit API] Error fetching bus fare from 12Go API, falling back to local engine:',
      error
    );
    return null;
  }
};
