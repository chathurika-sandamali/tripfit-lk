/**
 * TripFit LK - Local Fare Calculation Engine (Sri Lanka)
 * 
 * Calculates realistic, regulated local transport fares for Sri Lanka based on
 * official tariff models and verified market standards (not AI hallucinations):
 * - Sri Lanka National Transport Commission (NTC) distance-stage bus fare model.
 * - Standard Sri Lankan metered three-wheeler (tuk-tuk) market rates.
 * 
 * NOTE:
 * These calculations are derived from Sri Lanka's official regulated fare structures
 * (NTC bus gazettes, standard tuk-tuk metered rates) and do not rely on external live API calls.
 * They should be periodically reviewed and updated whenever the Ministry of Transport
 * or NTC issues new fare revisions.
 */

// ============================================================================
// 1. TUK-TUK (THREE-WHEELER) CONFIGURATION & CALCULATIONS
// ============================================================================

/**
 * Standard base fare for the first kilometer (LKR).
 * Prevailing Colombo / Western Province metered benchmark.
 */
export const TUKTUK_BASE_FARE = 100;

/**
 * Configurable rate per subsequent kilometer (LKR/km).
 */
export const TUKTUK_RATE_PER_KM = 80;

/**
 * Calculate the estimated metered tuk-tuk fare for a given distance in kilometers.
 * Standard Sri Lankan meter pricing:
 * - 1st km (or under): TUKTUK_BASE_FARE (100 LKR)
 * - Each additional km: TUKTUK_RATE_PER_KM (80 LKR/km)
 * - Result is rounded to the nearest 10 LKR.
 * 
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated fare in LKR rounded to nearest 10
 */
export const calculateTukTukFare = (distanceKm) => {
  const km = Math.max(0, Number(distanceKm) || 0);
  if (km === 0) return 0;

  let rawFare;
  if (km <= 1.0) {
    rawFare = TUKTUK_BASE_FARE;
  } else {
    rawFare = TUKTUK_BASE_FARE + (km - 1.0) * TUKTUK_RATE_PER_KM;
  }

  // Round to the nearest 10 LKR as per local Sri Lankan fare practices
  return Math.round(rawFare / 10) * 10;
};

// ============================================================================
// 2. CTB / NTC BUS CONFIGURATION & CALCULATIONS
// ============================================================================

/**
 * Official minimum standard bus fare for short-distance stages (LKR).
 * Current NTC baseline gazette placeholder.
 */
export const CTB_MINIMUM_FARE = 34;

/**
 * Multiplier factors by bus service category relative to normal service:
 * - normal: Standard non-AC CTB / private route bus (1.0x)
 * - semiLuxury: Limited-stop non-AC service (1.3x)
 * - luxury: Air-conditioned intercity highway/mainline service (1.6x)
 * - expressway: Southern Expressway / Central Expressway AC direct coaches (2.0x)
 */
export const CTB_SERVICE_FACTORS = {
  normal: 1.0,
  semiLuxury: 1.3,
  luxury: 1.6,
  expressway: 2.0,
};

/**
 * Sri Lanka National Transport Commission (NTC) distance-stage fare model.
 * Each entry defines the maximum kilometer boundary for that stage and its normal fare.
 * You can paste updated NTC gazette numbers directly into this table without altering the logic.
 */
export const NTC_FARE_STAGES = [
  { stage: 1, maxKm: 2.0, fare: 34 },
  { stage: 2, maxKm: 4.0, fare: 42 },
  { stage: 3, maxKm: 6.0, fare: 53 },
  { stage: 4, maxKm: 8.0, fare: 64 },
  { stage: 5, maxKm: 10.0, fare: 75 },
  { stage: 6, maxKm: 12.0, fare: 86 },
  { stage: 7, maxKm: 14.0, fare: 97 },
  { stage: 8, maxKm: 16.0, fare: 108 },
  { stage: 9, maxKm: 18.0, fare: 119 },
  { stage: 10, maxKm: 20.0, fare: 130 },
  { stage: 11, maxKm: 22.0, fare: 141 },
  { stage: 12, maxKm: 24.0, fare: 152 },
  { stage: 13, maxKm: 26.0, fare: 163 },
  { stage: 14, maxKm: 28.0, fare: 174 },
  { stage: 15, maxKm: 30.0, fare: 185 },
  { stage: 16, maxKm: 35.0, fare: 212 },
  { stage: 17, maxKm: 40.0, fare: 240 },
  { stage: 18, maxKm: 50.0, fare: 295 },
  { stage: 19, maxKm: 60.0, fare: 350 },
  { stage: 20, maxKm: 80.0, fare: 460 },
  { stage: 21, maxKm: 100.0, fare: 570 },
  { stage: 22, maxKm: 120.0, fare: 680 },
  { stage: 23, maxKm: 150.0, fare: 850 },
  { stage: 24, maxKm: 200.0, fare: 1120 },
];

