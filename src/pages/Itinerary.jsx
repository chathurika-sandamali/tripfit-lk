import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { formatLKR } from '../data/mockData';
import { usePlan } from '../context/PlanContext';
import kandyImg from '../assets/images/kandy-lake.png';
import ellaImg from '../assets/images/ella-bridge.png';
import galleImg from '../assets/images/galle-coast.png';

const imageMap = {
  'kandy-lake': kandyImg,
  'ella-bridge': ellaImg,
  'galle-coast': galleImg,
};

export default function Itinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTripCalculations, toggleSaveTrip, setActiveTripId } = usePlan();

  const effectiveTripId = tripId || 'kandy-cultural-escape';
  const selectedTrip = getTripCalculations(effectiveTripId);

  useEffect(() => {
    if (selectedTrip?.id) {
      setActiveTripId(selectedTrip.id);
    }
  }, [selectedTrip?.id, setActiveTripId]);

  const {
    id,
    title,
    subtitle,
    durationDays,
    durationNights,
    travelers,
    travelStyle,
    targetBudget,
    estimatedCost,
    initialCost,
    totalSavings,
    hasAppliedSavings,
    status,
    image,
    route,
    breakdown,
    days = [],
    isSaved,
  } = selectedTrip;

  const heroImage = imageMap[image] || kandyImg;

  // Calculate day totals
  const dayTotals = days.map((day) =>
    day.legs.reduce((acc, leg) => acc + (leg.cost || 0), 0)
  );

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      {/* Wizard Progress Header */}
      <section className="w-full bg-surface border-b border-surface-variant/70 py-space-sm sm:py-space-md">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
          <ProgressSteps currentStep={3} tripId={id} />
        </div>
      </section>

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-md sm:py-space-lg w-full flex flex-col gap-space-lg">
        {/* Top Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary hover:text-primary transition-colors font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Recommendations</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/plan/details"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors border border-outline-variant/30 font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Customize Trip Preferences</span>
            </Link>
            <Link
              to={`/trip/${id}/optimize`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>{hasAppliedSavings ? 'Adjust Optimization' : 'Optimize My Budget'}</span>
            </Link>
          </div>
        </div>

        {/* HERO DESTINATION SHOWCASE */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-surface-container-lowest border border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Image Half */}
            <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-full">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt={title}
                src={heroImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-label-sm bg-surface-container-lowest/90 backdrop-blur text-primary shadow-sm font-semibold">
                  <span
                    className="material-symbols-outlined text-[15px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  AI Recommended
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-label-sm shadow-sm font-semibold ${status.statusBadgeClass}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {status.fits ? 'check_circle' : 'warning'}
                  </span>
                  {status.statusText}
                </span>
              </div>
            </div>

            {/* Info / Meta Half */}
            <div className="lg:col-span-5 p-space-md sm:p-space-lg flex flex-col justify-between bg-surface-container-lowest">
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-label-sm font-semibold ${status.statusBadgeClass}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {status.fits ? 'verified' : 'warning'}
                    </span>
                    {status.fits
                      ? hasAppliedSavings
                        ? 'Optimized to Fit Budget'
                        : 'Within Budget Check Passed'
                      : 'Optimization Required'}
                  </span>
                  <span className="text-label-sm font-label-sm text-secondary">
                    Ref: LK-{id.toUpperCase().slice(0, 7)}
                  </span>
                </div>

                <div>
                  <h1 className="font-headline-xl text-headline-xl sm:text-display-lg text-primary tracking-tight font-bold">
                    {title}
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {subtitle}
                  </p>
                </div>

                {/* Param Meta Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      calendar_today
                    </span>
                    {durationDays} Days / {durationNights} Nights
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      group
                    </span>
                    {travelers} Travelers
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      train
                    </span>
                    Scenic Rail &amp; Public Link
                  </div>
                </div>
              </div>

              {/* Action bar inside hero */}
              <div className="pt-space-md mt-space-md border-t border-surface-variant/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaveTrip(id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-label-sm text-label-sm transition-all shadow-sm cursor-pointer ${
                      isSaved
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container hover:bg-surface-variant text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                    <span>{isSaved ? 'Saved to My Trips' : 'Save Trip'}</span>
                  </button>
                  <Link
                    to="/ai-assistant"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-label-sm text-label-sm transition-all font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span>Ask TripFit LK AI</span>
                  </Link>
                </div>

                <div className="text-right">
                  <span className="text-label-sm font-label-sm text-on-surface-variant block">
                    Estimated Total
                  </span>
                  <span
                    className={`font-headline-sm text-headline-sm font-bold ${
                      status.fits ? 'text-primary' : 'text-amber-800'
                    }`}
                  >
                    {formatLKR(estimatedCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OVER-BUDGET ALERT BANNER (if over budget) */}
        {!status.fits && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <span className="material-symbols-outlined text-amber-800 text-[24px]">
                warning
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg font-bold text-amber-900">
                  This trip is {formatLKR(status.difference)} over your {formatLKR(targetBudget)} spending limit
                </h3>
                <p className="font-body-sm text-body-sm text-amber-800">
                  Use TripFit LK's budget optimizer to switch private transfers to scenic rail and homestays.
                </p>
              </div>
            </div>
            <Link
              to={`/trip/${id}/optimize`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-label-md text-label-md font-semibold transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Optimize My Budget</span>
            </Link>
          </div>
        )}

        {/* OPTIMIZED SUCCESS BANNER (if savings were applied) */}
        {hasAppliedSavings && status.fits && (
          <div className="p-4 rounded-xl bg-primary-fixed/40 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">
                check_circle
              </span>
              <div>
                <h3 className="font-label-lg text-label-lg font-bold text-primary">
                  Trip Optimized: Saved {formatLKR(totalSavings)}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Adjusted transport and accommodation options bring this trip safely within your {formatLKR(targetBudget)} budget with a {formatLKR(status.difference)} buffer remaining.
                </p>
              </div>
            </div>
            <Link
              to={`/trip/${id}/optimize`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-sm text-label-sm font-semibold transition-all shadow-xs shrink-0 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Modify Choices</span>
            </Link>
          </div>
        )}

        {/* SECTION TITLE & CONSTRAINTS SUMMARY */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs pb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Your AI-Planned Itinerary
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              A personalized multi-modal plan built around your {formatLKR(targetBudget)} target budget.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-secondary font-label-sm text-label-sm">
              Transit Ground Truth: Sri Lanka Railways &amp; Local Homestays
            </span>
          </div>
        </div>

        {/* MAIN TWO-COLUMN BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: DAY-BY-DAY TIMELINE */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            {days.map((dayPlan, index) => {
              const dayCost = dayTotals[index] || 0;

              return (
                <div
                  key={dayPlan.day}
                  className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30"
                >
                  {/* Day Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-sm border-b border-surface-variant/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                        0{dayPlan.day}
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                          {dayPlan.title}
                        </h3>
                        <span className="font-label-sm text-label-sm text-secondary">
                          {dayPlan.dateLabel}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-label-sm font-label-sm text-secondary block">
                        Estimated Day Spend
                      </span>
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {formatLKR(dayCost)}
                      </span>
                    </div>
                  </div>

                  {/* Timeline Legs */}
                  <div className="flex flex-col gap-space-md pt-space-xs">
                    {dayPlan.legs.map((leg, legIndex) => (
                      <div
                        key={legIndex}
                        className="flex gap-space-md p-space-sm sm:p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/10"
                      >
                        {/* Time & Type icon */}
                        <div className="flex flex-col items-center gap-1.5 shrink-0 w-12 text-center">
                          <div className="w-9 h-9 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs">
                            <span className="material-symbols-outlined text-[20px]">
                              {leg.icon || 'schedule'}
                            </span>
                          </div>
                          <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase">
                            {leg.category}
                          </span>
                        </div>

                        {/* Leg Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4 className="font-label-lg text-label-lg text-on-surface font-bold">
                              {leg.title}
                            </h4>
                            <span className="font-label-md text-label-md font-bold text-primary font-mono shrink-0">
                              {leg.cost === 0 ? 'Free / Public' : formatLKR(leg.cost)}
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                            {leg.desc}
                          </p>
                          <div className="flex items-center gap-2 mt-2 font-label-sm text-label-sm text-secondary">
                            <span className="material-symbols-outlined text-[15px]">
                              schedule
                            </span>
                            <span>{leg.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: BUDGET RECAP & BREAKDOWN */}
          <aside className="lg:col-span-4 flex flex-col gap-space-md sticky top-24">
            {/* 1. FINANCIAL HEALTH CARD */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
                  Budget Health Check
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-semibold ${status.statusBadgeClass}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {status.fits ? 'check_circle' : 'warning'}
                  </span>
                  {status.statusText}
                </span>
              </div>

              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex justify-between items-baseline">
                  <span className="text-body-sm text-on-surface-variant">Your Spending Limit</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {formatLKR(targetBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-body-sm text-on-surface-variant">Estimated Itinerary Total</span>
                  <span
                    className={`font-headline-sm text-headline-sm font-bold ${
                      status.fits ? 'text-primary' : 'text-amber-800'
                    }`}
                  >
                    {formatLKR(estimatedCost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-outline-variant/20 flex justify-between items-baseline">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {status.fits ? 'Remaining Buffer' : 'Over Spending Limit'}
                  </span>
                  <span
                    className={`font-headline-sm text-headline-sm font-bold ${
                      status.fits ? 'text-primary' : 'text-amber-800'
                    }`}
                  >
                    {status.fits ? `+${formatLKR(status.difference)}` : `-${formatLKR(status.difference)}`}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-on-surface font-medium">Budget Efficiency</span>
                  <span className="text-secondary font-mono text-[11px]">
                    {Math.round((estimatedCost / targetBudget) * 100)}% of Limit
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
                  <div
                    className={`h-full ${status.fits ? 'bg-primary' : 'bg-amber-700'}`}
                    style={{ width: `${Math.min(100, (estimatedCost / targetBudget) * 100)}%` }}
                  />
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-secondary italic">
                Prices are prototype estimates based on Sri Lanka Railways and verified local homestay averages.
              </p>

              <Link
                to={`/trip/${id}/optimize`}
                className={`w-full py-2.5 px-4 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 text-center transition-all shadow-sm ${
                  !status.fits
                    ? 'bg-amber-800 hover:bg-amber-900 text-white'
                    : 'bg-primary-container hover:bg-primary text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>{status.fits ? 'Customize Budget Levers' : 'Optimize Budget Now'}</span>
              </Link>
            </div>

            {/* 2. "WHERE YOUR BUDGET GOES" CARD */}
            {breakdown && (
              <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Where your budget goes
                  </h3>
                  <span className="text-label-sm font-label-sm text-secondary">
                    4 Categories
                  </span>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        train
                      </span>
                      Transport
                    </span>
                    <span className="font-semibold text-on-surface">
                      {formatLKR(breakdown.transport)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        hotel
                      </span>
                      Accommodation
                    </span>
                    <span className="font-semibold text-on-surface">
                      {formatLKR(breakdown.accommodation)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">
                        restaurant
                      </span>
                      Food &amp; Dining
                    </span>
                    <span className="font-semibold text-on-surface">
                      {formatLKR(breakdown.food)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        hiking
                      </span>
                      Activities &amp; Entry
                    </span>
                    <span className="font-semibold text-on-surface">
                      {formatLKR(breakdown.activities)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Link
                to="/recommendations"
                className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md text-center border border-outline-variant/30 font-medium"
              >
                All Recommendations
              </Link>
              <Link
                to="/my-trips"
                className="flex-1 py-2.5 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md text-center hover:bg-primary font-semibold"
              >
                My Saved Trips
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
