import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { formatLKR } from '../data/mockData';
import { usePlan } from '../context/PlanContext';
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
    interests,
    travelStyle,
    getTripCalculations,
    setActiveTripId,
    aiCustomTrip,
    isGeminiConfigured,
  } = usePlan();

  const [showCriteria, setShowCriteria] = useState(false);

  // Map destination keyword to default matched trip
  const destLower = (destination || '').toLowerCase();
  let defaultTripId = 'kandy-cultural-escape';
  if (
    destLower.includes('galle') ||
    destLower.includes('mirissa') ||
    destLower.includes('south') ||
    destLower.includes('beach') ||
    destLower.includes('unawatuna') ||
    destLower.includes('coast')
  ) {
    defaultTripId = 'galle-coast';
  } else if (
    destLower.includes('ella') ||
    destLower.includes('nuwara') ||
    destLower.includes('mountain') ||
    destLower.includes('peak') ||
    destLower.includes('hill')
  ) {
    defaultTripId = 'ella-adventure';
  } else if (
    destLower.includes('kandy') ||
    destLower.includes('cultural') ||
    destLower.includes('temple')
  ) {
    defaultTripId = 'kandy-cultural-escape';
  }

  const customAiTrip = aiCustomTrip ? getTripCalculations('ai-generated-custom-trip') : null;
  const featuredTrip = customAiTrip || getTripCalculations(defaultTripId);

  // Remaining alternative destinations
  const standardTripIds = ['kandy-cultural-escape', 'ella-adventure', 'galle-coast'];
  const otherTripIds = standardTripIds.filter((id) => id !== featuredTrip.id);
  const otherTrips = otherTripIds.map((id) => getTripCalculations(id));

  const tripImageMap = {
    'kandy-cultural-escape': kandyImg,
    'kandy-lake': kandyImg,
    'ella-adventure': ellaImg,
    'ella-bridge': ellaImg,
    'galle-coast': galleImg,
  };

  const featuredImg = tripImageMap[featuredTrip.id] || tripImageMap[featuredTrip.image] || kandyImg;

  const getDestinationBeautyTag = (trip) => {
    const dest = (trip.destination || trip.id || '').toLowerCase();
    if (dest.includes('galle') || dest.includes('south') || dest.includes('beach') || dest.includes('coast')) {
      return 'Beauty of Galle • Historic Fort & Coast';
    }
    if (dest.includes('ella') || dest.includes('mountain') || dest.includes('hill')) {
      return 'Beauty of Ella • Nine Arch & Peaks';
    }
    return 'Beauty of Kandy • Sacred Lake & Temple';
  };

  const handleSelectTrip = (tripId) => {
    setActiveTripId(tripId);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-md md:py-space-lg space-y-space-lg">
        {/* Top Wizard Progress Indicator */}
        <ProgressSteps currentStep={3} tripId={featuredTrip.id} />

        {/* Page Header & Filter Badges */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-space-sm pt-space-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm tracking-wide font-semibold">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            Curated for Your Budget
          </div>
          <h1 className="text-3xl md:text-4xl text-primary tracking-tight font-bold">
            Recommended Trips
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Based on your budget, party size, and preferences, here are hand-picked Sri Lankan itineraries that maximize value.
          </p>

          {/* Active Criteria Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-space-xs pt-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md border border-outline-variant/30 font-bold">
              <span className="material-symbols-outlined text-primary text-[16px]">payments</span>
              Budget: {formatLKR(budget)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-secondary">group</span>
              {duration} • {travelers} Travelers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-secondary">interests</span>
              {Array.isArray(interests) ? interests.join(' • ') : interests}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-on-surface-variant font-label-md text-label-md border border-outline-variant/30 capitalize">
              <span className="material-symbols-outlined text-[16px] text-secondary">balance</span>
              {travelStyle} Style
            </span>
          </div>
        </div>

        {/* Main Featured Recommendation Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            {/* Left Visual Side */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${featuredImg})` }}
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
                    {customAiTrip ? 'Gemini AI Generated' : 'AI Recommended'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-primary font-label-md text-label-md shadow-md font-bold">
                    {customAiTrip ? '96% Fit' : '88% Match'}
                  </span>
                </div>
                <div className="pointer-events-auto flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-label-sm text-label-sm border border-white/10">
                    <span className="material-symbols-outlined text-[14px] text-primary-fixed">location_on</span>
                    {featuredTrip.destination || 'Sri Lanka'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 font-label-sm text-label-sm border border-white/10 text-xs">
                    {getDestinationBeautyTag(featuredTrip)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content & Metrics Side */}
            <div className="lg:col-span-7 p-space-md md:p-space-lg flex flex-col justify-between gap-space-md">
              <div className="space-y-space-sm">
                <div className="flex flex-wrap items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
                    <span className="font-semibold text-primary">{featuredTrip.durationDays || duration} Days • {travelers} Travelers</span>
                    <span>•</span>
                    <span>{featuredTrip.subtitle || 'Scenic Train & Cultural Hub'}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${featuredTrip.status.statusBadgeClass}`}
                  >
                    <span className="material-symbols-outlined text-[13px] font-bold">
                      {featuredTrip.status.fits ? 'check_circle' : 'warning'}
                    </span>
                    {featuredTrip.status.statusText}
                  </span>
                </div>

                <div>
                  <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                    {featuredTrip.title}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {featuredTrip.whyRecommended || "Explore Kandy's culture, nature, local food, and nearby experiences while keeping your trip safely aligned with your budget."}
                  </p>
                </div>

                {/* Route Stop Highlights Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">train</span>
                    Scenic Main Line Train
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">temple_buddhist</span>
                    Temple of the Tooth
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">yard</span>
                    Royal Botanic Gardens
                  </span>
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
                          featuredTrip.status.fits ? 'text-primary' : 'text-amber-800'
                        }`}
                      >
                        {formatLKR(featuredTrip.estimatedCost)}
                      </span>
                    </div>
                    <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm border border-outline-variant/10">
                      <span className="block font-label-sm text-label-sm text-on-surface-variant">
                        {featuredTrip.status.fits ? 'Buffer Reserve' : 'Over Budget'}
                      </span>
                      <span
                        className={`block font-headline-sm text-headline-sm font-bold mt-0.5 ${
                          featuredTrip.status.fits ? 'text-primary' : 'text-amber-800'
                        }`}
                      >
                        {featuredTrip.status.fits
                          ? `+${formatLKR(featuredTrip.status.difference)}`
                          : `-${formatLKR(featuredTrip.status.difference)}`}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Segment Budget Progress Bar */}
                  {(() => {
                    const totalEst = featuredTrip.estimatedCost || 1;
                    const stayAmt = featuredTrip.breakdown?.accommodation || 0;
                    const transitAmt = featuredTrip.breakdown?.transport || 0;
                    const foodAmt = featuredTrip.breakdown?.food || 0;
                    const allocatedPct = featuredTrip.status.fits ? 94 : 100;
                    const stayPct = Math.max(5, Math.round((stayAmt / totalEst) * allocatedPct));
                    const transitPct = Math.max(5, Math.round((transitAmt / totalEst) * allocatedPct));
                    const foodPct = Math.max(5, Math.round((foodAmt / totalEst) * allocatedPct));
                    const actPct = Math.max(5, allocatedPct - stayPct - transitPct - foodPct);
                    const bufferPct = featuredTrip.status.fits ? Math.max(0, 100 - (stayPct + transitPct + foodPct + actPct)) : 0;
                    const efficiencyRatio = Math.round((featuredTrip.estimatedCost / budget) * 100);

                    return (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between font-label-sm text-label-sm">
                          <span className="text-on-surface font-medium">Budget Efficiency</span>
                          <span
                            className={`font-semibold ${
                              featuredTrip.status.fits ? 'text-primary' : 'text-amber-800'
                            }`}
                          >
                            {efficiencyRatio}% of Target Budget
                          </span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden flex p-0.5 gap-0.5">
                          <div className="h-full bg-primary rounded-l-full" style={{ width: `${stayPct}%` }} title={`Accommodation: ${stayPct}%`} />
                          <div className="h-full bg-primary-container" style={{ width: `${transitPct}%` }} title={`Transport & Rail: ${transitPct}%`} />
                          <div className="h-full bg-tertiary-container" style={{ width: `${foodPct}%` }} title={`Food & Dining: ${foodPct}%`} />
                          <div className="h-full bg-surface-tint" style={{ width: `${actPct}%` }} title={`Activities & Tickets: ${actPct}%`} />
                          {featuredTrip.status.fits && bufferPct > 0 && (
                            <div className="h-full bg-primary-fixed rounded-r-full" style={{ width: `${bufferPct}%` }} title={`Emergency Buffer: ${bufferPct}%`} />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-secondary font-label-sm">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-primary" />
                              Stay
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-primary-container" />
                              Transit
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-tertiary-container" />
                              Food
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-surface-tint" />
                              Activities
                            </span>
                          </div>
                          <span className="text-primary font-medium">
                            {featuredTrip.status.fits
                              ? `${formatLKR(featuredTrip.status.difference)} buffer reserved for extras`
                              : `${formatLKR(featuredTrip.status.difference)} over spending limit`}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
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

                {!featuredTrip.status.fits && (
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

        {/* Collapsible "Why this recommendation?" Section */}
        {showCriteria && (
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm space-y-space-md transition-all duration-300 border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Why TripFit LK recommended {featuredTrip.destination || featuredTrip.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Matched against your preferences and {formatLKR(budget)} budget
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
                    {featuredTrip.status.fits
                      ? `Fits your ${formatLKR(budget)} budget`
                      : `Can be optimized to fit ${formatLKR(budget)}`}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {featuredTrip.status.fits
                      ? `LKR ${featuredTrip.estimatedCost.toLocaleString()} estimate leaves a safe cushion of ${formatLKR(featuredTrip.status.difference)} for incidental expenses.`
                      : `Current cost of LKR ${featuredTrip.estimatedCost.toLocaleString()} can be brought under budget by switching to local homestays or standard rail.`}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    Matches your selected interests
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {featuredTrip.highlights && featuredTrip.highlights.length > 0
                      ? `Prioritizes ${featuredTrip.highlights.slice(0, 3).join(', ')}.`
                      : featuredTrip.whyRecommended}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    Suitable for a {featuredTrip.durationDays || duration} trip duration
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Optimal transit route ({featuredTrip.route || 'scenic rail and highway express'}) designed to maximize sightseeing time.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-low/60">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                  check_circle
                </span>
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                    {featuredTrip.travelStyle || travelStyle} travel style alignment
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Combines comfortable verified guesthouse stays with authentic local Sri Lankan transport.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Recommendations Section */}
        <div className="space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                Other destinations you may like
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Alternative Sri Lankan routes matching your travel preferences.
              </p>
            </div>
            <span className="font-label-md text-label-md text-secondary">
              {otherTrips.length} Alternative Options Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {otherTrips.map((trip) => {
              const cardImg = tripImageMap[trip.id] || tripImageMap[trip.image] || kandyImg;
              const regionBadge = trip.destination?.includes('Galle')
                ? 'South Coast'
                : trip.destination?.includes('Ella')
                ? 'High Country'
                : 'Central Highlands';

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
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold shadow ${trip.status.statusBadgeClass}`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {trip.status.fits ? 'check_circle' : 'warning'}
                          </span>
                          {trip.status.statusText}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                        <span className="font-label-md text-label-md text-surface-container-lowest font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {trip.durationDays} Days • {travelers} Travelers
                        </span>
                        <span className="font-label-sm text-label-sm bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                          {regionBadge}
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
                                trip.status.fits ? 'text-primary' : 'text-amber-800'
                              }`}
                            >
                              {formatLKR(trip.estimatedCost)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-label-sm text-label-sm text-secondary block">
                              {trip.status.fits ? 'Buffer' : 'Over Budget'}
                            </span>
                            <span
                              className={`font-label-lg text-label-lg font-bold ${
                                trip.status.fits ? 'text-primary' : 'text-amber-800'
                              }`}
                            >
                              {trip.status.fits
                                ? `+${formatLKR(trip.status.difference)}`
                                : `-${formatLKR(trip.status.difference)}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-[11px] text-secondary font-label-sm">
                          <span>Target: {formatLKR(budget)}</span>
                          <span className={trip.status.fits ? 'text-primary font-semibold' : 'text-amber-800 font-semibold'}>
                            {trip.status.fits ? 'Budget check passed' : '1-click optimization available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-space-md pt-0 flex gap-2">
                    <Link
                      to={`/trip/${trip.id}`}
                      onClick={() => handleSelectTrip(trip.id)}
                      className="flex-1 py-2.5 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <span>View Trip Itinerary</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                    {!trip.status.fits && (
                      <Link
                        to={`/trip/${trip.id}/optimize`}
                        onClick={() => handleSelectTrip(trip.id)}
                        className="py-2.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-label-sm text-label-sm font-semibold flex items-center gap-1"
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
