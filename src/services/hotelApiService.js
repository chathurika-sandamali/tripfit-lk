/**
 * TripFit LK - Amadeus Hotel Search API Service
 * 
 * Fetches real-world hotel pricing and availability using the Amadeus for Developers
 * Self-Service Hotel Search API (https://developers.amadeus.com).
 * 
 * Features:
 * - OAuth2 client-credentials authentication flow with automatic in-memory token caching.
 * - Searches hotel offers by city, dates, occupancy, and price ceiling.
 * - Returns a clean normalized shape: { hotelName, pricePerNight, currency, rating, source: "amadeus-live" }.
 * - Graceful fallback: returns null (never throws) if credentials are missing or on API/network errors,
 *   allowing callers to fall back directly to mockData.js accommodation baselines.
 */

const AMADEUS_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AMADEUS_CLIENT_ID) ||
  (typeof process !== 'undefined' && process.env?.VITE_AMADEUS_CLIENT_ID) ||
  '';

const AMADEUS_CLIENT_SECRET =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AMADEUS_CLIENT_SECRET) ||
  (typeof process !== 'undefined' && process.env?.VITE_AMADEUS_CLIENT_SECRET) ||
  '';

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

/**
 * Common Sri Lankan destination name to IATA city / nearest airport code mapping.
 */
export const SRI_LANKA_CITY_CODES = {
  colombo: 'CMB',
  kandy: 'KDY',
  galle: 'GLK',
  sigiriya: 'GIU',
  'nuwara eliya': 'NWA',
  ella: 'CMB',
  bentota: 'BTT',
  trincomalee: 'TRR',
  jaffna: 'JAF',
  negombo: 'CMB',
};

/**
 * In-memory OAuth2 token cache state.
 */
let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

/**
 * Check if Amadeus client credentials are validly configured in the environment.
 * 
 * @returns {boolean}
 */
export const isAmadeusConfigured = () => {
  return Boolean(
    AMADEUS_CLIENT_ID &&
    AMADEUS_CLIENT_ID.trim() !== '' &&
    AMADEUS_CLIENT_ID !== 'your_amadeus_client_id_here' &&
    AMADEUS_CLIENT_SECRET &&
    AMADEUS_CLIENT_SECRET.trim() !== '' &&
    AMADEUS_CLIENT_SECRET !== 'your_amadeus_client_secret_here'
  );
};

/**
 * Reset the token cache (useful for testing or forced token refresh).
 */
export const clearAmadeusTokenCache = () => {
  tokenCache = {
    accessToken: null,
    expiresAt: 0,
  };
};

/**
 * Retrieve an OAuth2 Bearer access token from Amadeus using client credentials flow.
 * Caches the token in memory until it expires (with a 60-second safety cushion).
 * 
 * @returns {Promise<string|null>} Active access token string, or null on error/unconfigured
 */
export const getAmadeusAccessToken = async () => {
  if (!isAmadeusConfigured()) {
    console.info(
      '[TripFit LK - Hotel API] Amadeus credentials not configured. Skipping token acquisition (fallback available).'
    );
    return null;
  }

  const now = Date.now();

  // Return cached token if still valid (keeping 60 seconds buffer before true expiry)
  if (tokenCache.accessToken && now < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken;
  }

  try {
    const bodyParams = new URLSearchParams();
    bodyParams.append('grant_type', 'client_credentials');
    bodyParams.append('client_id', AMADEUS_CLIENT_ID);
    bodyParams.append('client_secret', AMADEUS_CLIENT_SECRET);

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(
        `[TripFit LK - Hotel API] Amadeus OAuth2 token failure ${response.status}: ${errText}`
      );
      return null;
    }

    const payload = await response.json();
    const token = payload.access_token;
    const expiresInSec = Number(payload.expires_in) || 1799;

    if (!token) {
      console.warn('[TripFit LK - Hotel API] No access_token returned in Amadeus auth response.');
      return null;
    }

    tokenCache = {
      accessToken: token,
      expiresAt: now + expiresInSec * 1000,
    };

    return token;
  } catch (error) {
    console.error(
      '[TripFit LK - Hotel API] Error acquiring Amadeus OAuth2 token, falling back to local estimates:',
      error
    );
    return null;
  }
};

/**
 * Helper to resolve city names or 3-letter IATA codes.
 * 
 * @param {string} input - City name or IATA code
 * @returns {string} 3-letter uppercase IATA city code
 */
export const resolveCityCode = (input = 'CMB') => {
  const cleaned = (input || '').toLowerCase().trim();
  return SRI_LANKA_CITY_CODES[cleaned] || cleaned.slice(0, 3).toUpperCase() || 'CMB';
};

