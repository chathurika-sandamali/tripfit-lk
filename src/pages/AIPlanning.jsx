import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProgressSteps from '../components/ProgressSteps';
import { formatLKR } from '../data/mockData';
import { usePlan } from '../context/PlanContext';

export default function AIPlanning() {
  const navigate = useNavigate();
  const {
    budget,
    destination,
    travelers,
    duration,
    interests,
    travelStyle,
    generateLivePlan,
    isGeminiConfigured,
  } = usePlan();

  const [currentStage, setCurrentStage] = useState(3);

  useEffect(() => {
    let isCancelled = false;
    
    // Trigger live Gemini generation if configured
    if (isGeminiConfigured) {
      generateLivePlan().catch((err) => console.warn('Gemini async run warning:', err));
    }

    const timer1 = setTimeout(() => !isCancelled && setCurrentStage(4), 900);
    const timer2 = setTimeout(() => !isCancelled && setCurrentStage(5), 1800);
    const timer3 = setTimeout(() => {
      if (!isCancelled) navigate('/recommendations');
    }, isGeminiConfigured ? 3200 : 2600);

    return () => {
      isCancelled = true;
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate, isGeminiConfigured, generateLivePlan]);

  const handleSkip = () => {
    navigate('/recommendations');
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin py-space-md md:py-space-lg flex flex-col items-center">
        {/* Top Progress Wizard Header */}
        <div className="w-full max-w-2xl mb-space-lg">
          <ProgressSteps currentStep={3} />
        </div>

        {/* Header with Modern Loading Indicator */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-space-md">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute w-10 h-10 rounded-full bg-primary text-white shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl text-on-surface tracking-tight font-bold">
            Crafting your perfect itinerary...
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2 max-w-md">
            TripFit LK is matching trains, verified homestays, and regional activities to fit within your budget.
          </p>
        </div>

        {/* Main Processing Card */}
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-8 flex flex-col border border-outline-variant/30">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">
                auto_awesome
              </span>
              <h2 className="text-lg text-on-surface font-bold">
                Optimizing Trip Options
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {isGeminiConfigured ? 'Gemini 1.5 Flash' : 'AI Analysis'}
            </span>
          </div>

          {/* Trip Summary Grid */}
          <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 mb-space-lg border border-outline-variant/20">
            <div className="text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-3 font-semibold">
              Your Trip Preferences
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                </div>
                <div className="min-w-0">
                  <div className="font-label-sm text-label-sm text-secondary">Budget</div>
                  <div className="font-label-lg text-label-lg text-primary font-bold truncate">
                    {formatLKR(budget)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                </div>
                <div className="min-w-0">
                  <div className="font-label-sm text-label-sm text-secondary">Destination</div>
                  <div className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {destination}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">group</span>
                </div>
                <div className="min-w-0">
                  <div className="font-label-sm text-label-sm text-secondary">Travelers</div>
                  <div className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {travelers} Adults
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                </div>
                <div className="min-w-0">
                  <div className="font-label-sm text-label-sm text-secondary">Duration</div>
                  <div className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {duration}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">interests</span>
                </div>
                <div className="min-w-0">
                  <div className="font-label-sm text-label-sm text-secondary">Interests</div>
                  <div className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {Array.isArray(interests) ? interests.join(' • ') : interests}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[16px]">balance</span>
                </div>
                <div className="min-w-0">
                  <div className="font-label-sm text-label-sm text-secondary">Travel Style</div>
                  <div className="font-label-lg text-label-lg text-on-surface font-semibold truncate capitalize">
                    {travelStyle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Stages Stepper */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                AI Planning Progress
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary-container animate-spin">
                  refresh
                </span>
                Analyzing real-world route options...
              </span>
            </div>

            {/* Vertical Timeline Rows */}
            <div className="flex flex-col gap-2.5">
              {/* Stage 1: Completed */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center mt-0.5 shrink-0">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Checking your budget
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Validating financial ceiling and baseline cost allocations.
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold shrink-0">
                  Completed
                </span>
              </div>

              {/* Stage 2: Completed */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center mt-0.5 shrink-0">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Finding suitable transport options
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Scanning train routes (Scenic Kandy Express) and public transit options.
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold shrink-0">
                  Completed
                </span>
              </div>

              {/* Stage 3: In Progress or Completed */}
              <div
                className={`flex items-center justify-between p-3 rounded-lg transition-colors relative overflow-hidden ${
                  currentStage >= 4
                    ? 'bg-surface-container-low'
                    : 'bg-surface-container'
                }`}
              >
                {currentStage < 4 && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container" />
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                      currentStage >= 4
                        ? 'bg-primary-container text-on-primary'
                        : 'bg-primary-fixed text-primary animate-pulse'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {currentStage >= 4 ? 'check' : 'progress_activity'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      Matching accommodation options
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface">
                      Filtering boutique guesthouses and hotels in {destination}.
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold shrink-0 ${
                    currentStage >= 4
                      ? 'bg-primary-fixed text-on-primary-fixed-variant'
                      : 'bg-primary-container text-on-primary'
                  }`}
                >
                  {currentStage >= 4 ? 'Completed' : 'In progress'}
                </span>
              </div>

              {/* Stage 4: Selecting Activities */}
              <div
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentStage >= 4 ? 'bg-surface-container' : 'bg-surface opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                      currentStage >= 5
                        ? 'bg-primary-container text-on-primary'
                        : currentStage === 4
                        ? 'bg-primary-fixed text-primary animate-pulse'
                        : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {currentStage >= 5 ? 'check' : currentStage === 4 ? 'progress_activity' : 'schedule'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-label-lg text-label-lg font-semibold ${
                        currentStage >= 4 ? 'text-primary' : 'text-secondary font-medium'
                      }`}
                    >
                      Selecting activities and experiences
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      Temple of the Tooth, Royal Botanical Gardens, and tea trails.
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-secondary-container font-label-sm text-label-sm shrink-0">
                  {currentStage >= 5 ? 'Completed' : currentStage === 4 ? 'In progress' : 'Waiting'}
                </span>
              </div>

              {/* Stage 5: Optimizing */}
              <div
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentStage >= 5 ? 'bg-surface-container' : 'bg-surface opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                      currentStage >= 5
                        ? 'bg-primary-container text-on-primary animate-pulse'
                        : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {currentStage >= 5 ? 'progress_activity' : 'tune'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-secondary font-medium">
                      Optimizing the itinerary
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      Balancing travel times, train connections, and buffer windows.
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-secondary-container font-label-sm text-label-sm shrink-0">
                  {currentStage >= 5 ? 'Finalizing...' : 'Waiting'}
                </span>
              </div>
            </div>
          </div>

          {/* Budget-Aware Message Banner */}
          <div className="bg-primary-fixed/30 rounded-xl p-4 flex items-start gap-3 mt-space-md border border-primary/10">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-md text-label-md text-primary font-semibold">
                Smart Budget Balancing
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We calculate accommodation, transit, and activities to stay safely within your{' '}
                {formatLKR(budget)} target budget.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-sm text-label-sm font-semibold border border-outline-variant/40 shadow-xs cursor-pointer"
            >
              Skip to Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
