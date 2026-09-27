import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_TRIPS, calculateBudgetStatus, formatLKR } from '../data/mockData';
import { generateTripWithAI, isGeminiConfigured } from '../services/geminiService';

const PlanContext = createContext(null);

const STORAGE_KEY = 'tripfit_plan_state';
const LEGACY_STORAGE_KEY = 'lankatrip_plan_state';

const DEFAULT_STATE = {
  budget: 100000,
  destination: 'Kandy',
  travelers: 2,
  duration: '3 Days',
  durationDays: 3,
  interests: ['Nature', 'Culture', 'Food'],
  travelStyle: 'Balanced',
  activeTripId: 'kandy-cultural-escape',
  aiCustomTrip: null,
  isGeneratingAI: false,
  // Track applied optimization levers per trip: { [tripId]: { [leverId]: boolean } }
  appliedOptimizations: {
    'kandy-cultural-escape': {
      transport: false,
      accommodation: false,
      activities: false,
    },
    'ella-adventure': {
      transport: true, // Default 1 lever for Ella to showcase optimization
      accommodation: false,
      activities: false,
    },
    'galle-coast': {
      transport: false,
      accommodation: false,
      activities: false,
    },
  },
  savedTripIds: ['kandy-cultural-escape', 'ella-adventure', 'galle-coast'],
};

