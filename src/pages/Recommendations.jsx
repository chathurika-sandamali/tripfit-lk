import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { formatLKR } from '../data/mockData';
import { usePlan } from '../context/PlanContext';
import {
  buildTripForDestination,
  recommendDestinations,
} from '../services/tripBuilder.js';
import kandyImg from '../assets/images/kandy-lake.png';
import ellaImg from '../assets/images/ella-bridge.png';
import galleImg from '../assets/images/galle-coast.png';

export default function Recommendations() {
  const navigate = useNavigate();
  const {
    budget,
    destination,
    travelers,
    duration,
    durationDays,
    interests,
    travelStyle,
    setActiveTripId,
    setTripDetails,
    registerBuiltTrip,
    aiCustomTrip,
  } = usePlan();

  const [showCriteria, setShowCriteria] = useState(false);

  // Check if user has no destination preference ("no-idea mode")
  const cleanDest = (destination || '').trim();
  const isNoIdeaMode =
    !cleanDest ||
    cleanDest.toLowerCase() === 'anywhere in sri lanka' ||
    cleanDest.toLowerCase() === 'anywhere' ||
    cleanDest.toLowerCase() === 'sri lanka';

  let featuredTrip = null;
  let otherTrips = [];
  let notFoundResult = null;

  if (isNoIdeaMode) {
    // Recommend top 3 destinations fitting the budget
    const topRecs = recommendDestinations({
      budget,
      travelers,
      durationDays: durationDays || 3,
      interests,
    });
    featuredTrip = topRecs[0] || null;
    otherTrips = topRecs.slice(1, 3);
  } else {
    // Build itinerary for the user-typed destination
    const built = buildTripForDestination({
      destination: cleanDest,
      budget,
      travelers,
      durationDays: durationDays || 3,
      interests,
      travelStyle,
    });

    if (built.notFound) {
      notFoundResult = built;
      // Provide top suggestions in secondary recommendations
      otherTrips = recommendDestinations({
        budget,
        travelers,
        durationDays: durationDays || 3,
        interests,
      }).slice(0, 2);
    } else {
      featuredTrip = built;
      otherTrips = recommendDestinations({
        budget,
        travelers,
        durationDays: durationDays || 3,
        interests,
      })
        .filter(
          (t) =>
            t.destinationId !== featuredTrip.destinationId &&
            t.destination !== featuredTrip.destination
        )
        .slice(0, 2);
    }
  }

  // If Gemini AI custom trip was generated, it can override featured
  if (aiCustomTrip) {
    featuredTrip = aiCustomTrip;
  }

  // Register built trips in context so itinerary route can access them
  useEffect(() => {
    if (featuredTrip && registerBuiltTrip) {
      registerBuiltTrip(featuredTrip);
    }
    if (otherTrips && registerBuiltTrip) {
      otherTrips.forEach((t) => registerBuiltTrip(t));
    }
  }, [featuredTrip?.id]);

  const tripImageMap = {
    'kandy-lake': kandyImg,
    'kandy-cultural-escape': kandyImg,
    'ella-bridge': ellaImg,
    'ella-adventure': ellaImg,
    'galle-coast': galleImg,
  };

  const getTripImage = (trip) => {
    if (!trip) return kandyImg;
    if (tripImageMap[trip.image]) return tripImageMap[trip.image];
    if (tripImageMap[trip.imageTag]) return tripImageMap[trip.imageTag];

    const reg = (trip.region || '').toLowerCase();
    const dest = (trip.destination || '').toLowerCase();
    if (
      reg.includes('coast') ||
      reg.includes('beach') ||
      dest.includes('galle') ||
      dest.includes('mirissa') ||
      dest.includes('jaffna') ||
      dest.includes('trinco') ||
      dest.includes('colombo')
    ) {
      return galleImg;
    }
    if (
      dest.includes('ella') ||
      dest.includes('haputale') ||
      dest.includes('nuwara') ||
      reg.includes('mountain')
    ) {
      return ellaImg;
    }
    return kandyImg;
  };

  const handleSelectTrip = (tripId) => {
    setActiveTripId(tripId);
  };

  const handleChooseSuggestion = (suggestionName) => {
    setTripDetails({ destination: suggestionName });
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-md md:py-space-lg space-y-space-lg">
        {/* Top Wizard Progress Indicator */}
        <ProgressSteps currentStep={3} tripId={featuredTrip?.id || 'recommendations'} />

        {/* Page Header & Filter Badges */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-sm pt-space-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm tracking-wide font-semibold">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            {isNoIdeaMode ? 'Top Destination Picks' : 'Curated for Your Destination'}
          </div>
          <h1 className="text-3xl md:text-4xl text-primary tracking-tight font-bold">
            {isNoIdeaMode
              ? 'Best Sri Lanka Trips for Your Budget'
              : `Your ${cleanDest} Itinerary`}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {isNoIdeaMode
              ? `Calculated from verified local transport tariffs, accommodation, and activities fitting your ${formatLKR(budget)} budget.`
              : `A personalized itinerary dynamically engineered for ${cleanDest} based on real local transport, lodging, and activity costs.`}
          </p>

          {/* Active Criteria Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-space-xs pt-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md border border-outline-variant/30 font-bold">
              <span className="material-symbols-outlined text-primary text-[16px]">payments</span>
              Budget: {formatLKR(budget)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
              {durationDays || 3} Days • {travelers} Travelers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-secondary">interests</span>
              {Array.isArray(interests) && interests.length > 0 ? interests.join(' • ') : 'All Highlights'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 capitalize">
              <span className="material-symbols-outlined text-[16px] text-secondary">balance</span>
              {travelStyle || 'Balanced'} Style
            </span>
          </div>
        </div>

        {/* NOT FOUND FRIENDLY BANNER (if user typed unknown destination) */}
        {notFoundResult && (
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 text-center max-w-3xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[32px]">travel_explore</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              Destination Not Found: &ldquo;{notFoundResult.query}&rdquo;
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
              We couldn&apos;t find a direct match in our 22 verified Sri Lankan travel catalogs.
              Did you mean one of these popular destinations?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {notFoundResult.suggestions.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => handleChooseSuggestion(sug.name)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-semibold text-sm transition-all shadow-xs cursor-pointer border border-primary/20 hover:scale-102"
                >
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>Plan for {sug.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FEATURED RECOMMENDATION CARD (When a destination is found) */}
        {featuredTrip && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-outline-variant/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
              {/* Left Visual Side */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getTripImage(featuredTrip)})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

                {/* Badges Overlay */}
                <div className="absolute inset-0 p-space-md flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center justify-between gap-space-xs pointer-events-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md backdrop-blur-sm font-semibold">
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_awesome
                      </span>
                      {aiCustomTrip ? 'Gemini AI Generated' : `${featuredTrip.travelStyle} Tier Pick`}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-primary font-label-md text-label-md shadow-md font-bold">
                      {featuredTrip.status?.fits ? '100% Fits Budget' : 'Optimizable'}
                    </span>
                  </div>
                  <div className="pointer-events-auto flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-label-sm text-label-sm border border-white/10">
                      <span className="material-symbols-outlined text-[14px] text-primary-fixed">location_on</span>
                      {featuredTrip.destination || 'Sri Lanka'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 font-label-sm text-label-sm border border-white/10 text-xs">
                      Beauty of {featuredTrip.destination}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content & Metrics Side */}
              <div className="lg:col-span-7 p-space-md md:p-space-lg flex flex-col justify-between gap-space-md">
                <div className="space-y-space-sm">
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
                      <span className="font-semibold text-primary">{featuredTrip.durationDays} Days • {travelers} Travelers</span>
                      <span>•</span>
                      <span className="capitalize">{featuredTrip.travelStyle} Style</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${featuredTrip.status?.statusBadgeClass || 'bg-primary/10 text-primary'}`}
                    >
                      <span className="material-symbols-outlined text-[13px] font-bold">
                        {featuredTrip.status?.fits ? 'check_circle' : 'warning'}
                      </span>
                      {featuredTrip.status?.statusText || 'Calculated'}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                      {featuredTrip.title}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      {featuredTrip.whyRecommended || featuredTrip.subtitle}
                    </p>
                  </div>

                  {/* Route & Landmark Highlights Strip */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        {featuredTrip.route?.includes('Rail') || featuredTrip.route?.includes('Train') ? 'train' : 'directions_bus'}
                      </span>
                      {featuredTrip.route || 'Colombo Transit Link'}
                    </span>
                    {(featuredTrip.highlights || []).slice(0, 2).map((hl, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                        {hl}
                      </span>
                    ))}
                  </div>

                  {/* Budget Breakdown Comparison Module */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm border border-outline-variant/20">
                    <div className="grid grid-cols-3 gap-space-xs text-left">
                      <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm border border-outline-variant/10">
                        <span className="block font-label-sm text-label-sm text-secondary">Target Budget</span>
                        <span className="block font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">
                          {formatLKR(budget)}
                        </span>
                      </div>
                      <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm border border-outline-variant/10">
                        <span className="block font-label-sm text-label-sm text-primary font-medium">Estimated Cost</span>
                        <span
                          className={`block font-headline-sm text-headline-sm font-bold mt-0.5 ${
                            featuredTrip.status?.fits ? 'text-primary' : 'text-amber-800'
                          }`}
                        >
                          {formatLKR(featuredTrip.estimatedCost)}
                        </span>
                      </div>
                      <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm border border-outline-variant/10">
                        <span className="block font-label-sm text-label-sm text-on-surface-variant">
                          {featuredTrip.status?.fits ? 'Buffer Reserve' : 'Over Budget'}
                        </span>
                        <span
                          className={`block font-headline-sm text-headline-sm font-bold mt-0.5 ${
                            featuredTrip.status?.fits ? 'text-primary' : 'text-amber-800'
                          }`}
                        >
                          {featuredTrip.status?.fits
                            ? `+${formatLKR(featuredTrip.status?.difference || 0)}`
                            : `-${formatLKR(featuredTrip.status?.difference || 0)}`}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Cost Categories */}
                    {featuredTrip.breakdown && (
                      <div className="pt-2 border-t border-outline-variant/15 flex flex-wrap items-center justify-between text-[12px] text-on-surface-variant font-mono">
                        <span>Stay: {formatLKR(featuredTrip.breakdown.accommodation)}</span>
                        <span>Transit: {formatLKR(featuredTrip.breakdown.transport)}</span>
                        <span>Food: {formatLKR(featuredTrip.breakdown.food)}</span>
                        <span>Activities: {formatLKR(featuredTrip.breakdown.activities)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTAs */}
                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                  <Link
                    to={`/trip/${featuredTrip.id}`}
                    onClick={() => handleSelectTrip(featuredTrip.id)}
                    className="px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-sm hover:shadow flex items-center gap-2 group font-semibold cursor-pointer"
                  >
                    <span>View Trip Details</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </Link>

                  {!featuredTrip.status?.fits && (
                    <Link
                      to={`/trip/${featuredTrip.id}/optimize`}
                      onClick={() => handleSelectTrip(featuredTrip.id)}
                      className="px-space-md py-2.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-label-lg text-label-lg transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                      <span>Optimize Budget</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowCriteria(!showCriteria)}
                    className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg transition-colors flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span>Why this recommendation?</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible "Why this recommendation?" Section */}
        {showCriteria && featuredTrip && (
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm space-y-space-md transition-all duration-300 border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Why TripFit LK recommended {featuredTrip.destination}
                  </h3>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Fitted to your preferences and {formatLKR(budget)} spending limit
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                High Confidence Match
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    {featuredTrip.status?.fits
                      ? `Fits your ${formatLKR(budget)} budget`
                      : `Can be optimized to fit ${formatLKR(budget)}`}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {featuredTrip.status?.fits
                      ? `Estimated cost of ${formatLKR(featuredTrip.estimatedCost)} leaves a safe cushion of ${formatLKR(featuredTrip.status?.difference || 0)} for incidental extras.`
                      : `Current cost of ${formatLKR(featuredTrip.estimatedCost)} can be brought under budget by switching to verified local homestays or standard rail.`}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    Selected Tier: {featuredTrip.travelStyle}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {featuredTrip.tier === 'comfort'
                      ? 'Comfort-grade accommodation and priority first-class scenic transfers within budget.'
                      : featuredTrip.tier === 'mid'
                      ? 'Balanced boutique homestays and 2nd class reserved train seating.'
                      : 'High-value backpacker guesthouses and scenic 3rd class rail.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    Signature Experiences in {featuredTrip.destination}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {(featuredTrip.highlights || []).slice(0, 3).join(', ')}.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    Regulated Transit Route
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {featuredTrip.route} calculated via official Sri Lanka tariff benchmarks.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Recommendations Section */}
        {otherTrips.length > 0 && (
          <div className="space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                  {notFoundResult ? 'Recommended Destinations for You' : 'Other destinations you may like'}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Alternative Sri Lankan routes dynamically fitted to your {formatLKR(budget)} budget.
                </p>
              </div>
              <span className="font-label-md text-label-md text-secondary">
                {otherTrips.length} Alternative Options Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {otherTrips.map((trip) => {
                const cardImg = getTripImage(trip);

                return (
                  <div
                    key={trip.id}
                    className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all border border-outline-variant/30"
                  >
                    <div>
                      <div className="relative h-48 w-full overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url(${cardImg})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold shadow ${trip.status?.statusBadgeClass || 'bg-primary/10 text-primary'}`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {trip.status?.fits ? 'check_circle' : 'warning'}
                            </span>
                            {trip.status?.statusText || 'Calculated'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                          <span className="font-label-md text-label-md text-surface-container-lowest font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {trip.durationDays} Days • {travelers} Travelers
                          </span>
                          <span className="font-label-sm text-label-sm bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                            {trip.region || 'Sri Lanka'}
                          </span>
                        </div>
                      </div>

                      <div className="p-space-md space-y-space-sm">
                        <div>
                          <h4 className="font-headline-md text-headline-md text-primary font-bold">
                            {trip.title}
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                            {trip.subtitle}
                          </p>
                        </div>

                        {/* Cost Summary Block */}
                        <div className="bg-surface-container-low p-space-sm rounded-lg space-y-2 border border-outline-variant/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-label-sm text-label-sm text-secondary block">Estimated Cost</span>
                              <span
                                className={`font-headline-sm text-headline-sm font-bold ${
                                  trip.status?.fits ? 'text-primary' : 'text-amber-800'
                                }`}
                              >
                                {formatLKR(trip.estimatedCost)}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-label-sm text-label-sm text-secondary block">
                                {trip.status?.fits ? 'Buffer' : 'Over Budget'}
                              </span>
                              <span
                                className={`font-label-lg text-label-lg font-bold ${
                                  trip.status?.fits ? 'text-primary' : 'text-amber-800'
                                }`}
                              >
                                {trip.status?.fits
                                  ? `+${formatLKR(trip.status?.difference || 0)}`
                                  : `-${formatLKR(trip.status?.difference || 0)}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-[11px] text-secondary font-label-sm">
                            <span>Target: {formatLKR(budget)}</span>
                            <span className={trip.status?.fits ? 'text-primary font-semibold' : 'text-amber-800 font-semibold'}>
                              {trip.status?.fits ? 'Budget check passed' : '1-click optimization available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-space-md pt-0 flex gap-2">
                      <Link
                        to={`/trip/${trip.id}`}
                        onClick={() => handleSelectTrip(trip.id)}
                        className="flex-1 py-2.5 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 font-semibold cursor-pointer"
                      >
                        <span>View Trip Itinerary</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </Link>
                      {!trip.status?.fits && (
                        <Link
                          to={`/trip/${trip.id}/optimize`}
                          onClick={() => handleSelectTrip(trip.id)}
                          className="py-2.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-label-sm text-label-sm font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">tune</span>
                          <span>Optimize</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/30">
          <Link
            to="/plan/details"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant/30 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Edit Trip Details</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span>Ask TripFit LK AI</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
