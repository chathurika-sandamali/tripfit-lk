import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { MOCK_TRIPS, formatLKR, calculateBudgetStatus } from '../data/mockData';
import { usePlan } from '../context/PlanContext';

export default function BudgetOptimization() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const {
    budget: userBudget,
    appliedOptimizations,
    toggleOptimization,
    applyAllOptimizations,
    resetOptimizations,
    setActiveTripId,
    getTripCalculations,
  } = usePlan();

  const effectiveTripId = tripId || 'ella-adventure';
  const calculatedTrip = getTripCalculations(effectiveTripId);
  const baseTrip = calculatedTrip;

  // Ensure active trip is updated
  React.useEffect(() => {
    setActiveTripId(effectiveTripId);
  }, [effectiveTripId, setActiveTripId]);

  const targetBudget = calculatedTrip?.targetBudget || userBudget || 100000;
  const initialCost = calculatedTrip?.initialCost || 100000;

  // Read scaled levers from calculated trip
  const optimizationChoices = calculatedTrip.optimizationOptions && calculatedTrip.optimizationOptions.length > 0
    ? calculatedTrip.optimizationOptions
    : [
        {
          id: 'transport',
          categoryKey: 'transport',
          category: 'Transport Optimization',
          title: 'Switch Transport',
          description: 'Use scenic train travel and local transport for selected parts of the journey.',
          current: 'Private AC vehicle',
          alternative: 'Train + local transport',
          savings: 5000,
          icon: 'train',
        },
        {
          id: 'accommodation',
          categoryKey: 'accommodation',
          category: 'Accommodation Optimization',
          title: 'Change Accommodation',
          description: 'Choose a verified hillside homestay while keeping the same destination and mountain view.',
          current: 'Resort accommodation',
          alternative: 'Scenic budget guesthouse',
          savings: 7000,
          icon: 'hotel',
        },
        {
          id: 'activities',
          categoryKey: 'activities',
          category: 'Activities & Sightseeing',
          title: 'Choose Lower-Cost Experiences',
          description: 'Replace selected paid commercial tours with authentic free & low-cost viewpoints.',
          current: 'Private guided agency',
          alternative: 'Local trail passes & public viewpoints',
          savings: 3000,
          icon: 'hiking',
        },
      ];

  // Local state for interactive levers, synced with context on commit
  const initialTripOpts = appliedOptimizations?.[effectiveTripId] || {
    transport: false,
    accommodation: false,
    activities: false,
  };

  const [applied, setApplied] = useState({
    transport: !!initialTripOpts.transport,
    accommodation: !!initialTripOpts.accommodation,
    activities: !!initialTripOpts.activities,
  });

  const toggleOption = (id) => {
    setApplied((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApplyAll = () => {
    setApplied({
      transport: true,
      accommodation: true,
      activities: true,
    });
  };

  const handleResetAll = () => {
    setApplied({
      transport: false,
      accommodation: false,
      activities: false,
    });
  };

  // Calculate savings dynamically from actual selected choices without double-counting
  const totalSavings = optimizationChoices.reduce((acc, opt) => {
    return acc + (applied[opt.id] ? opt.savings : 0);
  }, 0);

  const currentEstimated = Math.max(0, initialCost - totalSavings);
  const diff = targetBudget - currentEstimated;
  const fits = diff >= 0;
  const hasAppliedSavings = totalSavings > 0;

  const status = calculateBudgetStatus(targetBudget, currentEstimated, hasAppliedSavings);

  const handleSaveAndNavigate = () => {
    // Commit applied options to context
    Object.keys(applied).forEach((leverId) => {
      const currentVal = !!appliedOptimizations?.[effectiveTripId]?.[leverId];
      if (currentVal !== applied[leverId]) {
        toggleOptimization(effectiveTripId, leverId);
      }
    });
    navigate(`/trip/${effectiveTripId}`);
  };

  const handleKeepCurrentPlan = () => {
    resetOptimizations(effectiveTripId);
    navigate(`/trip/${effectiveTripId}`);
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      {/* WIZARD STEP HEADER */}
      <section className="w-full bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.03)] border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-md">
          <ProgressSteps currentStep={4} tripId={effectiveTripId} />
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-lg flex flex-col gap-space-lg">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-bold">
              <span className="material-symbols-outlined text-[16px] text-primary">
                account_balance_wallet
              </span>
              Target Budget: {formatLKR(targetBudget)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                map
              </span>
              {baseTrip.title}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                group
              </span>
              {baseTrip.durationDays} Days • {baseTrip.travelers} Travelers
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
            >
              Reset Choices
            </button>
            <button
              type="button"
              onClick={handleApplyAll}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Apply All Recommended</span>
            </button>
          </div>
        </div>

        {/* OVERRUN / STATUS CARD */}
        <section className="w-full rounded-xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md">
            <div className="flex items-start gap-space-sm">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  status.fits
                    ? 'bg-primary-fixed text-primary'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {status.fits ? 'verified' : 'warning_amber'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-space-xs">
                  <span
                    className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${status.statusBadgeClass}`}
                  >
                    {status.statusText}
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  {status.fits
                    ? hasAppliedSavings
                      ? 'Your trip is now optimized to fit your budget!'
                      : 'Your trip already fits comfortably within your budget!'
                    : `Your trip is ${formatLKR(status.difference)} over your target budget`}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {status.fits
                    ? `With selected adjustments, your trip estimated cost is ${formatLKR(
                        currentEstimated
                      )}, leaving a safe cushion of ${formatLKR(status.difference)}.`
                    : 'Select trade-offs below to replace private taxis and upscale lodgings with scenic trains and authentic local guesthouses.'}
                </p>
              </div>
            </div>

            {/* Budget Metrics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-space-sm sm:p-space-md rounded-lg shrink-0 border border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Target Budget
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {formatLKR(targetBudget)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Estimated Cost
                </span>
                <span
                  className={`font-headline-sm text-headline-sm font-bold ${
                    status.fits ? 'text-primary' : 'text-amber-800'
                  }`}
                >
                  {formatLKR(currentEstimated)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {status.fits ? 'Remaining' : 'Over Budget'}
                </span>
                <span
                  className={`font-headline-sm text-headline-sm font-bold ${
                    status.fits ? 'text-primary' : 'text-amber-800'
                  }`}
                >
                  {status.fits
                    ? `+${formatLKR(status.difference)}`
                    : `-${formatLKR(status.difference)}`}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Savings
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {formatLKR(totalSavings)}
                </span>
              </div>
            </div>
          </div>

          {/* Stacked Progress Bar */}
          <div className="pt-space-md flex flex-col gap-2 border-t border-outline-variant/20">
            <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
              <span>Target Limit: {formatLKR(targetBudget)}</span>
              <span
                className={`font-semibold ${
                  status.fits ? 'text-primary' : 'text-amber-800'
                }`}
              >
                {status.fits
                  ? `${status.statusText} (${Math.round((currentEstimated / targetBudget) * 100)}% of limit)`
                  : `Over Budget +${formatLKR(status.difference)}`}
              </span>
            </div>

            <div className="relative w-full h-7 bg-surface-container rounded-lg overflow-hidden flex">
              <div
                className={`h-full flex items-center justify-end px-2 font-label-sm text-label-sm font-semibold transition-all duration-300 ${
                  status.fits
                    ? 'bg-primary text-on-primary'
                    : 'bg-primary-container text-on-primary'
                }`}
                style={{
                  width: `${Math.min(100, (Math.min(currentEstimated, targetBudget) / targetBudget) * 100)}%`,
                }}
              >
                <span>Cost: {formatLKR(currentEstimated)}</span>
              </div>
              {!status.fits && (
                <div
                  className="h-full bg-amber-700 flex items-center justify-center text-white font-label-sm text-label-sm font-semibold transition-all duration-300"
                  style={{
                    width: `${Math.min(30, ((currentEstimated - targetBudget) / targetBudget) * 100)}%`,
                  }}
                >
                  <span>+{formatLKR(status.difference)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1">
              <div className="flex items-center gap-space-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                  Within Budget
                </span>
                {!status.fits && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-700 inline-block" />
                    Over Budget Excess
                  </span>
                )}
              </div>
              <span>Total Selected Savings: {formatLKR(totalSavings)}</span>
            </div>
          </div>
        </section>

        {/* SMART SAVINGS CHOICES */}
        <section className="flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
            <div>
              <h2 className="text-2xl text-on-surface font-bold">
                Smart Savings Options
              </h2>
              <p className="text-sm text-on-surface-variant">
                Toggle individual adjustments below or use the 1-click optimizer to bring your trip under budget.
              </p>
            </div>
            <span className="text-xs text-secondary bg-surface-container px-3 py-1 rounded-full self-start sm:self-auto font-semibold">
              {optimizationChoices.length} Savings Available
            </span>
          </div>

          {/* 3-Column Optimization Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {optimizationChoices.map((opt) => {
              const isApplied = !!applied[opt.id];
              return (
                <div
                  key={opt.id}
                  className={`flex flex-col justify-between bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all duration-200 border ${
                    isApplied
                      ? 'border-primary ring-2 ring-primary/20 bg-primary-fixed/10'
                      : 'border-outline-variant/30 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold bg-primary-fixed/50 px-2 py-0.5 rounded">
                        {opt.category}
                      </span>
                      <span className="material-symbols-outlined text-primary-container text-[20px]">
                        {opt.icon}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                        {opt.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {opt.description}
                      </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-2 font-body-sm text-body-sm border border-outline-variant/20">
                      <div className="flex justify-between items-center text-on-surface-variant">
                        <span>Current:</span>
                        <span className="font-medium text-on-surface line-through">
                          {opt.current}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-on-surface">
                        <span>Alternative:</span>
                        <span className="font-semibold text-primary">
                          {opt.alternative}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                      Save approx. {formatLKR(opt.savings)}
                    </div>
                  </div>

                  <div className="pt-space-md mt-space-sm">
                    <button
                      type="button"
                      onClick={() => toggleOption(opt.id)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-label-lg text-label-lg font-semibold transition-all cursor-pointer ${
                        isApplied
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container text-primary hover:bg-primary-fixed/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isApplied ? 'check_circle' : 'add_circle'}
                      </span>
                      <span>{isApplied ? 'Applied' : 'Apply Change'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 1-CLICK SMART OPTIMIZATION CARD */}
        <section className="w-full rounded-xl bg-gradient-to-r from-primary/10 via-surface-container-lowest to-surface-container-low p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-sm max-w-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">auto_fix_high</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm font-semibold text-primary uppercase tracking-wide bg-primary-fixed px-2.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Instant Budget Balance
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl text-on-surface font-bold">
                  1-Click Smart Optimization
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Automatically apply transit and lodging adjustments to bring your estimated cost within your {formatLKR(targetBudget)} spending limit.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm shrink-0">
              <button
                type="button"
                onClick={handleKeepCurrentPlan}
                className="px-space-md py-2.5 rounded-lg font-label-lg text-label-lg font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                onClick={handleApplyAll}
                className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Optimize Trip</span>
              </button>
            </div>
          </div>
        </section>

        {/* BOTTOM NAV / ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/30">
          <Link
            to={`/trip/${effectiveTripId}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors border border-outline-variant/30 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Trip</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveAndNavigate}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span>View Updated Itinerary</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
