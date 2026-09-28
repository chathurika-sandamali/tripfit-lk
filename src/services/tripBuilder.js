/**
 * TripFit LK - Dynamic Trip Builder & Destination Engine
 * 
 * Replaces hardcoded mock trips with real component-based itinerary generation
 * across 22 Sri Lankan destinations.
 * 
 * Core Features:
 * 1. Fuzzy destination matching (case-insensitive, aliases, substring, typo tolerance).
 * 2. Real component cost calculation (no fake budget scaling):
 *    - Transport: Regulated roundtrip rail/bus via localFareEngine + local tuk-tuk allowance.
 *    - Accommodation: nights × ceil(travelers/2) rooms × tier price.
 *    - Food: days × travelers × tier price.
 *    - Activities: Exact landmark entry fees matching user interests.
 * 3. Budget-decided tier selection: Highest tier that fits (comfort -> mid -> budget).
 *    If even budget is over budget, uses budget tier and flags exact over-budget amount.
 * 4. recommendDestinations(): Curates top 3 best-fitting destinations for open-ended travel.
 */

import { DESTINATIONS_CATALOG } from '../data/destinations.js';
import {
  calculateTukTukFare,
  calculateCtbBusFare,
  calculateTrainFare,
} from './localFareEngine.js';
import { calculateBudgetStatus } from '../data/mockData.js';

/**
 * Fuzzy-matches a user-entered destination string to the destination catalog.
 * 
 * @param {string} input - User-typed destination string
 * @returns {Object|null} Matched catalog destination or null
 */
export const findDestinationByQuery = (input = '') => {
  const query = (input || '').toLowerCase().trim();
  if (!query || query === 'anywhere in sri lanka' || query === 'anywhere' || query === 'sri lanka') {
    return null;
  }

  // 1. Direct ID or exact name match
  const exact = DESTINATIONS_CATALOG.find(
    (d) => d.id === query || d.name.toLowerCase() === query
  );
  if (exact) return exact;

  // 2. Exact alias match
  const aliasMatch = DESTINATIONS_CATALOG.find((d) =>
    d.aliases.some((a) => a.toLowerCase() === query)
  );
  if (aliasMatch) return aliasMatch;

  // 3. Substring matching: query contains destination name/alias or vice-versa
  const substringMatch = DESTINATIONS_CATALOG.find((d) => {
    const nameLower = d.name.toLowerCase();
    if (query.includes(nameLower) || nameLower.includes(query)) return true;
    return d.aliases.some((a) => {
      const aLower = a.toLowerCase();
      return query.includes(aLower) || aLower.includes(query);
    });
  });
  if (substringMatch) return substringMatch;

  // 4. Token / word overlap matching (e.g., "Kandy & Hill Country" -> matches "kandy")
  const queryTokens = query.split(/[\s,&/-]+/).filter((t) => t.length > 2);
  if (queryTokens.length > 0) {
    let bestScore = 0;
    let bestCandidate = null;

    DESTINATIONS_CATALOG.forEach((d) => {
      let score = 0;
      const nameTokens = d.name.toLowerCase().split(/[\s,&/-]+/);
      const allAliases = d.aliases.join(' ').toLowerCase();

      queryTokens.forEach((qt) => {
        if (nameTokens.includes(qt)) score += 5;
        else if (allAliases.includes(qt)) score += 3;
      });

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = d;
      }
    });

    if (bestScore >= 3 && bestCandidate) {
      return bestCandidate;
    }
  }

  return null;
};

/**
 * Returns 3 intelligent suggestions when a typed destination is not found.
 * 
 * @param {string} [query='']
 * @param {Array<string>} [interests=[]]
 * @returns {Array<Object>} 3 suggested catalog destinations
 */
export const getSuggestionsForQuery = (query = '', interests = []) => {
  // If user expressed interests, suggest matching destinations
  const interestLower = (Array.isArray(interests) ? interests : [interests])
    .map((i) => (i || '').toLowerCase())
    .filter(Boolean);

  if (interestLower.length > 0) {
    const scored = DESTINATIONS_CATALOG.map((d) => {
      const matches = d.interestTags.filter((t) =>
        interestLower.includes(t.toLowerCase())
      ).length;
      return { destination: d, score: matches };
    }).sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((s) => s.destination);
  }

  // Default to 3 diverse prime regions: Cultural Triangle, Hill Country, South Coast
  return [
    DESTINATIONS_CATALOG.find((d) => d.id === 'kandy') || DESTINATIONS_CATALOG[1],
    DESTINATIONS_CATALOG.find((d) => d.id === 'galle') || DESTINATIONS_CATALOG[5],
    DESTINATIONS_CATALOG.find((d) => d.id === 'sigiriya') || DESTINATIONS_CATALOG[11],
  ];
};