/**
 * Search hotels in a destination using the Amadeus Hotel Search API.
 * 
 * @param {Object} params
 * @param {string} params.cityCode - 3-letter IATA code or city name (e.g., 'CMB', 'Kandy')
 * @param {string} [params.checkInDate] - Check-in date in YYYY-MM-DD format
 * @param {string} [params.checkOutDate] - Check-out date in YYYY-MM-DD format
 * @param {number} [params.adults=2] - Number of adult guests
 * @param {number} [params.maxPricePerNight] - Optional budget ceiling per night in LKR/USD
 * @returns {Promise<Array<{
 *   hotelName: string,
 *   pricePerNight: number,
 *   currency: string,
 *   rating: number|null,
 *   source: 'amadeus-live'
 * }> | null>} Array of normalized hotels, or null on failure/unconfigured
 */
export const searchHotels = async ({
  cityCode = 'CMB',
  checkInDate,
  checkOutDate,
  adults = 2,
  maxPricePerNight,
} = {}) => {
  // 1. Guard against unconfigured API keys
  if (!isAmadeusConfigured()) {
    console.info(
      '[TripFit LK - Hotel API] Amadeus API credentials not configured. Returning null to use mockData accommodation fallback.'
    );
    return null;
  }

  // 2. Acquire valid OAuth2 access token
  const token = await getAmadeusAccessToken();
  if (!token) {
    return null;
  }

  const iataCode = resolveCityCode(cityCode);

  // Compute number of nights to determine pricePerNight if total rate is returned
  let nightCount = 1;
  if (checkInDate && checkOutDate) {
    const diffMs = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    nightCount = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) || 1);
  }

  try {
    // ------------------------------------------------------------------------
    // Amadeus Self-Service Hotel Search Flow:
    // Step 1: Query hotel list for cityCode via /v1/reference-data/locations/hotels/by-city
    // Step 2: Query hotel pricing offers via /v3/shopping/hotel-offers
    // ------------------------------------------------------------------------
    const listUrl = `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${encodeURIComponent(
      iataCode
    )}`;

    const listRes = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!listRes.ok) {
      const errText = await listRes.text().catch(() => '');
      console.warn(
        `[TripFit LK - Hotel API] Amadeus hotel list request failed (${listRes.status}): ${errText}`
      );
      return null;
    }

    const listData = await listRes.json();
    const hotelsList = listData?.data || [];

    if (!hotelsList.length) {
      return [];
    }

    // Take top matching hotel IDs (Amadeus allows batching up to 20 hotelIds per query)
    const hotelIds = hotelsList.slice(0, 10).map((h) => h.hotelId).filter(Boolean);

    if (!hotelIds.length) {
      return [];
    }

    // Step 2: Fetch live offers for the selected hotels
    const queryParams = new URLSearchParams();
    queryParams.append('hotelIds', hotelIds.join(','));
    queryParams.append('adults', String(adults || 2));

    if (checkInDate) queryParams.append('checkInDate', checkInDate);
    if (checkOutDate) queryParams.append('checkOutDate', checkOutDate);
    if (maxPricePerNight) {
      const totalMax = Math.round(maxPricePerNight * nightCount);
      queryParams.append('priceRange', `1-${totalMax}`);
    }

    const offersUrl = `${AMADEUS_BASE_URL}/v3/shopping/hotel-offers?${queryParams.toString()}`;

    const offersRes = await fetch(offersUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!offersRes.ok) {
      const errText = await offersRes.text().catch(() => '');
      console.warn(
        `[TripFit LK - Hotel API] Amadeus hotel offers request failed (${offersRes.status}): ${errText}`
      );
      return null;
    }

    const offersData = await offersRes.json();
    const rawOffers = offersData?.data || [];

    // Normalize output to { hotelName, pricePerNight, currency, rating, source: "amadeus-live" }
    const normalizedHotels = rawOffers
      .map((item) => {
        const hotelName = item.hotel?.name || 'Certified Sri Lanka Hotel';
        const rating = Number(item.hotel?.rating) || null;
        const offer = item.offers?.[0];

        if (!offer) return null;

        const totalCost = Number(offer.price?.total) || 0;
        const baseAverage = Number(offer.price?.variations?.average?.base);
        const pricePerNight = Math.round(baseAverage || totalCost / nightCount || totalCost);
        const currency = offer.price?.currency || 'LKR';

        return {
          hotelName,
          pricePerNight,
          currency,
          rating,
          source: 'amadeus-live',
        };
      })
      .filter((h) => Boolean(h && h.pricePerNight > 0));

    // Apply maxPricePerNight filter if specified
    if (maxPricePerNight && maxPricePerNight > 0) {
      return normalizedHotels.filter((h) => h.pricePerNight <= maxPricePerNight);
    }

    return normalizedHotels;
  } catch (error) {
    console.error(
      '[TripFit LK - Hotel API] Error searching Amadeus hotels, falling back to mockData estimates:',
      error
    );
    return null;
  }
};
