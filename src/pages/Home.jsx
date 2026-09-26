import React from 'react';
import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import { formatLKR } from '../data/mockData';
import teaBg from '../assets/images/tea-country.png';
import hillBg from '../assets/images/hill-country.png';

export default function Home() {
  const { budget: userBudget, getTripCalculations } = usePlan();
  const activeBudget = userBudget && userBudget > 0 ? userBudget : 100000;
  const previewTrip = getTripCalculations('ella-adventure');
  const breakdown = previewTrip.breakdown;
  const totalBreakdown =
    (breakdown.transport + breakdown.accommodation + breakdown.food + breakdown.activities) ||
    previewTrip.estimatedCost ||
    1;
  const transitPct = ((breakdown.transport / totalBreakdown) * 100).toFixed(1);
  const stayPct = ((breakdown.accommodation / totalBreakdown) * 100).toFixed(1);
  const foodPct = ((breakdown.food / totalBreakdown) * 100).toFixed(1);
  const actPct = ((breakdown.activities / totalBreakdown) * 100).toFixed(1);

  const formatK = (amount) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return String(amount);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-primary text-on-primary">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-95"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 77, 46, 0.78), rgba(26, 77, 46, 0.88)), url(${teaBg})`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00210e]/95 via-[#00361a]/90 to-[#1a4d2e]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/25" />

        <div className="relative max-w-[1280px] mx-auto px-margin-mobile md:px-margin py-space-xl lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-space-md">
              {/* Regional Pill Badge */}
              <div className="inline-flex items-center gap-2 px-space-md py-1.5 rounded-full bg-primary-container/80 backdrop-blur-md shadow-sm">
                <span className="text-base leading-none">🇱🇰</span>
                <span className="font-label-md text-label-md text-primary-fixed tracking-wide">
                  Sri Lanka’s First Budget-Centric AI Travel Planner
                </span>
              </div>

              {/* Main Impact Headline */}
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white font-bold tracking-tight max-w-xl">
                What trip can you afford?
              </h1>

              {/* Value Statement */}
              <p className="font-body-lg text-body-lg text-surface-container-high max-w-lg leading-relaxed">
                Plan and optimize your Sri Lankan trip with AI, based on your budget, preferences, and travel needs.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs w-full sm:w-auto">
                <Link
                  to="/plan/budget"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-lg bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-label-lg text-label-lg transition-all shadow-md active:scale-95"
                >
                  <span>Plan My Trip</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white backdrop-blur-sm font-label-lg text-label-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  <span>Explore Sri Lanka</span>
                </a>
              </div>

              {/* Trust Signals */}
              <div className="pt-space-md flex flex-wrap items-center gap-y-2 gap-x-space-md font-label-sm text-label-sm text-surface-container-highest/90">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                    check_circle
                  </span>
                  Estimated transport rates
                </span>
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                    check_circle
                  </span>
                  Local homestays &amp; hotels
                </span>
                <span className="text-white/40">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                    check_circle
                  </span>
                  Ceylon tea &amp; coastal lines
                </span>
              </div>
            </div>

            {/* Right Hero: Floating Realtime Budget Card */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-surface-container-lowest text-on-surface rounded-xl p-space-lg shadow-xl relative transition-all border border-outline-variant/30">
                {/* Top Tagline & Badge */}
                <div className="flex items-center justify-between pb-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      smart_toy
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      TripFit LK
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                    AI Recommended
                  </span>
                </div>

                {/* Route Header */}
                <div className="pt-space-xs pb-space-md">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-2">
                    4-Day Ella Adventure
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      train
                    </span>
                    Scenic Main Line Train • Demodara Loop • Little Adam's Peak
                  </p>
                </div>

                {/* Budget Comparison Summary Pill Block */}
                <div className="p-space-md rounded-lg bg-surface-container-low space-y-space-sm mb-space-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                        Your Spending Limit
                      </span>
                      <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                        {formatLKR(activeBudget)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                        Estimated Total
                      </span>
                      <span className="font-headline-md text-headline-md text-primary-container font-bold">
                        {formatLKR(previewTrip.estimatedCost)}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Segment Cost Allocation Bar */}
                  <div className="space-y-1.5 pt-space-xs">
                    <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${transitPct}%` }}
                        title={`Transit: ${formatLKR(breakdown.transport)}`}
                      />
                      <div
                        className="bg-primary-container h-full transition-all"
                        style={{ width: `${stayPct}%` }}
                        title={`Stay: ${formatLKR(breakdown.accommodation)}`}
                      />
                      <div
                        className="bg-tertiary-fixed-dim h-full transition-all"
                        style={{ width: `${foodPct}%` }}
                        title={`Food: ${formatLKR(breakdown.food)}`}
                      />
                      <div
                        className="bg-secondary-fixed-dim h-full transition-all"
                        style={{ width: `${actPct}%` }}
                        title={`Activities: ${formatLKR(breakdown.activities)}`}
                      />
                    </div>

                    <div className="flex items-center justify-between font-label-sm text-label-sm pt-0.5">
                      <span className={`inline-flex items-center gap-1 font-semibold ${previewTrip.status.fits ? 'text-primary-container' : 'text-error'}`}>
                        <span className={`w-2 h-2 rounded-full inline-block ${previewTrip.status.fits ? 'bg-primary-container' : 'bg-error'}`} />
                        {previewTrip.status.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                        previewTrip.status.fits
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-error-container text-on-error-container'
                      }`}>
                        {previewTrip.status.fits
                          ? `Surplus: ${formatLKR(previewTrip.status.difference)}`
                          : `Over: +${formatLKR(previewTrip.status.difference)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Granular Breakdown Row Grid */}
                <div className="grid grid-cols-2 gap-2 text-left mb-space-md">
                  <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        directions_bus
                      </span>
                      Transit
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {formatK(breakdown.transport)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        hotel
                      </span>
                      Stay (3N)
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {formatK(breakdown.accommodation)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">
                        restaurant
                      </span>
                      Food
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {formatK(breakdown.food)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        hiking
                      </span>
                      Passes
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {formatK(breakdown.activities)}
                    </span>
                  </div>
                </div>

                {/* Card Interactive Action */}
                <div className="pt-space-xs flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {previewTrip.travelers || 2} Travelers • {previewTrip.duration || 4} Days
                  </span>
                  <Link
                    to="/trip/ella-adventure"
                    className="font-label-lg text-label-lg text-primary-container hover:text-primary inline-flex items-center gap-1 group font-semibold"
                  >
                    <span>Customize This Trip</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-3 text-center border-t border-surface-container pt-2">
                  Plans dynamically adjust options to prevent budget overruns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION SECTION */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-space-xl space-y-space-xs">
            <span className="px-space-md py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider inline-block font-semibold">
              Budget-First Planning
            </span>
            <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
              Plan smarter. Travel better.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Everything you need to craft a realistic Sri Lankan itinerary that fits your spending limit without surprise costs.
            </p>
          </div>

          {/* Three Core Pillars Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">
                    account_balance_wallet
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    Budget-First Planning
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Start with your budget and build a trip around what you can afford.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">
                    psychology
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    AI Recommendations
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Get personalized destinations and trip plans based on your preferences.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">
                    receipt_long
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
                    Transparent Pricing
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    See estimated costs for transport, accommodation, food, and activities before you decide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin">
          <div className="text-center max-w-2xl mx-auto mb-space-xl space-y-space-xs">
            <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
              How TripFit LK Works
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Four structured steps from your target budget to your finalized Sri Lankan route itinerary.
            </p>
          </div>

          {/* 4-Step Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative flex flex-col justify-between border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                    01
                  </span>
                  <span className="material-symbols-outlined text-outline-variant text-[24px]">
                    payments
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
                    Set Your Budget
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Tell us how much you want to spend.
                  </p>
                </div>
              </div>
              <div className="pt-space-md mt-space-sm text-on-surface-variant font-label-sm text-label-sm font-semibold">
                Step 1 of 4
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative flex flex-col justify-between border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                    02
                  </span>
                  <span className="material-symbols-outlined text-outline-variant text-[24px]">
                    checklist
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
                    Select Preferences
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Choose your destination, duration, travelers, and interests.
                  </p>
                </div>
              </div>
              <div className="pt-space-md mt-space-sm text-on-surface-variant font-label-sm text-label-sm font-semibold">
                Step 2 of 4
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative flex flex-col justify-between border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                    03
                  </span>
                  <span className="material-symbols-outlined text-outline-variant text-[24px]">
                    model_training
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
                    AI Plans Your Trip
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    AI creates a personalized itinerary using available travel and price information.
                  </p>
                </div>
              </div>
              <div className="pt-space-md mt-space-sm text-on-surface-variant font-label-sm text-label-sm font-semibold">
                Step 3 of 4
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative flex flex-col justify-between border border-outline-variant/30">
              <div className="space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                    04
                  </span>
                  <span className="material-symbols-outlined text-outline-variant text-[24px]">
                    savings
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
                    Optimize Your Budget
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    If the trip exceeds your budget, AI suggests cheaper alternatives and adjusts the plan.
                  </p>
                </div>
              </div>
              <div className="pt-space-md mt-space-sm text-on-surface-variant font-label-sm text-label-sm font-semibold">
                Step 4 of 4
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL-TO-ACTION SECTION */}
      <section className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin my-space-xl">
        <div
          className="relative rounded-2xl bg-primary text-on-primary p-space-lg md:p-space-xl overflow-hidden shadow-xl text-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(18, 53, 36, 0.85), rgba(18, 53, 36, 0.92)), url(${hillBg})`,
          }}
        >
          {/* Subtle Decorative Radial Gradients */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-container/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-space-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-fixed font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Instant generation in seconds</span>
            </div>

            <h2 className="font-headline-xl text-headline-xl text-white font-bold tracking-tight">
              Ready to plan your next Sri Lankan adventure?
            </h2>

            <p className="font-body-lg text-body-lg text-surface-container-high leading-relaxed">
              Tell TripFit LK your budget and travel preferences, then let AI build a trip that works for you.
            </p>

            <div className="pt-space-xs flex flex-col sm:flex-row items-center justify-center gap-space-sm">
              <Link
                to="/plan/budget"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg transition-all shadow-md active:scale-95 whitespace-nowrap font-semibold"
              >
                <span>Start Planning</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <Link
                to="/ai-assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-lg text-label-lg transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Ask TripFit LK AI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