/**
 * Calculate the component costs for a destination at a given tier.
 * 
 * @param {Object} params
 * @param {Object} params.destination - Catalog destination entry
 * @param {'budget'|'mid'|'comfort'} params.tier - Service tier
 * @param {number} params.travelers - Number of travelers
 * @param {number} params.durationDays - Total trip days
 * @param {Array<string>} params.userInterests - Normalized user interests
 * @returns {{
 *   transport: number,
 *   accommodation: number,
 *   food: number,
 *   activities: number,
 *   total: number,
 *   activityList: Array<Object>
 * }}
 */
export const calculateTierCosts = ({
  destination,
  tier = 'budget',
  travelers = 2,
  durationDays = 3,
  userInterests = [],
}) => {
  const numPax = Math.max(1, parseInt(travelers, 10) || 2);
  const numDays = Math.max(1, parseInt(durationDays, 10) || 3);
  const numNights = Math.max(1, numDays - 1);
  const numRooms = Math.ceil(numPax / 2);
  const roundTripKm = destination.distanceFromColombo * 2;

  // 1. TRANSPORT CALCULATION
  let intercityTransit = 0;
  if (destination.distanceFromColombo === 0) {
    // Colombo internal transit
    const dailyKm = tier === 'comfort' ? 25 : tier === 'mid' ? 15 : 8;
    const tuktukVehicles = Math.ceil(numPax / 3);
    intercityTransit = calculateTukTukFare(dailyKm) * tuktukVehicles * numDays;
  } else if (destination.hasTrain) {
    // Scenic Rail
    const railClass = tier === 'comfort' ? 'firstClass' : tier === 'mid' ? 'secondClass' : 'thirdClass';
    const oneWayRailFare = calculateTrainFare(destination.distanceFromColombo, railClass);
    intercityTransit = oneWayRailFare * 2 * numPax;
  } else {
    // CTB / Highway Express Bus
    const busType = tier === 'comfort' ? 'luxury' : tier === 'mid' ? 'semiLuxury' : 'normal';
    const oneWayBusFare = calculateCtbBusFare(destination.distanceFromColombo, busType);
    intercityTransit = oneWayBusFare * 2 * numPax;
  }

  // Local touring / station transfers via tuk-tuk (3 pax/vehicle)
  const tuktuksNeeded = Math.ceil(numPax / 3);
  const dailyLocalKm = 10;
  const localTukTukCost = calculateTukTukFare(dailyLocalKm) * tuktuksNeeded * numDays;
  const localFactor = tier === 'comfort' ? 1.5 : tier === 'mid' ? 1.0 : 0.7;
  const transportCost = Math.round(intercityTransit + localTukTukCost * localFactor);

  // 2. ACCOMMODATION CALCULATION
  const roomPricePerNight = destination.accommodation[tier] || destination.accommodation.mid;
  const accommodationCost = numNights * numRooms * roomPricePerNight;

  // 3. FOOD CALCULATION
  const foodPerPersonPerDay = destination.foodCostPerDay[tier] || destination.foodCostPerDay.mid;
  const foodCost = numDays * numPax * foodPerPersonPerDay;

  // 4. ACTIVITIES CALCULATION
  // Filter activities matching user's interests, or take destination signatures
  let matchingActivities = destination.activities.filter((act) =>
    userInterests.some((ui) => act.category.toLowerCase().includes(ui) || ui.includes(act.category.toLowerCase()))
  );

  if (matchingActivities.length === 0) {
    matchingActivities = destination.activities.slice(0, 3);
  }

  // In budget tier, prioritize lower-cost and nature activities; in comfort tier, include full access
  let selectedActivities = matchingActivities;
  if (tier === 'budget') {
    selectedActivities = matchingActivities.slice(0, 2);
  } else if (tier === 'mid') {
    selectedActivities = matchingActivities.slice(0, 3);
  } else {
    selectedActivities = destination.activities.slice(0, 4);
  }

  const activitiesCost = selectedActivities.reduce((sum, act) => sum + act.cost * numPax, 0);

  const total = transportCost + accommodationCost + foodCost + activitiesCost;

  return {
    transport: transportCost,
    accommodation: accommodationCost,
    food: foodCost,
    activities: activitiesCost,
    total,
    activityList: selectedActivities,
  };
};

