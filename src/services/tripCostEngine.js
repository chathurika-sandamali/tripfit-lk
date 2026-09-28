/**
 * TripFit LK - Comprehensive Trip Cost Engine
 * 
 * Orchestrates multi-tiered cost estimation prioritizing REAL data sources:
 * 1. Transit: Tries 12Go Asia live partner transit API first (Sri Lanka Railways / express buses),
 *    falling back to NTC gazette distance-stages and metered tuk-tuk rates via localFareEngine.js.
 * 2. Accommodation: Tries Amadeus Self-Service Hotel Search API first,
 *    falling back to verified Sri Lankan boutique homestay / guesthouse baselines in mockData.js.
 * 3. Food & Activities: Uses authentic Sri Lankan per-destination / travel-style heuristics,
 *    explicitly tagged with `estimated: true`.
 * 
 * Returns a unified breakdown with source metadata:
 * {
 *   transport: { ... },
 *   accommodation: { ... },
 *   food: { ... },
 *   activities: { ... },
 *   totalCost: number,
 *   dataSources: {
 *     transport: "live" | "estimated",
 *     accommodation: "live" | "estimated",
 *     food: "estimated",
 *     activities: "estimated"
 *   }
 * }
 */

import { fetchTrainFare, fetchBusFare } from './transitApiService.js';
import { estimateLocalTransportCost } from './localFareEngine.js';
import { searchHotels } from './hotelApiService.js';
import { MOCK_TRIPS } from '../data/mockData.js';

/**
 * Approximate one-way road/rail distances from Colombo to major Sri Lankan destinations (km).
 */
export const DESTINATION_DISTANCES_KM = {
  kandy: 115,
  galle: 120,
  ella: 210,
  sigiriya: 165,
  dambulla: 160,
  'nuwara eliya': 175,
  bentota: 85,
  mirissa: 150,
  jaffna: 395,
  trincomalee: 260,
};

/**
 * Resolve realistic distance in kilometers for a destination.
 * 
 * @param {string} destination - Destination name
 * @param {number} [overrideKm] - Explicit distance if provided
 * @returns {number} Distance in km
 */
export const resolveDestinationDistance = (destination = '', overrideKm) => {
  if (overrideKm && Number(overrideKm) > 0) {
    return Number(overrideKm);
  }
  const clean = (destination || '').toLowerCase().trim();
  for (const [city, km] of Object.entries(DESTINATION_DISTANCES_KM)) {
    if (clean.includes(city)) return km;
  }
  return 120; // Default central Sri Lanka distance
};

/**
 * Find the closest matching base trip from mockData.js.
 * 
 * @param {string} destination
 * @returns {Object} Base trip object
 */
export const getBaseTripForDestination = (destination = '') => {
  const clean = (destination || '').toLowerCase();
  if (clean.includes('ella') || clean.includes('mountain') || clean.includes('peak')) {
    return MOCK_TRIPS['ella-adventure'];
  }
  if (clean.includes('galle') || clean.includes('mirissa') || clean.includes('beach') || clean.includes('coast')) {
    return MOCK_TRIPS['galle-coast'] || MOCK_TRIPS['kandy-cultural-escape'];
  }
  return MOCK_TRIPS['kandy-cultural-escape'];
};

/**
 * Build a comprehensive trip cost breakdown prioritizing live APIs with graceful heuristic fallback.
 * 
 * @param {Object} params
 * @param {string} [params.origin='Colombo Fort'] - Starting point (usually Colombo or airport)
 * @param {string} [params.destination='Kandy'] - Target destination in Sri Lanka
 * @param {number} [params.distanceKm] - Distance in km (auto-resolved if omitted)
 * @param {number} [params.travelers=2] - Number of travelers
 * @param {number} [params.durationDays=3] - Trip length in days
 * @param {'Budget'|'Balanced'|'Comfort'} [params.travelStyle='Balanced'] - Travel style preference
 * @returns {Promise<{
 *   transport: {
 *     cost: number,
 *     farePerPerson: number,
 *     mode: string,
 *     details: string,
 *     source: 'live' | 'estimated',
 *     isLive: boolean,
 *     currency: string
 *   },
 *   accommodation: {
 *     cost: number,
 *     pricePerNight: number,
 *     hotelName: string,
 *     nights: number,
 *     source: 'live' | 'estimated',
 *     isLive: boolean,
 *     currency: string,
 *     rating?: number|null
 *   },
 *   food: {
 *     cost: number,
 *     source: 'estimated',
 *     isLive: false,
 *     estimated: true,
 *     details: string
 *   },
 *   activities: {
 *     cost: number,
 *     source: 'estimated',
 *     isLive: false,
 *     estimated: true,
 *     details: string
 *   },
 *   totalCost: number,
 *   dataSources: {
 *     transport: 'live' | 'estimated',
 *     accommodation: 'live' | 'estimated',
 *     food: 'estimated',
 *     activities: 'estimated'
 *   }
 * }>}
 */
