import React from 'react';
import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';

export default function ProgressSteps({ currentStep = 1, tripId }) {
  let activeId = tripId;
  try {
    const plan = usePlan();
    if (!activeId && plan?.activeTripId) {
      activeId = plan.activeTripId;
    }
  } catch (e) {
    // fallback if used outside provider
  }
  const effectiveTripId = activeId || 'ella-adventure';

  const steps = [
    { num: 1, label: '01 Budget', path: '/plan/budget', title: 'Budget Setup' },
    { num: 2, label: '02 Trip Details', path: '/plan/details', title: 'Travel Preferences' },
    { num: 3, label: '03 AI Plan', path: '/recommendations', title: 'AI Recommendations' },
    { num: 4, label: '04 Optimize', path: `/trip/${effectiveTripId}/optimize`, title: 'Budget Optimization' },
  ];

  const current = steps[currentStep - 1] || steps[0];

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-5 border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-md text-label-md text-primary-container font-semibold tracking-wide">
            Step {currentStep} of 4 • {current.title}
          </span>
        </div>
        <span className="font-label-lg text-label-lg text-secondary">
          Step {currentStep}: {current.title}
        </span>
      </div>

      {/* Stepper Track */}
      <div className="relative">
        <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden flex">
          {steps.map((s) => {
            const isFilled = s.num <= currentStep;
            return (
              <div
                key={s.num}
                className={`w-1/4 transition-all duration-300 ${
                  isFilled ? 'bg-primary-container' : 'bg-surface-container-high'
                }`}
              />
            );
          })}
        </div>

        {/* Step Nodes */}
        <div className="grid grid-cols-4 pt-3 text-center">
          {steps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isActive = s.num === currentStep;

            const NodeContent = (
              <div className="flex flex-col items-center gap-1 group">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm shadow-sm transition-all ${
                    isCompleted
                      ? 'bg-primary-container text-on-primary'
                      : isActive
                      ? 'bg-primary text-on-primary ring-2 ring-primary-container ring-offset-2'
                      : 'bg-surface-container text-secondary'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  ) : (
                    <span>{s.num}</span>
                  )}
                </div>
                <span
                  className={`font-label-sm text-[11px] sm:text-label-sm text-center leading-tight truncate max-w-full px-0.5 ${
                    isActive
                      ? 'text-primary font-bold'
                      : isCompleted
                      ? 'text-primary-container font-medium'
                      : 'text-secondary'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );

            // Allow navigation to completed steps or current step
            if (isCompleted || isActive) {
              return (
                <Link key={s.num} to={s.path} className="cursor-pointer">
                  {NodeContent}
                </Link>
              );
            }

            return (
              <div key={s.num} className="cursor-default">
                {NodeContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