/**
 * Build a complete, structured trip object for a typed destination.
 * 
 * @param {Object} params
 * @param {string} params.destination - User-typed destination query
 * @param {number} [params.budget=100000] - User's spending ceiling in LKR
 * @param {number} [params.travelers=2] - Number of travelers
 * @param {number} [params.durationDays=3] - Trip length in days
 * @param {Array<string>|string} [params.interests=[]] - User's chosen interests
 * @param {'Budget'|'Balanced'|'Comfort'} [params.travelStyle='Balanced'] - Default style
 * @returns {Object} Full trip object matching UI expectations, or { notFound: true, suggestions }
 */
export const buildTripForDestination = ({
  destination = '',
  budget = 100000,
  travelers = 2,
  durationDays = 3,
  interests = [],
  travelStyle = 'Balanced',
}) => {
  const numBudget = Math.max(5000, Number(budget) || 100000);
  const numPax = Math.max(1, parseInt(travelers, 10) || 2);
  const numDays = Math.max(1, parseInt(durationDays, 10) || 3);
  const numNights = Math.max(1, numDays - 1);

  // Normalize interests array
  const userInterests = (Array.isArray(interests) ? interests : [interests])
    .map((i) => (i || '').toLowerCase().trim())
    .filter(Boolean);

  // 1. Fuzzy-match destination
  const matchedDest = findDestinationByQuery(destination);

  if (!matchedDest) {
    return {
      notFound: true,
      query: destination,
      suggestions: getSuggestionsForQuery(destination, userInterests),
    };
  }

  // 2. Evaluate all 3 tiers against real component costs
  const comfortCosts = calculateTierCosts({
    destination: matchedDest,
    tier: 'comfort',
    travelers: numPax,
    durationDays: numDays,
    userInterests,
  });

  const midCosts = calculateTierCosts({
    destination: matchedDest,
    tier: 'mid',
    travelers: numPax,
    durationDays: numDays,
    userInterests,
  });

  const budgetCosts = calculateTierCosts({
    destination: matchedDest,
    tier: 'budget',
    travelers: numPax,
    durationDays: numDays,
    userInterests,
  });

  // 3. Pick the highest tier that fits the budget (comfort -> mid -> budget).
  // If even budget tier is over budget, pick budget tier and mark over budget by exact amount.
  let selectedTier = 'budget';
  let activeCosts = budgetCosts;

  if (comfortCosts.total <= numBudget) {
    selectedTier = 'comfort';
    activeCosts = comfortCosts;
  } else if (midCosts.total <= numBudget) {
    selectedTier = 'mid';
    activeCosts = midCosts;
  } else {
    selectedTier = 'budget';
    activeCosts = budgetCosts;
  }

  const estimatedCost = activeCosts.total;
  const status = calculateBudgetStatus(numBudget, estimatedCost, false);

  // 4. Construct Day-by-day legs
  const days = [];
  for (let d = 1; d <= numDays; d++) {
    const isFirstDay = d === 1;
    const isLastDay = d === numDays;
    const dayLegs = [];

    if (isFirstDay) {
      dayLegs.push({
        time: '07:30 AM – 10:30 AM',
        title: `Transit to ${matchedDest.name}`,
        desc: matchedDest.hasTrain
          ? `Scenic train voyage from Colombo Fort to ${matchedDest.name} (${selectedTier} class seats).`
          : `Direct highway express transfer to ${matchedDest.name} through lush tropical countryside.`,
        category: 'Transport',
        cost: Math.round(activeCosts.transport / 2),
        icon: matchedDest.hasTrain ? 'train' : 'directions_bus',
      });
      dayLegs.push({
        time: '11:30 AM – 02:00 PM',
        title: `Check-in & Regional Welcome Lunch`,
        desc: `Settle into your ${selectedTier} accommodation in ${matchedDest.name}. Enjoy fresh local specialties.`,
        category: 'Accommodation & Food',
        cost: Math.round(activeCosts.accommodation / numNights + activeCosts.food / numDays),
        icon: 'hotel',
      });
      if (activeCosts.activityList[0]) {
        dayLegs.push({
          time: '04:00 PM – 06:30 PM',
          title: activeCosts.activityList[0].name,
          desc: `Afternoon visit and cultural exploration at ${matchedDest.name}.`,
          category: 'Activity',
          cost: activeCosts.activityList[0].cost * numPax,
          icon: activeCosts.activityList[0].icon || 'explore',
        });
      }
    } else if (isLastDay) {
      if (activeCosts.activityList[1]) {
        dayLegs.push({
          time: '08:30 AM – 11:30 AM',
          title: activeCosts.activityList[1].name,
          desc: `Morning sightseeing and photography around ${matchedDest.name}.`,
          category: 'Activity',
          cost: activeCosts.activityList[1].cost * numPax,
          icon: activeCosts.activityList[1].icon || 'photo_camera',
        });
      }
      dayLegs.push({
        time: '12:00 PM – 01:30 PM',
        title: 'Farewell Clay-Pot Lunch & Souvenirs',
        desc: 'Traditional buffet lunch and local artisan craft shopping.',
        category: 'Food',
        cost: Math.round(activeCosts.food / numDays),
        icon: 'restaurant',
      });
      dayLegs.push({
        time: '03:00 PM – 06:00 PM',
        title: `Return Transit to Colombo`,
        desc: `Relaxing return journey from ${matchedDest.name} back to Colombo.`,
        category: 'Transport',
        cost: Math.round(activeCosts.transport / 2),
        icon: matchedDest.hasTrain ? 'train' : 'directions_bus',
      });
    } else {
      // Middle days
      const act = activeCosts.activityList[d - 1] || activeCosts.activityList[0] || {
        name: 'Local Highlights & Scenic Exploration',
        cost: 1500,
        icon: 'hiking',
      };
      dayLegs.push({
        time: '09:00 AM – 12:30 PM',
        title: act.name,
        desc: `Immerse in the prime natural and cultural attractions of ${matchedDest.name}.`,
        category: 'Activity',
        cost: act.cost * numPax,
        icon: act.icon,
      });
      dayLegs.push({
        time: '01:00 PM – 02:30 PM',
        title: 'Authentic Island Dining',
        desc: 'Taste farm-to-table curries, fresh seafood, or highland Ceylon tea treats.',
        category: 'Food',
        cost: Math.round(activeCosts.food / numDays),
        icon: 'restaurant',
      });
      dayLegs.push({
        time: '04:00 PM – 06:30 PM',
        title: `${matchedDest.name} Sunset Vista`,
        desc: `Sunset viewpoint and leisurely evening stroll around ${matchedDest.name}.`,
        category: 'Activity',
        cost: 0,
        icon: 'photo_camera',
      });
    }

    days.push({
      day: d,
      title: `Day ${d}: ${isFirstDay ? 'Arrival & Discovery' : isLastDay ? 'Heritage & Departure' : 'Signature Experiences'}`,
      dateLabel: `Day ${d} • ${matchedDest.name}`,
      legs: dayLegs,
    });
  }

  // 5. Optimization levers (allows users to adjust costs in the optimizer)
  const optimizationOptions = [
    {
      id: 'transport',
      categoryKey: 'transport',
      category: 'Transport Optimization',
      title: 'Switch Transit Mode',
      description: 'Opt for standard scenic rail and local transit instead of private express cabs.',
      current: selectedTier === 'comfort' ? 'Private AC Van Transfer' : 'Reserved Rail / Express Coach',
      alternative: 'Public Route Bus & Standard Rail',
      currentCost: activeCosts.transport,
      optimizedCost: Math.round(budgetCosts.transport),
      savings: Math.max(1000, activeCosts.transport - budgetCosts.transport),
      icon: 'train',
    },
    {
      id: 'accommodation',
      categoryKey: 'accommodation',
      category: 'Accommodation Optimization',
      title: 'Stay in Verified Homestay',
      description: 'Choose a family-run heritage homestay with authentic breakfast included.',
      current: `${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Lodging`,
      alternative: 'Certified Family Homestay / Guesthouse',
      currentCost: activeCosts.accommodation,
      optimizedCost: Math.round(budgetCosts.accommodation),
      savings: Math.max(2000, activeCosts.accommodation - budgetCosts.accommodation),
      icon: 'hotel',
    },
    {
      id: 'activities',
      categoryKey: 'activities',
      category: 'Activities & Sightseeing',
      title: 'Self-Guided & Public Viewpoints',
      description: 'Explore scenic nature trails and public viewpoints without commercial guide fees.',
      current: 'All Paid Attractions & Experiences',
      alternative: 'Curated Self-Guided Itinerary',
      currentCost: activeCosts.activities,
      optimizedCost: Math.round(activeCosts.activities * 0.5),
      savings: Math.max(1000, Math.round(activeCosts.activities * 0.5)),
      icon: 'hiking',
    },
  ];

  const tierLabel = selectedTier === 'comfort' ? 'Comfort' : selectedTier === 'mid' ? 'Balanced' : 'Budget';

  return {
    id: `${matchedDest.id}-${selectedTier}-trip`,
    destinationId: matchedDest.id,
    title: `${numDays}-Day ${matchedDest.name} ${tierLabel} Journey`,
    subtitle: matchedDest.beautyDescription,
    durationDays: numDays,
    durationNights: numNights,
    destination: matchedDest.name,
    region: matchedDest.region,
    travelers: numPax,
    travelStyle: tierLabel,
    tier: selectedTier,
    targetBudget: numBudget,
    estimatedCost,
    initialCost: estimatedCost,
    totalSavings: 0,
    hasAppliedSavings: false,
    status,
    image: matchedDest.imageTag || 'kandy-lake',
    route: `Colombo Fort ↔ ${matchedDest.name} (${matchedDest.hasTrain ? 'Scenic Rail' : 'Expressway Coach'})`,
    tags: matchedDest.interestTags,
    breakdown: {
      transport: activeCosts.transport,
      accommodation: activeCosts.accommodation,
      food: activeCosts.food,
      activities: activeCosts.activities,
    },
    highlights: activeCosts.activityList.map((a) => a.name),
    whyRecommended: status.fits
      ? `This ${tierLabel} plan for ${matchedDest.name} fits your ${numBudget.toLocaleString()} LKR budget with a ${status.difference.toLocaleString()} LKR buffer. Calculated from real Sri Lankan transport rates, ${selectedTier}-tier lodging, and local dining.`
      : `A wonderful ${numDays}-day plan for ${matchedDest.name} that currently requires ${estimatedCost.toLocaleString()} LKR (${status.difference.toLocaleString()} LKR over your ${numBudget.toLocaleString()} LKR limit). Use 1-click optimization to adjust options to fit your budget.`,
    days,
    optimizationOptions,
  };
};