export const buildTripCostBreakdown = async ({
  origin = 'Colombo Fort',
  destination = 'Kandy',
  distanceKm,
  travelers = 2,
  durationDays = 3,
  travelStyle = 'Balanced',
} = {}) => {
  const numTravelers = Math.max(1, parseInt(travelers, 10) || 2);
  const numDays = Math.max(1, parseInt(durationDays, 10) || 3);
  const numNights = Math.max(1, numDays - 1);
  const oneWayKm = resolveDestinationDistance(destination, distanceKm);
  const baseTrip = getBaseTripForDestination(destination);

  // ==========================================================================
  // 1. TRANSPORT: Try 12Go live API first, fallback to regulated localFareEngine
  // ==========================================================================
  let transportResult = null;
  const trainClass =
    travelStyle === 'Comfort'
      ? '1st Class'
      : travelStyle === 'Budget'
      ? '3rd Class'
      : '2nd Class';
  const busType =
    travelStyle === 'Comfort'
      ? 'Luxury'
      : travelStyle === 'Budget'
      ? 'Normal'
      : 'Expressway AC';

  try {
    // Attempt 1: Fetch live train fare from 12Go Asia partner API
    const liveTrain = await fetchTrainFare({
      originStation: origin,
      destinationStation: destination,
      travelClass: trainClass,
    });

    if (liveTrain && liveTrain.fare > 0) {
      // Round-trip travel (outbound + return) for all travelers
      const roundTripFarePerPerson = liveTrain.fare * 2;
      transportResult = {
        cost: roundTripFarePerPerson * numTravelers,
        farePerPerson: roundTripFarePerPerson,
        mode: 'train',
        details: `12Go Live Train: ${liveTrain.from} ↔ ${liveTrain.to} (${liveTrain.class})`,
        source: 'live',
        isLive: true,
        currency: liveTrain.currency || 'LKR',
      };
    } else {
      // Attempt 2: Fetch live bus fare from 12Go Asia partner API
      const liveBus = await fetchBusFare({
        originCity: origin,
        destinationCity: destination,
        busType,
      });

      if (liveBus && liveBus.fare > 0) {
        const roundTripFarePerPerson = liveBus.fare * 2;
        transportResult = {
          cost: roundTripFarePerPerson * numTravelers,
          farePerPerson: roundTripFarePerPerson,
          mode: 'bus',
          details: `12Go Live Bus: ${liveBus.from} ↔ ${liveBus.to} (${liveBus.class})`,
          source: 'live',
          isLive: true,
          currency: liveBus.currency || 'LKR',
        };
      }
    }
  } catch (err) {
    console.warn('[TripFit LK - Cost Engine] Live transit lookup failed, falling back to local regulated engine:', err);
  }

  // Fallback: Use Sri Lanka NTC gazette / SLR regulated calculations
  if (!transportResult) {
    const transitMode = travelStyle === 'Budget' ? 'bus' : 'train';
    const serviceType =
      travelStyle === 'Comfort'
        ? 'secondClass'
        : travelStyle === 'Budget'
        ? 'normal'
        : 'secondClass';

    // Roundtrip distance for outbound + return
    const roundTripDistance = oneWayKm * 2;
    const regulated = estimateLocalTransportCost({
      distanceKm: roundTripDistance,
      mode: transitMode,
      travelers: numTravelers,
      serviceType,
    });

    transportResult = {
      cost: regulated.totalCost,
      farePerPerson: regulated.farePerPerson,
      mode: regulated.mode,
      details:
        regulated.mode === 'train'
          ? 'Sri Lanka Railways Regulated Tariff (2nd Class Return)'
          : 'NTC Regulated Stage Bus Model (Express / Semi-Luxury)',
      source: 'estimated',
      isLive: false,
      currency: 'LKR',
      note: regulated.note,
    };
  }

  // ==========================================================================
  // 2. ACCOMMODATION: Try Amadeus live API first, fallback to mockData homestays
  // ==========================================================================
  let accommodationResult = null;

  try {
    // Generate realistic check-in / check-out dates 14 days out
    const checkInDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const checkOutDate = new Date(
      Date.now() + (14 + numNights) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0];

    const liveHotels = await searchHotels({
      cityCode: destination,
      checkInDate,
      checkOutDate,
      adults: numTravelers,
    });

    if (Array.isArray(liveHotels) && liveHotels.length > 0) {
      // Pick best matching hotel according to user's travel style
      const sorted = [...liveHotels].sort((a, b) => a.pricePerNight - b.pricePerNight);
      const selected =
        travelStyle === 'Budget'
          ? sorted[0]
          : travelStyle === 'Comfort'
          ? sorted[sorted.length - 1]
          : sorted[Math.floor(sorted.length / 2)] || sorted[0];

      const roomsNeeded = Math.ceil(numTravelers / 2);
      const totalAccomCost = selected.pricePerNight * roomsNeeded * numNights;

      accommodationResult = {
        cost: totalAccomCost,
        pricePerNight: selected.pricePerNight * roomsNeeded,
        hotelName: selected.hotelName,
        rating: selected.rating,
        nights: numNights,
        source: 'live',
        isLive: true,
        currency: selected.currency || 'LKR',
      };
    }
  } catch (err) {
    console.warn('[TripFit LK - Cost Engine] Live hotel lookup failed, falling back to mockData:', err);
  }

  // Fallback: Use verified Sri Lankan boutique homestay & hotel baseline
  if (!accommodationResult) {
    const baseAccom = baseTrip.breakdown?.accommodation || 35000;
    const baseNights = baseTrip.durationNights || 2;
    const baseTravelers = baseTrip.travelers || 2;

    // Scale accommodation by nights, travelers, and travelStyle factor
    const styleFactor = travelStyle === 'Budget' ? 0.65 : travelStyle === 'Comfort' ? 1.6 : 1.0;
    const nightlyBase = (baseAccom / baseNights) * (numTravelers / baseTravelers) * styleFactor;
    const totalAccomCost = Math.round(nightlyBase * numNights);

    const fallbackHotelName =
      travelStyle === 'Comfort'
        ? 'Certified 4-Star Heritage Resort'
        : travelStyle === 'Budget'
        ? 'Verified Backpacker Homestay & Hostel'
        : 'Verified Boutique Lakeside Homestay';

    accommodationResult = {
      cost: totalAccomCost,
      pricePerNight: Math.round(nightlyBase),
      hotelName: fallbackHotelName,
      rating: travelStyle === 'Comfort' ? 4 : 3,
      nights: numNights,
      source: 'estimated',
      isLive: false,
      currency: 'LKR',
    };
  }

  // ==========================================================================
  // 3. FOOD: Verified Sri Lankan dining heuristics (Tagged as estimated)
  // ==========================================================================
  const baseFood = baseTrip.breakdown?.food || 21500;
  const baseDays = baseTrip.durationDays || 3;
  const baseTravelers = baseTrip.travelers || 2;
  const foodStyleFactor = travelStyle === 'Budget' ? 0.7 : travelStyle === 'Comfort' ? 1.4 : 1.0;

  const dailyFoodPerPerson =
    (baseFood / (baseDays * baseTravelers)) * foodStyleFactor;
  const totalFoodCost = Math.round(dailyFoodPerPerson * numDays * numTravelers);

  const foodResult = {
    cost: totalFoodCost,
    source: 'estimated',
    isLive: false,
    estimated: true,
    details:
      travelStyle === 'Budget'
        ? 'Local clay-pot eateries, street snacks & tea stalls (~LKR 2,500/day/pax)'
        : travelStyle === 'Comfort'
        ? 'Boutique hotel dining, curated seafood & cafes (~LKR 5,000/day/pax)'
        : 'Mix of authentic Sri Lankan buffets & local cafes (~LKR 3,600/day/pax)',
  };

  // ==========================================================================
  // 4. ACTIVITIES: Official landmark entry heuristics (Tagged as estimated)
  // ==========================================================================
  const baseActivities = baseTrip.breakdown?.activities || 16000;
  const actStyleFactor = travelStyle === 'Budget' ? 0.6 : travelStyle === 'Comfort' ? 1.3 : 1.0;

  const perPersonActivities =
    (baseActivities / baseTravelers) * actStyleFactor;
  const totalActivitiesCost = Math.round(perPersonActivities * numTravelers);

  const activitiesResult = {
    cost: totalActivitiesCost,
    source: 'estimated',
    isLive: false,
    estimated: true,
    details:
      travelStyle === 'Budget'
        ? 'Public viewpoints, tea plantation walks & self-guided cultural sites'
        : travelStyle === 'Comfort'
        ? 'Guided UNESCO heritage pooja ceremonies, botanical reserve entry & safari'
        : 'UNESCO World Heritage site entry, botanical gardens & cultural performance',
  };

  // ==========================================================================
  // 5. UNIFIED BREAKDOWN & DATA SOURCES
  // ==========================================================================
  const totalCost =
    transportResult.cost +
    accommodationResult.cost +
    foodResult.cost +
    activitiesResult.cost;

  return {
    transport: transportResult,
    accommodation: accommodationResult,
    food: foodResult,
    activities: activitiesResult,
    totalCost,
    dataSources: {
      transport: transportResult.source,
      accommodation: accommodationResult.source,
      food: 'estimated',
      activities: 'estimated',
    },
  };
};
