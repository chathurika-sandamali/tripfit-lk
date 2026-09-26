import React from 'react';
import { Link } from 'react-router-dom';
import { formatLKR, calculateBudgetStatus } from '../data/mockData';
import kandyImg from '../assets/images/kandy-lake.png';
import ellaImg from '../assets/images/ella-bridge.png';
import galleImg from '../assets/images/galle-coast.png';
import teaImg from '../assets/images/tea-country.png';

const imageMap = {
  'kandy-lake': kandyImg,
  'ella-bridge': ellaImg,
  'galle-coast': galleImg,
  'tea-country': teaImg,
};

export default function TripCard({
  trip,
  showOptimizeAction = false,
  onOptimize = null,
}) {
  const {
    id,
    title,
    durationDays,
    durationNights,
    targetBudget,
    estimatedCost,
    image,
    route,
    tags = [],
  } = trip;

  const imgSrc = imageMap[image] || kandyImg;
  const status = calculateBudgetStatus(targetBudget, estimatedCost, trip.hasAppliedSavings);

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Image Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-surface-container">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm font-semibold shadow-sm">
            {durationDays} Days • {durationNights || durationDays - 1} Nights
          </span>
          <span
            className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold shadow-sm ${status.statusBadgeClass}`}
          >
            {status.statusText}
          </span>
        </div>

        {/* Title inside bottom overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-headline-md text-headline-md text-white font-bold drop-shadow-sm">
            {title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Route */}
          {route && (
            <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 line-clamp-1 mb-3">
              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
                alt_route
              </span>
              <span>{route}</span>
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Budget comparison */}
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant block font-label-sm">
                Target Budget
              </span>
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                {formatLKR(targetBudget)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant block font-label-sm">
                Estimated Total
              </span>
              <span
                className={`font-label-lg text-label-lg font-bold ${
                  status.fits ? 'text-primary' : 'text-amber-800'
                }`}
              >
                {formatLKR(estimatedCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-outline-variant/30 flex items-center gap-2">
          <Link
            to={`/trip/${id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors text-center"
          >
            <span>View Trip</span>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </Link>

          {!status.fits && (
            <Link
              to={`/trip/${id}/optimize`}
              className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-label-md text-label-md transition-colors"
              title="Optimize this trip to fit budget"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="hidden sm:inline">Optimize</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