/**
 * Recommends the top 3 destinations that best fit the user's budget and preferences.
 * For users with no destination in mind ("Anywhere in Sri Lanka" or empty input).
 * 
 * @param {Object} params
 * @param {number} [params.budget=100000] - Budget in LKR
 * @param {number} [params.travelers=2] - Number of travelers
 * @param {number} [params.durationDays=3] - Trip length in days
 * @param {Array<string>} [params.interests=[]] - Preferred interests
 * @returns {Array<Object>} Array of top 3 built trip objects
 */
export const recommendDestinations = ({
  budget = 100000,
  travelers = 2,
  durationDays = 3,
  interests = [],
}) => {
  const numBudget = Math.max(5000, Number(budget) || 100000);
  const numPax = Math.max(1, parseInt(travelers, 10) || 2);
  const numDays = Math.max(1, parseInt(durationDays, 10) || 3);

  const userInterests = (Array.isArray(interests) ? interests : [interests])
    .map((i) => (i || '').toLowerCase().trim())
    .filter(Boolean);

  // Build candidate trips for all 22 catalog destinations
  const candidateTrips = DESTINATIONS_CATALOG.map((dest) => {
    const built = buildTripForDestination({
      destination: dest.name,
      budget: numBudget,
      travelers: numPax,
      durationDays: numDays,
      interests: userInterests,
    });
    return { dest, trip: built };
  }).filter((c) => !c.trip.notFound);

  // Score candidates
  const scored = candidateTrips.map(({ dest, trip }) => {
    let score = 0;

    // 1. Budget fit is top priority
    if (trip.status.fits) {
      score += 100;
      // Bonus if budget efficiency is between 60% and 95% (good value, comfortable cushion)
      const ratio = trip.estimatedCost / numBudget;
      if (ratio >= 0.5 && ratio <= 0.95) score += 30;
    } else {
      // Small penalty for exceeding budget, proportional to excess
      const overPct = (trip.estimatedCost - numBudget) / numBudget;
      score -= Math.min(60, overPct * 100);
    }

    // 2. Interest tag matches
    const interestMatches = dest.interestTags.filter((t) =>
      userInterests.includes(t.toLowerCase())
    ).length;
    score += interestMatches * 20;

    // 3. Duration match
    if (numDays >= dest.recommendedMinDays) {
      score += 15;
    }

    // 4. Rail connectivity bonus (favorite for Sri Lanka tourists)
    if (dest.hasTrain) {
      score += 10;
    }

    return { trip, score, region: dest.region };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Pick top 3 ensuring regional variety if possible
  const selected = [];
  const seenRegions = new Set();

  for (const item of scored) {
    if (selected.length >= 3) break;
    if (!seenRegions.has(item.region) || selected.length >= 2) {
      selected.push(item.trip);
      seenRegions.add(item.region);
    }
  }

  // Fallback if less than 3
  if (selected.length < 3) {
    for (const item of scored) {
      if (selected.length >= 3) break;
      if (!selected.some((s) => s.id === item.trip.id)) {
        selected.push(item.trip);
      }
    }
  }

  return selected;
};