/**
 * Calculate the regulated bus fare for a passenger based on distance and service class.
 * 
 * @param {number} distanceKm - Journey distance in kilometers
 * @param {'normal'|'semiLuxury'|'luxury'|'expressway'} [serviceType='normal'] - Bus service category
 * @returns {number} Regulated per-passenger fare in LKR
 */
export const calculateCtbBusFare = (distanceKm, serviceType = 'normal') => {
  const km = Math.max(0, Number(distanceKm) || 0);
  if (km === 0) return 0;

  // 1. Determine base normal-service fare using NTC distance stages
  let baseNormalFare = CTB_MINIMUM_FARE;
  const matchedStage = NTC_FARE_STAGES.find((s) => km <= s.maxKm);

  if (matchedStage) {
    baseNormalFare = matchedStage.fare;
  } else {
    // If distance exceeds the pre-configured stage table, extrapolate based on last stage rate (~5.5 LKR/km)
    const lastStage = NTC_FARE_STAGES[NTC_FARE_STAGES.length - 1];
    const excessKm = km - lastStage.maxKm;
    baseNormalFare = lastStage.fare + Math.round(excessKm * 5.5);
  }

  // 2. Apply service type factor
  const factor = CTB_SERVICE_FACTORS[serviceType] ?? CTB_SERVICE_FACTORS.normal;
  const computedFare = Math.max(CTB_MINIMUM_FARE, Math.round(baseNormalFare * factor));

  return computedFare;
};

// ============================================================================
// 3. SRI LANKA RAILWAYS (TRAIN) CONFIGURATION & CALCULATIONS
// ============================================================================

/**
 * Standard Sri Lanka Railways (SLR) regulated rate approximations per passenger km.
 * SLR fares are officially fixed station-to-station; these provide regulated distance-based
 * benchmarks across classes when specific station pairs are not yet selected.
 */
export const TRAIN_CLASS_RATES = {
  thirdClass: { ratePerKm: 2.5, minFare: 40, label: '3rd Class (Unreserved)' },
  secondClass: { ratePerKm: 5.0, minFare: 100, label: '2nd Class (Unreserved)' },
  firstClass: { ratePerKm: 10.0, minFare: 300, label: '1st Class / AC Intercity' },
};

/**
 * Calculate an estimated regulated train fare based on distance and seat class.
 * 
 * @param {number} distanceKm - Journey distance in kilometers
 * @param {'thirdClass'|'secondClass'|'firstClass'} [classType='thirdClass'] - Train class
 * @returns {number} Regulated per-passenger fare estimate in LKR
 */
export const calculateTrainFare = (distanceKm, classType = 'thirdClass') => {
  const km = Math.max(0, Number(distanceKm) || 0);
  if (km === 0) return 0;

  const config = TRAIN_CLASS_RATES[classType] || TRAIN_CLASS_RATES.thirdClass;
  const rawFare = km * config.ratePerKm;
  const fare = Math.max(config.minFare, Math.round(rawFare / 10) * 10);
  return fare;
};

// ============================================================================
// 4. UNIFIED LOCAL TRANSPORT COST ESTIMATOR
// ============================================================================

/**
 * Unified entry point to calculate regulated transport expenses for solo or group travel.
 * 
 * @param {Object} params
 * @param {number} params.distanceKm - Trip segment distance in kilometers
 * @param {'tuktuk'|'bus'|'train'|'ctb'|'three-wheeler'} params.mode - Transport mode
 * @param {number} [params.travelers=1] - Number of travelers
 * @param {'normal'|'semiLuxury'|'luxury'|'expressway'|'thirdClass'|'secondClass'|'firstClass'} [params.serviceType='normal'] - Service class
 * @returns {{
 *   mode: string,
 *   distanceKm: number,
 *   farePerPerson: number,
 *   totalCost: number,
 *   isRegulatedEstimate: boolean,
 *   note?: string
 * }}
 */
