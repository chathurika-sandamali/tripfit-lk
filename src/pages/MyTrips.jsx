import React from 'react';
import { Link } from 'react-router-dom';
import { formatLKR } from '../data/mockData';
import { usePlan } from '../context/PlanContext';
import ellaImg from '../assets/images/ella-bridge.png';
import kandyImg from '../assets/images/kandy-lake.png';
import galleImg from '../assets/images/galle-coast.png';

const imageMap = {
  'ella-adventure': ellaImg,
  'kandy-cultural-escape': kandyImg,
  'galle-coast': galleImg,
};

export default function MyTrips() {
  const { savedTripIds, getTripCalculations, setActiveTripId } = usePlan();

  const allAvailableIds = ['kandy-cultural-escape', 'ella-adventure', 'galle-coast'];
  const displayIds = savedTripIds && savedTripIds.length > 0 ? savedTripIds : allAvailableIds;
  const trips = displayIds.map((id) => getTripCalculations(id));
  const overBudgetTrip = trips.find((t) => !t.status.fits);

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto w-full px-margin-mobile md:px-margin py-space-lg md:py-space-xl flex flex-col gap-space-xl">
        {/* 1. Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Academic Research Prototype
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                LKR Heuristic Engine v2.4
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
              My Trips
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              View, refine, and manage your saved algorithmic Sri Lankan travel plans.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start sm:self-center">
            <Link
              to="/plan/budget"
              className="inline-flex items-center gap-space-xs bg-primary-container text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create New Trip</span>
            </Link>
          </div>
        </header>

        {/* 2. Featured Optimization Card (shown if an over-budget trip exists) */}
        {overBudgetTrip && (
          <section className="w-full bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm relative overflow-hidden border border-outline-variant/30">
            {/* Ambient warning accent indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
            <div className="flex flex-col gap-space-lg pt-space-xs">
              {/* Top row */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-md">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-label-md text-label-md font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-amber-800">
                        warning
                      </span>
                      Requires optimization
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">
                      Active Target: Budget Limit Exceeded
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                    Optimize your {overBudgetTrip.title}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                    Your current itinerary configuration exceeds your selected target budget of{' '}
                    {formatLKR(overBudgetTrip.targetBudget)} by{' '}
                    {formatLKR(overBudgetTrip.status.difference)}. Review
                    AI-recommended transit shifts and lower-cost accommodations to restore budget balance.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/trip/${overBudgetTrip.id}/optimize`}
                    onClick={() => setActiveTripId(overBudgetTrip.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-label-md text-label-md font-semibold transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                    <span>Optimize Trip</span>
                  </Link>
                </div>
              </div>

              {/* Optimization Levers Sub-panel */}
              <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-md border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Available Algorithmic Levers
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Recommended modifications computed to drop trip cost below{' '}
                      {formatLKR(overBudgetTrip.targetBudget)}.
                    </p>
                  </div>
                  <Link
                    to={`/trip/${overBudgetTrip.id}/optimize`}
                    onClick={() => setActiveTripId(overBudgetTrip.id)}
                    className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors shadow-sm self-start sm:self-auto font-semibold border border-outline-variant/30"
                  >
                    <span>Apply Recommended Changes (Save LKR 15,000)</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between gap-space-sm shadow-sm border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[20px]">train</span>
                      </div>
                      <div className="truncate">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Switch Transport
                        </p>
                        <p className="font-body-sm text-body-sm text-secondary truncate">
                          Scenic Train instead of taxi
                        </p>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-primary font-bold shrink-0 bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                      -LKR 5,000
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between gap-space-sm shadow-sm border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[20px]">bed</span>
                      </div>
                      <div className="truncate">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Local Guesthouse
                        </p>
                        <p className="font-body-sm text-body-sm text-secondary truncate">
                          Family-run scenic stay
                        </p>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-primary font-bold shrink-0 bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                      -LKR 7,000
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between gap-space-sm shadow-sm border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          confirmation_number
                        </span>
                      </div>
                      <div className="truncate">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Community Trails
                        </p>
                        <p className="font-body-sm text-body-sm text-secondary truncate">
                          Self-guided nature walks
                        </p>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md text-primary font-bold shrink-0 bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                      -LKR 3,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Saved Trips Section */}
        <section className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Saved Trips
              </h2>
              <span className="font-label-md text-label-md px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-semibold">
                {trips.length} Trips
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>All Active Plans</span>
            </div>
          </div>

          {/* Responsive Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {trips.map((trip) => {
              const status = trip.status;
              const cardImage = imageMap[trip.id] || kandyImg;

              return (
                <article
                  key={trip.id}
                  className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group border border-outline-variant/30"
                >
                  {/* Card Image Header */}
                  <div className="relative w-full h-52 overflow-hidden bg-surface-container">
                    <img
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                      src={cardImage}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-md text-label-md shadow-sm font-semibold ${status.statusBadgeClass}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {status.fits ? 'check_circle' : 'warning'}
                        </span>
                        {status.statusText}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="font-label-sm text-label-sm text-white/80 uppercase tracking-wide">
                        {trip.destination}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-white drop-shadow-sm font-bold">
                        {trip.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-space-md md:p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                    <div className="flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pb-space-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">
                            calendar_today
                          </span>
                          {trip.durationDays} Days ({trip.durationNights} Nights)
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">group</span>
                          {trip.travelers} Travelers
                        </span>
                      </div>

                      {/* Cost Row */}
                      <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between border border-outline-variant/20">
                        <div>
                          <span className="font-label-sm text-label-sm text-secondary">
                            Target Budget
                          </span>
                          <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {formatLKR(trip.targetBudget)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-label-sm text-label-sm text-secondary">
                            Estimated Total
                          </span>
                          <p
                            className={`font-headline-sm text-headline-sm font-bold ${
                              status.fits ? 'text-primary' : 'text-amber-800'
                            }`}
                          >
                            {formatLKR(trip.estimatedCost)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-label-sm font-label-sm text-secondary">
                          <span>
                            {Math.round((trip.estimatedCost / trip.targetBudget) * 100)}% of limit
                          </span>
                          <span
                            className={`font-semibold ${
                              status.fits ? 'text-primary' : 'text-amber-800'
                            }`}
                          >
                            {status.fits
                              ? `+${formatLKR(status.difference)} buffer`
                              : `-${formatLKR(status.difference)} overrun`}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              status.fits ? 'bg-primary' : 'bg-amber-700'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (trip.estimatedCost / trip.targetBudget) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/30">
                      <Link
                        to={`/trip/${trip.id}`}
                        onClick={() => setActiveTripId(trip.id)}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors font-semibold"
                      >
                        <span>View Trip</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>

                      {!status.fits ? (
                        <Link
                          to={`/trip/${trip.id}/optimize`}
                          onClick={() => setActiveTripId(trip.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-label-md text-label-md transition-colors font-semibold"
                        >
                          <span className="material-symbols-outlined text-[16px]">tune</span>
                          <span>Optimize</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/trip/${trip.id}/optimize`}
                          onClick={() => setActiveTripId(trip.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">tune</span>
                          <span>Customize</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 4. Plan Another Adventure CTA Card */}
        <section className="p-space-lg rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">travel_explore</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Want to explore another Sri Lankan destination?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Configure a new trip plan with custom budget limits for Nuwara Eliya, Sigiriya, or Mirissa.
              </p>
            </div>
          </div>
          <Link
            to="/plan/budget"
            className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm shrink-0 font-semibold"
          >
            Create New Plan
          </Link>
        </section>
      </div>
    </div>
  );
}
