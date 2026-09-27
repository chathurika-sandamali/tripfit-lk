import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';

export default function Footer({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="w-full py-6 border-t border-outline-variant/30 bg-surface text-center text-on-surface-variant font-label-sm text-label-sm">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TripFit LK • Smart Budget Travel Platform</span>
          <span className="text-on-surface-variant/70">
            Real-time travel estimates subject to local seasonal rates
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 pt-16 pb-12 text-on-surface">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg pb-12 border-b border-outline-variant/30">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-space-sm group w-fit">
              <img
                alt="TripFit LK Logo"
                className="h-8 w-auto object-contain"
                src={logoImg}
              />
              <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                TripFit LK
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Sri Lanka's budget-first AI travel planner. Built around your actual spending limit, verified rail timetables, and authentic local stays.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              AI Travel Platform
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-label-lg text-label-lg text-primary font-semibold uppercase tracking-wider">
              Planner
            </h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <Link to="/plan/budget" className="hover:text-primary transition-colors">
                  Set Budget
                </Link>
              </li>
              <li>
                <Link to="/plan/details" className="hover:text-primary transition-colors">
                  Trip Details
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-primary transition-colors">
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:text-primary transition-colors">
                  My Saved Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistant & Intelligence */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-label-lg text-label-lg text-primary font-semibold uppercase tracking-wider">
              Travel AI
            </h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <Link to="/ai-assistant" className="hover:text-primary transition-colors">
                  Ask Travel AI
                </Link>
              </li>
              <li>
                <Link to="/trip/ella-adventure/optimize" className="hover:text-primary transition-colors">
                  Budget Optimizer
                </Link>
              </li>
              <li>
                <Link to="/plan/ai" className="hover:text-primary transition-colors">
                  AI Trip Generator
                </Link>
              </li>
              <li>
                <Link to="/trip/kandy-cultural-escape" className="hover:text-primary transition-colors">
                  Sample Cultural Route
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Data */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-label-lg text-label-lg text-primary font-semibold uppercase tracking-wider">
              Methodology
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Pricing curves combine Sri Lanka Railways tariff data, National Transport Commission bus fares, and verified local guesthouse baseline models.
            </p>
            <div className="pt-2 flex items-center gap-2 text-primary font-label-sm text-label-sm font-medium">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>100% Budget Transparent</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-on-surface-variant">
          <p>© 2026 TripFit LK. All rights reserved.</p>
          <p className="text-on-surface-variant/80">
            Built with React, Vite &amp; Tailwind CSS. Powered by Google Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
