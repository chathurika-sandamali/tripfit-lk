import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Budget from './pages/Budget';
import TripDetails from './pages/TripDetails';
import AIPlanning from './pages/AIPlanning';
import Recommendations from './pages/Recommendations';
import Itinerary from './pages/Itinerary';
import BudgetOptimization from './pages/BudgetOptimization';
import MyTrips from './pages/MyTrips';
import AIAssistant from './pages/AIAssistant';

import { PlanProvider } from './context/PlanContext';

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();

  // Determine whether to show minimal footer on multi-step planner wizards
  const isWizardRoute =
    location.pathname.startsWith('/plan/') ||
    location.pathname === '/recommendations' ||
    location.pathname.includes('/optimize');

  return (
    <PlanProvider>
      <div className="min-h-screen flex flex-col bg-background font-body-md text-body-md text-on-surface">
        <ScrollToTop />
        <Navbar />

        <main className="w-full pt-20 flex-1 bg-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan/budget" element={<Budget />} />
            <Route path="/plan/details" element={<TripDetails />} />
            <Route path="/plan/ai" element={<AIPlanning />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/trip/:tripId" element={<Itinerary />} />
            <Route path="/trip/:tripId/optimize" element={<BudgetOptimization />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer minimal={isWizardRoute} />
      </div>
    </PlanProvider>
  );
}
