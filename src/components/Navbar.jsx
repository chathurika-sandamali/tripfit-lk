import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', path: '/' },
    { label: 'Plan Trip', path: '/plan/budget' },
    { label: 'My Trips', path: '/my-trips' },
    { label: 'AI Assistant', path: '/ai-assistant' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
      <div className="h-20 max-w-[1280px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        {/* Brand */}
        <div className="flex items-center gap-space-md">
          <Link to="/" className="flex items-center gap-space-sm group">
            <img
              alt="TripFit LK Logo"
              className="h-8 w-auto object-contain"
              src={logoImg}
            />
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              TripFit LK
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            Student Research Project
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-space-xs">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-space-md py-space-sm font-label-lg text-label-lg rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-space-md">
          <Link
            to="/plan/budget"
            className="hidden sm:inline-flex items-center justify-center px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-colors shadow-sm"
          >
            Get Started
          </Link>

          <Link
            to="/my-trips"
            className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors shadow-xs"
            title="My Saved Trips"
            aria-label="My Saved Trips"
          >
            <span className="material-symbols-outlined text-[18px]">
              bookmark
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle Navigation Menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-outline-variant/40 px-margin-mobile py-4 shadow-lg">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-space-md py-3 font-label-lg text-label-lg rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/plan/budget"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
