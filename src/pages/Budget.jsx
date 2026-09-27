import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { PRESET_BUDGETS } from '../data/mockData';
import { usePlan } from '../context/PlanContext';

export default function Budget() {
  const navigate = useNavigate();
  const { budget, setBudget } = usePlan();

  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US');
  };

  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const val = parseInt(raw, 10) || 0;
    setBudget(val);
  };

  const handleSliderChange = (e) => {
    setBudget(parseInt(e.target.value, 10));
  };

  const handlePresetSelect = (amount) => {
    setBudget(amount);
  };

  const getTierDescription = (val) => {
    if (val < 40000) {
      return 'Ideal for backpackers, public buses & local homestays';
    } else if (val < 90000) {
      return 'Great for standard trains, guesthouses & local eateries';
    } else if (val < 180000) {
      return 'Ideal for balanced cultural & scenic train route';
    } else if (val < 350000) {
      return 'Comfort travel, boutique stays & private van hire';
    } else {
      return 'Comprehensive island tour, luxury villas & dedicated driver';
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin py-space-lg flex flex-col">
      {/* Stepper Header */}
      <div className="w-full max-w-2xl mx-auto mb-space-lg">
        <ProgressSteps currentStep={1} />
      </div>

      {/* Page Title & Orientation */}
      <div className="max-w-2xl mx-auto text-center mb-space-lg">
        <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-space-xs font-bold">
          How much do you want to spend?
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
          Set your total trip budget. TripFit LK will build your travel plan around it.
        </p>
      </div>

      {/* Main Budget Configuration Card */}
      <div className="max-w-2xl w-full mx-auto bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-space-lg border border-outline-variant/30">
        {/* Card Header Banner */}
        <div className="p-space-lg bg-surface-container-low/60 flex items-start justify-between gap-space-md border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Your Trip Budget
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Enter the maximum amount you want to spend on your trip.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
          </div>
        </div>

        <div className="p-space-lg flex flex-col gap-space-lg">
          {/* Interactive Big Budget Display */}
          <div className="bg-surface-container-low rounded-xl p-space-md sm:p-space-lg flex flex-col items-center justify-center text-center border border-outline-variant/20">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-space-xs">
              Total Budget (Sri Lankan Rupee)
            </span>
            <div className="flex items-baseline justify-center gap-2 my-space-xs">
              <span className="px-2.5 py-1 rounded-md bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold">
                LKR
              </span>
              <div className="relative flex items-center">
                <input
                  aria-label="Trip Budget in Sri Lankan Rupees"
                  className="font-display-lg text-display-lg text-primary tracking-tight bg-transparent text-center focus:outline-none w-64 max-w-full font-bold"
                  id="budget-input"
                  type="text"
                  value={formatNumber(budget)}
                  onChange={handleInputChange}
                />
                <span className="material-symbols-outlined text-primary/40 text-[18px] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  edit
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant mt-space-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">
                verified
              </span>
              <span className="font-label-sm text-label-sm font-medium text-primary">
                {getTierDescription(budget)}
              </span>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Recommended Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_BUDGETS.map((preset, idx) => {
                const isSelected = budget === preset.amount;
                const isSpanTwo = idx === PRESET_BUDGETS.length - 1;
                return (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => handlePresetSelect(preset.amount)}
                    className={`px-3 py-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                      isSpanTwo ? 'col-span-2 sm:col-span-2' : ''
                    } ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`font-label-md text-label-md font-semibold ${
                          isSelected ? 'text-on-primary' : 'text-on-surface'
                        }`}
                      >
                        {preset.label}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-label-sm text-label-sm mt-0.5 ${
                        isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'
                      }`}
                    >
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Range Slider */}
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <div className="relative w-full flex items-center py-2">
              <input
                aria-label="Trip budget slider"
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                id="budget-range"
                max="500000"
                min="10000"
                step="5000"
                type="range"
                value={Math.min(Math.max(budget, 10000), 500000)}
                onChange={handleSliderChange}
              />
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>LKR 10,000</span>
              <span className="text-primary font-medium">Standard range</span>
              <span>LKR 500,000+</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-primary">
                check_circle
              </span>
              <span className="font-label-sm text-label-sm">
                You can change your budget later in the planning phase.
              </span>
            </div>
          </div>

          {/* Section: Budget Allocation Preview */}
          <div className="pt-space-md border-t border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-sm">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Your budget will cover
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  AI will allocate your budget based on your trip.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Dynamic Split
              </span>
            </div>

            {/* 4 Allocation Rows */}
            <div className="flex flex-col gap-2">
              {/* 1. Transport */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[20px]">train</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Transport (~25%)
                    </h4>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      Train / Bus / Tuk-tuk
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Train, public bus, or private driver based on your budget limit
                  </p>
                </div>
                <div className="text-right font-label-md text-label-md font-bold text-on-surface shrink-0 hidden sm:block">
                  LKR {Math.round(budget * 0.25).toLocaleString()}
                </div>
              </div>

              {/* 2. Accommodation */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[20px]">bed</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Accommodation (~35%)
                    </h4>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      Homestays to Hotels
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Guesthouses, boutique stays, or hotels within limits
                  </p>
                </div>
                <div className="text-right font-label-md text-label-md font-bold text-on-surface shrink-0 hidden sm:block">
                  LKR {Math.round(budget * 0.35).toLocaleString()}
                </div>
              </div>

              {/* 3. Food */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[20px]">restaurant</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Food &amp; Dining (~20%)
                    </h4>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      Cuisine
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Authentic local rice &amp; curry, cafes, and dining
                  </p>
                </div>
                <div className="text-right font-label-md text-label-md font-bold text-on-surface shrink-0 hidden sm:block">
                  LKR {Math.round(budget * 0.2).toLocaleString()}
                </div>
              </div>

              {/* 4. Activities */}
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    confirmation_number
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Activities &amp; Permits (~20%)
                    </h4>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      Sightseeing
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Entry permits, nature reserves, and cultural landmarks
                  </p>
                </div>
                <div className="text-right font-label-md text-label-md font-bold text-on-surface shrink-0 hidden sm:block">
                  LKR {Math.round(budget * 0.2).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Planning note */}
            <div className="mt-space-md p-3 rounded-xl bg-surface-container-high/60 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                info
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Final costs depend on your destination, travel dates, accommodation tier, transport type, and chosen activities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Navigation Controls */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-space-md mb-space-xl">
        <Link
          to="/"
          className="px-5 py-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center gap-2 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <button
          type="button"
          onClick={() => navigate('/plan/details', { state: { budget } })}
          className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer font-semibold"
        >
          <span>Continue to Trip Details</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