export function PlanProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load saved state from localStorage:', e);
    }
    return DEFAULT_STATE;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [state]);

  // Helper to match trip ID based on destination query
  const matchTripByDestination = (destinationStr) => {
    const d = (destinationStr || '').toLowerCase();
    if (
      d.includes('galle') ||
      d.includes('mirissa') ||
      d.includes('south') ||
      d.includes('beach') ||
      d.includes('coast') ||
      d.includes('unawatuna') ||
      d.includes('hikkaduwa') ||
      d.includes('matara')
    ) {
      return 'galle-coast';
    }
    if (
      d.includes('ella') ||
      d.includes('peak') ||
      d.includes('bridge') ||
      d.includes('highland') ||
      d.includes('demodara') ||
      d.includes('bandarawela') ||
      d.includes('badulla')
    ) {
      return 'ella-adventure';
    }
    return 'kandy-cultural-escape';
  };

  const setBudget = (budget) => {
    const num = Math.max(1000, Number(budget) || 0);
    setState((prev) => ({ ...prev, budget: num }));
  };

  const setTripDetails = (details) => {
    setState((prev) => {
      const nextDest = details.destination !== undefined ? details.destination : prev.destination;
      const matchedTrip = matchTripByDestination(nextDest);
      return {
        ...prev,
        ...details,
        activeTripId: matchedTrip,
      };
    });
  };

  const setActiveTripId = (tripId) => {
    setState((prev) => ({ ...prev, activeTripId: tripId }));
  };

  const toggleOptimization = (tripId, leverId) => {
    setState((prev) => {
      const currentTripOpts = prev.appliedOptimizations[tripId] || {
        transport: false,
        accommodation: false,
        activities: false,
      };
      return {
        ...prev,
        appliedOptimizations: {
          ...prev.appliedOptimizations,
          [tripId]: {
            ...currentTripOpts,
            [leverId]: !currentTripOpts[leverId],
          },
        },
      };
    });
  };

  const applyAllOptimizations = (tripId) => {
    setState((prev) => ({
      ...prev,
      appliedOptimizations: {
        ...prev.appliedOptimizations,
        [tripId]: {
          transport: true,
          accommodation: true,
          activities: true,
        },
      },
    }));
  };

  const resetOptimizations = (tripId) => {
    setState((prev) => ({
      ...prev,
      appliedOptimizations: {
        ...prev.appliedOptimizations,
        [tripId]: {
          transport: false,
          accommodation: false,
          activities: false,
        },
      },
    }));
  };

  const toggleSaveTrip = (tripId) => {
    setState((prev) => {
      const exists = prev.savedTripIds.includes(tripId);
      return {
        ...prev,
        savedTripIds: exists
          ? prev.savedTripIds.filter((id) => id !== tripId)
          : [...prev.savedTripIds, tripId],
      };
    });
  };

  const generateLivePlan = async (customParams = {}) => {
    setState((prev) => ({ ...prev, isGeneratingAI: true }));
    try {
      const planParams = {
        budget: state.budget,
        destination: state.destination,
        travelers: state.travelers,
        duration: state.durationDays,
        interests: state.interests,
        travelStyle: state.travelStyle,
        ...customParams,
      };
      const result = await generateTripWithAI(planParams);
      if (result && result.breakdown) {
        setState((prev) => ({
          ...prev,
          aiCustomTrip: result,
          isGeneratingAI: false,
          activeTripId: result.id,
        }));
        return result;
      } else {
        // Fallback: resolve the best destination-matched itinerary
        const matchedTrip = matchTripByDestination(planParams.destination);
        setState((prev) => ({
          ...prev,
          aiCustomTrip: null,
          isGeneratingAI: false,
          activeTripId: matchedTrip,
        }));
      }
    } catch (err) {
      console.warn('AI Generation failed, falling back to local model:', err);
      const matchedTrip = matchTripByDestination(state.destination);
      setState((prev) => ({
        ...prev,
        aiCustomTrip: null,
        isGeneratingAI: false,
        activeTripId: matchedTrip,
      }));
    } finally {
      setState((prev) => ({ ...prev, isGeneratingAI: false }));
    }
    return null;
  };

  // Helper to get trip data factoring in user budget and applied optimizations
  const getTripCalculations = (tripId) => {
    let baseTrip;
    if (tripId === 'ai-generated-custom-trip' && state.aiCustomTrip) {
      baseTrip = state.aiCustomTrip;
    } else {
      baseTrip = MOCK_TRIPS[tripId] || MOCK_TRIPS['kandy-cultural-escape'];
    }
    const tripOpts = state.appliedOptimizations[baseTrip.id] || {
      transport: false,
      accommodation: false,
      activities: false,
    };

    const targetBudget = Number(state.budget) > 0 ? Number(state.budget) : 100000;
    const baseReferenceBudget = baseTrip.targetBudget || 100000;
    const scale = targetBudget / baseReferenceBudget;

    // Scaled initial cost based on user's target budget
    const initialCost = Math.round(baseTrip.estimatedCost * scale);

    // Scaled optimization choices
    const scaledOptions = (baseTrip.optimizationOptions || []).map((opt) => ({
      ...opt,
      savings: Math.round(opt.savings * scale),
      currentCost: Math.round(opt.currentCost * scale),
      optimizedCost: Math.round(opt.optimizedCost * scale),
    }));

    // Calculate total savings from applied options
    let totalSavings = 0;
    const scaledBreakdown = {
      transport: Math.round((baseTrip.breakdown?.transport || 0) * scale),
      accommodation: Math.round((baseTrip.breakdown?.accommodation || 0) * scale),
      food: Math.round((baseTrip.breakdown?.food || 0) * scale),
      activities: Math.round((baseTrip.breakdown?.activities || 0) * scale),
    };
    let adjustedBreakdown = { ...scaledBreakdown };

    scaledOptions.forEach((opt) => {
      if (tripOpts[opt.id]) {
        totalSavings += opt.savings;
        if (opt.categoryKey === 'transport' && adjustedBreakdown.transport) {
          adjustedBreakdown.transport = Math.max(0, adjustedBreakdown.transport - opt.savings);
        } else if (opt.categoryKey === 'accommodation' && adjustedBreakdown.accommodation) {
          adjustedBreakdown.accommodation = Math.max(0, adjustedBreakdown.accommodation - opt.savings);
        } else if (opt.categoryKey === 'activities' && adjustedBreakdown.activities) {
          adjustedBreakdown.activities = Math.max(0, adjustedBreakdown.activities - opt.savings);
        }
      }
    });

    const finalEstimatedCost = Math.max(0, initialCost - totalSavings);
    const hasAppliedSavings = totalSavings > 0;
    const status = calculateBudgetStatus(targetBudget, finalEstimatedCost, hasAppliedSavings);

    // Scale the day-by-day legs so the itinerary timeline displays accurate costs matching the budget
    const scaledDays = (baseTrip.days || []).map((day) => ({
      ...day,
      legs: (day.legs || []).map((leg) => ({
        ...leg,
        cost: Math.round((leg.cost || 0) * scale),
      })),
    }));

    // Dynamic rationale matching the user's budget
    const whyRecommended = status.fits
      ? `This trip fits your ${formatLKR(targetBudget)} budget with a comfortable ${formatLKR(status.difference)} buffer. By combining Sri Lanka Railways scenic transit with local boutique homestays, you enjoy authentic Sri Lankan travel while respecting your spending ceiling.`
      : `A bucket-list journey that currently sits at ${formatLKR(initialCost)} (${formatLKR(status.difference)} over your ${formatLKR(targetBudget)} target budget). With TripFit LK's 1-click optimization, it easily drops to ${formatLKR(Math.max(0, initialCost - (scaledOptions.reduce((s, o) => s + o.savings, 0))))} while keeping all prime attractions intact.`;

    return {
      ...baseTrip,
      targetBudget,
      initialCost,
      estimatedCost: finalEstimatedCost,
      totalSavings,
      appliedLevers: tripOpts,
      hasAppliedSavings,
      status,
      breakdown: adjustedBreakdown,
      optimizationOptions: scaledOptions,
      days: scaledDays,
      whyRecommended,
      isSaved: state.savedTripIds.includes(baseTrip.id),
    };
  };

  const value = {
    budget: state.budget,
    destination: state.destination,
    travelers: state.travelers,
    duration: state.duration,
    durationDays: state.durationDays,
    interests: state.interests,
    travelStyle: state.travelStyle,
    activeTripId: state.activeTripId,
    appliedOptimizations: state.appliedOptimizations,
    savedTripIds: state.savedTripIds,
    aiCustomTrip: state.aiCustomTrip,
    isGeneratingAI: state.isGeneratingAI,
    isGeminiConfigured: isGeminiConfigured(),
    generateLivePlan,
    setBudget,
    setTripDetails,
    setActiveTripId,
    toggleOptimization,
    applyAllOptimizations,
    resetOptimizations,
    toggleSaveTrip,
    getTripCalculations,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
