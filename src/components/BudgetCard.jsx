import React from 'react';
import { formatLKR, calculateBudgetStatus } from '../data/mockData';

export default function BudgetCard({
  targetBudget,
  estimatedCost,
  className = '',
  showBreakdown = false,
  breakdown = null,
  isOptimized = false,
}) {
  const status = calculateBudgetStatus(targetBudget, estimatedCost, isOptimized);

  return (
    <div
      className={`bg-surface-container-lowest text-on-surface rounded-xl p-space-lg shadow-sm border border-outline-variant/30 ${className}`}
    >
      <div className="flex items-center justify-between pb-space-sm">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">
            account_balance_wallet
          </span>
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Trip Budget Summary
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${status.statusBadgeClass}`}
        >
          {status.statusText}
        </span>
      </div>

      <div className="p-space-md rounded-lg bg-surface-container-low space-y-space-sm my-space-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
              Your Spending Limit
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {formatLKR(targetBudget)}
            </span>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
              Estimated Total
            </span>
            <span
              className={`font-headline-md text-headline-md font-bold ${
                status.fits ? 'text-primary' : 'text-amber-800'
              }`}
            >
              {formatLKR(estimatedCost)}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between font-label-sm text-label-sm">
          <span className="text-on-surface-variant">
            {status.fits ? 'Remaining Buffer:' : 'Budget Overrun:'}
          </span>
          <span
            className={`font-semibold ${
              status.fits ? 'text-primary' : 'text-amber-800'
            }`}
          >
            {status.fits ? `+${formatLKR(status.difference)}` : `-${formatLKR(status.difference)}`}
          </span>
        </div>
      </div>

      {showBreakdown && breakdown && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="p-2 rounded-lg bg-surface-container text-center">
            <span className="block font-label-sm text-[11px] text-on-surface-variant">
              Transport
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {formatLKR(breakdown.transport)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container text-center">
            <span className="block font-label-sm text-[11px] text-on-surface-variant">
              Lodging
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {formatLKR(breakdown.accommodation)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container text-center">
            <span className="block font-label-sm text-[11px] text-on-surface-variant">
              Food
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {formatLKR(breakdown.food)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-surface-container text-center">
            <span className="block font-label-sm text-[11px] text-on-surface-variant">
              Activities
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {formatLKR(breakdown.activities)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
