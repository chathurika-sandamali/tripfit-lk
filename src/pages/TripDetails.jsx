import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { formatLKR } from '../data/mockData';
import { usePlan } from '../context/PlanContext';

export default function TripDetails() {
  const navigate = useNavigate();
  const {
    budget: currentBudget,
    destination: initialDest,
    travelers: initialTravelers,
    duration: initialDuration,
    interests: initialInterests,
    travelStyle: initialStyle,
    setTripDetails,
  } = usePlan();

  const [destination, setDestination] = useState(initialDest || 'Kandy');
  const [travelers, setTravelers] = useState(initialTravelers || 2);
  const [duration, setDuration] = useState(initialDuration || '3 Days');
  const [interests, setInterests] = useState(
    initialInterests && initialInterests.length > 0
      ? initialInterests
      : ['Nature', 'Culture', 'Food']
  );
  const [travelStyle, setTravelStyle] = useState(initialStyle || 'Balanced');

  const durationOptions = ['2 Days', '3 Days', '4 Days', '5 Days', '7 Days'];

  const interestList = [
    { name: 'Nature', icon: 'forest' },
    { name: 'Culture', icon: 'temple_buddhist' },
    { name: 'Adventure', icon: 'hiking' },
    { name: 'Food', icon: 'restaurant' },
    { name: 'Beaches', icon: 'beach_access' },
    { name: 'History', icon: 'account_balance' },
    { name: 'Relaxation', icon: 'spa' },
  ];

  const toggleInterest = (name) => {
    if (interests.includes(name)) {
      setInterests(interests.filter((i) => i !== name));
    } else {
      setInterests([...interests, name]);
    }
  };

  const saveCurrentState = () => {
    const daysNum = parseInt(duration, 10) || 3;
    setTripDetails({
      destination,
      travelers,
      duration,
      durationDays: daysNum,
      interests,
      travelStyle,
    });
  };

  const handleContinue = () => {
    saveCurrentState();
    navigate('/plan/ai');
  };

  const handleBack = () => {
    saveCurrentState();
    navigate('/plan/budget');
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-3xl mx-auto px-margin-mobile md:px-margin py-8 md:py-12 space-y-8">
        {/* Top Progress Indicator */}
        <ProgressSteps currentStep={2} />

        {/* Title Section */}
        <div className="text-center space-y-2 px-2">
          <h1 className="font-headline-xl text-headline-xl md:font-display-lg md:text-display-lg text-on-surface tracking-tight font-bold">
            Tell us about your trip
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
            Choose where you want to go and what kind of experience you want.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 border border-outline-variant/30">
          {/* SECTION 1: DESTINATION */}
          <section className="space-y-3">
            <label
              className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold"
              htmlFor="destination-input"
            >
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                location_on
              </span>
              Where do you want to go?
            </label>

            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-secondary text-[20px] pointer-events-none">
                search
              </span>
              <input
                className="w-full pl-11 pr-10 py-3 bg-surface rounded-xl font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/40 transition-all"
                id="destination-input"
                placeholder="Search a Sri Lankan destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              {destination && (
                <button
                  aria-label="Clear destination"
                  className="absolute right-3 p-1 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  type="button"
                  onClick={() => setDestination('')}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Quick Popular Destination Selectors */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-label-sm text-label-sm text-secondary font-medium">Quick Pick:</span>
              {[
                { name: 'Galle & South Coast', label: '🏖️ Galle & South Coast' },
                { name: 'Kandy & Hill Country', label: '🏛️ Kandy' },
                { name: 'Ella & Tea Country', label: '🚂 Ella' },
                { name: 'Sigiriya & Dambulla', label: '🦁 Sigiriya' },
              ].map((p) => {
                const firstWord = p.name.split(' ')[0].toLowerCase();
                const isSelected = destination.toLowerCase().includes(firstWord);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setDestination(p.name)}
                    className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-xs font-semibold'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/30 font-medium'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Recommendation Suggestion */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/20">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="material-symbols-outlined text-tertiary-container text-[20px] mt-0.5 sm:mt-0">
                  auto_awesome
                </span>
                <div className="space-y-0.5">
                  <span className="font-label-md text-label-md text-on-surface block sm:inline font-semibold">
                    Not sure where to go?
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    TripFit LK can recommend optimal destinations matching your{' '}
                    {formatLKR(currentBudget)} budget.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDestination('Kandy & Hill Country')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-container-lowest hover:bg-surface text-primary-container font-label-sm text-label-sm font-semibold rounded-lg shadow-sm shrink-0 transition-all self-start sm:self-auto border border-outline-variant/30"
              >
                <span>✨ Let AI recommend</span>
              </button>
            </div>
          </section>

          {/* SECTION 2: TRAVELERS */}
          <section className="space-y-3 pt-2">
            <label className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                group
              </span>
              Who's travelling?
            </label>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-outline-variant/30">
              <div className="space-y-0.5">
                <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Adults
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Age 12 or above
                </p>
              </div>
              <div className="flex items-center gap-3.5 bg-surface-container-lowest p-1.5 rounded-full shadow-sm border border-outline-variant/20">
                <button
                  aria-label="Decrease travelers"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all disabled:opacity-40"
                  type="button"
                  disabled={travelers <= 1}
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold min-w-[76px] text-center select-none">
                  {travelers} {travelers === 1 ? 'Adult' : 'Adults'}
                </span>
                <button
                  aria-label="Increase travelers"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all disabled:opacity-40"
                  type="button"
                  disabled={travelers >= 10}
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: TRIP DURATION */}
          <section className="space-y-3 pt-2">
            <label className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                calendar_today
              </span>
              How long is your trip?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {durationOptions.map((opt, idx) => {
                const isSelected = duration === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`py-3 px-4 rounded-xl font-label-lg text-label-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                      idx === durationOptions.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                    } ${
                      isSelected
                        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                        : 'bg-surface text-on-surface hover:bg-surface-container border border-outline-variant/30'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: TRAVEL INTERESTS */}
          <section className="space-y-3 pt-2">
            <div className="space-y-0.5">
              <label className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-primary-container text-[20px]">
                  interests
                </span>
                What are you interested in?
              </label>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Select multiple that match your vibe
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {interestList.map((item) => {
                const isSelected = interests.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleInterest(item.name)}
                    className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl font-label-md text-label-md transition-all ${
                      isSelected
                        ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm ring-1 ring-primary/20'
                        : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 5: TRAVEL STYLE */}
          <section className="space-y-3 pt-2">
            <label className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                explore
              </span>
              What's your travel style?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Budget */}
              <div
                onClick={() => setTravelStyle('budget')}
                className={`relative p-4 rounded-xl cursor-pointer transition-all space-y-2.5 border ${
                  travelStyle === 'budget'
                    ? 'bg-primary-fixed/40 shadow-sm ring-2 ring-primary-container border-primary-container'
                    : 'bg-surface hover:bg-surface-container-low border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      travelStyle === 'budget'
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container text-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">backpack</span>
                  </div>
                  {travelStyle === 'budget' && (
                    <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-label-lg text-label-lg font-semibold ${
                      travelStyle === 'budget' ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    Budget
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                    Keep costs low and prioritize affordability.
                  </p>
                </div>
              </div>

              {/* Balanced */}
              <div
                onClick={() => setTravelStyle('balanced')}
                className={`relative p-4 rounded-xl cursor-pointer transition-all space-y-2.5 border ${
                  travelStyle === 'balanced'
                    ? 'bg-primary-fixed/40 shadow-sm ring-2 ring-primary-container border-primary-container'
                    : 'bg-surface hover:bg-surface-container-low border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      travelStyle === 'balanced'
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container text-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">balance</span>
                  </div>
                  {travelStyle === 'balanced' && (
                    <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-label-lg text-label-lg font-semibold ${
                      travelStyle === 'balanced' ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    Balanced
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                    Balance comfort and experiences.
                  </p>
                </div>
              </div>

              {/* Comfort */}
              <div
                onClick={() => setTravelStyle('comfort')}
                className={`relative p-4 rounded-xl cursor-pointer transition-all space-y-2.5 border ${
                  travelStyle === 'comfort'
                    ? 'bg-primary-fixed/40 shadow-sm ring-2 ring-primary-container border-primary-container'
                    : 'bg-surface hover:bg-surface-container-low border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      travelStyle === 'comfort'
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-surface-container text-primary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">hotel</span>
                  </div>
                  {travelStyle === 'comfort' && (
                    <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={`font-label-lg text-label-lg font-semibold ${
                      travelStyle === 'comfort' ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    Comfort
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1 leading-snug">
                    Prioritize comfort while staying within your budget.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BUDGET SUMMARY BAR */}
          <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-[18px]">
                  account_balance_wallet
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Your Budget: {formatLKR(currentBudget)}
                </span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary-container bg-surface-container-lowest px-2 py-0.5 rounded-full w-fit">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Step 1 completed
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors underline self-start sm:self-auto shrink-0 cursor-pointer"
            >
              Edit in Step 1
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container font-label-lg text-label-lg text-on-surface shadow-sm transition-all border border-outline-variant/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>Continue to AI Plan</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