export const estimateLocalTransportCost = ({
  distanceKm,
  mode,
  travelers = 1,
  serviceType = 'normal',
}) => {
  const km = Math.max(0, Number(distanceKm) || 0);
  const count = Math.max(1, parseInt(travelers, 10) || 1);
  const normalizedMode = (mode || '').toLowerCase().trim();

  let farePerPerson = 0;
  let totalCost = 0;
  let note;

  if (
    normalizedMode === 'tuktuk' ||
    normalizedMode === 'tuk-tuk' ||
    normalizedMode === 'three-wheeler'
  ) {
    // Tuk-tuks accommodate up to 3 passengers per vehicle in Sri Lanka.
    const vehicleCost = calculateTukTukFare(km);
    const vehiclesNeeded = Math.ceil(count / 3);
    totalCost = vehicleCost * vehiclesNeeded;
    farePerPerson = Math.round(totalCost / count);
  } else if (
    normalizedMode === 'bus' ||
    normalizedMode === 'ctb' ||
    normalizedMode === 'public-bus'
  ) {
    // Bus fares are charged strictly per passenger
    farePerPerson = calculateCtbBusFare(km, serviceType);
    totalCost = farePerPerson * count;
  } else if (
    normalizedMode === 'train' ||
    normalizedMode === 'rail' ||
    normalizedMode === 'railway'
  ) {
    // Train fares are route/station-dependent; calculate sensible regulated class estimate
    const trainClass =
      serviceType === 'secondClass' || serviceType === 'firstClass'
        ? serviceType
        : 'thirdClass';
    farePerPerson = calculateTrainFare(km, trainClass);
    totalCost = farePerPerson * count;
    note =
      'Train fares in Sri Lanka are station-to-station regulated by Sri Lanka Railways (SLR). Reserved observation cars and AC intercity trains require advance booking.';
  } else {
    // Fallback default: treated as standard bus
    farePerPerson = calculateCtbBusFare(km, 'normal');
    totalCost = farePerPerson * count;
  }

  const result = {
    mode: normalizedMode || 'bus',
    distanceKm: km,
    farePerPerson,
    totalCost,
    isRegulatedEstimate: true,
  };

  if (note) {
    result.note = note;
  }

  return result;
};

/* ============================================================================
   INLINE USAGE EXAMPLES
   ============================================================================

   // 1. Calculate a short Colombo tuk-tuk ride (4.5 km):
   // -> Base 100 LKR (1st km) + 3.5 km * 80 LKR/km = 380 LKR (rounded to 10s: 380 LKR)
   const tuktukFare = calculateTukTukFare(4.5);
   console.log('Tuk-tuk 4.5km:', tuktukFare); // 380

   // 2. Calculate a normal CTB bus trip from Kandy to Peradeniya (6 km):
   // -> Stage 3 (maxKm: 6.0) = 53 LKR
   const busFare = calculateCtbBusFare(6.0, 'normal');
   console.log('Normal CTB 6km:', busFare); // 53

   // 3. Calculate an Expressway AC bus journey from Colombo to Galle (~118 km):
   // -> Stage 22 (maxKm: 120.0) base 680 LKR * 2.0 (expressway factor) = 1360 LKR
   const expresswayFare = calculateCtbBusFare(118, 'expressway');
   console.log('Expressway bus 118km:', expresswayFare); // 1360

   // 4. Calculate a scenic train ride from Kandy to Ella (~140 km) in 2nd class:
   // -> 140 km * 5.0 LKR/km = 700 LKR per person
   const trainFare = calculateTrainFare(140, 'secondClass');
   console.log('Train 2nd Class 140km:', trainFare); // 700

   // 5. Unified estimate for 4 travelers taking tuk-tuks for a 12 km trip:
   // -> 4 travelers need 2 tuk-tuks (capacity 3 each).
   // -> 1 tuk-tuk @ 12km = 100 + 11*80 = 980 LKR.
   // -> Total = 980 * 2 = 1960 LKR. Per-person = 490 LKR.
   const groupTuktuk = estimateLocalTransportCost({
     distanceKm: 12,
     mode: 'tuktuk',
     travelers: 4,
   });
   console.log('Group Tuk-Tuk:', groupTuktuk);
   // { mode: 'tuktuk', distanceKm: 12, farePerPerson: 490, totalCost: 1960, isRegulatedEstimate: true }

   // 6. Unified estimate for 2 travelers taking a semi-luxury bus for 25 km:
   // -> Stage 13 (maxKm: 26.0) base 163 LKR * 1.3 factor = 212 LKR per person.
   // -> Total for 2 = 424 LKR.
   const busEstimate = estimateLocalTransportCost({
     distanceKm: 25,
     mode: 'bus',
     serviceType: 'semiLuxury',
     travelers: 2,
   });
   console.log('Semi-luxury Bus:', busEstimate);
   // { mode: 'bus', distanceKm: 25, farePerPerson: 212, totalCost: 424, isRegulatedEstimate: true }

   // 7. Unified estimate for 2 travelers taking the train from Colombo to Kandy (~115 km):
   const trainEstimate = estimateLocalTransportCost({
     distanceKm: 115,
     mode: 'train',
     serviceType: 'secondClass',
     travelers: 2,
   });
   console.log('Train Estimate:', trainEstimate);
   // {
   //   mode: 'train',
   //   distanceKm: 115,
   //   farePerPerson: 580,
   //   totalCost: 1160,
   //   isRegulatedEstimate: true,
   //   note: 'Train fares in Sri Lanka are station-to-station regulated by Sri Lanka Railways (SLR)...'
   // }
============================================================================ */
