import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_TRIPS, calculateBudgetStatus, formatLKR } from '../data/mockData';
import { generateTripWithAI, isGeminiConfigured } from '../services/geminiService';
import { buildTripForDestination } from '../services/tripBuilder.js';

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
  customBuiltTrips: {},
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

  const setBudget = (budget) => {
    const num = Math.max(1000, Number(budget) || 0);
    // Clear old AI custom trip when budget changes
    setState((prev) => ({ ...prev, budget: num, aiCustomTrip: null }));
  };

  const setTripDetails = (details) => {
    setState((prev) => {
      // Clear old AI custom trip when destination or budget changes
      const shouldClearAi =
        (details.destination !== undefined && details.destination !== prev.destination) ||
        (details.budget !== undefined && details.budget !== prev.budget);

      return {
        ...prev,
        ...details,
        aiCustomTrip: shouldClearAi ? null : prev.aiCustomTrip,
        activeTripId: details.activeTripId || prev.activeTripId,
      };
    });
  };

  const registerBuiltTrip = (trip) => {
    if (!trip || !trip.id) return;
    setState((prev) => ({
      ...prev,
      customBuiltTrips: {
        ...(prev.customBuiltTrips || {}),
        [trip.id]: trip,
      },
    }));
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
      }
    } catch (err) {
      console.warn('AI Generation failed, falling back to local model:', err);
    } finally {
      setState((prev) => ({ ...prev, isGeneratingAI: false }));
    }
    return null;
  };

  // Helper to get trip data factoring in user budget and applied optimizations
  // Real component numbers - NO FAKE SCALING by budget!
  // Unknown ids return null and callers must handle it.
  const getTripCalculations = (tripId) => {
    if (!tripId) return null;

    let baseTrip = null;

    if (tripId === 'ai-generated-custom-trip' && state.aiCustomTrip) {
      baseTrip = state.aiCustomTrip;
    } else if (state.customBuiltTrips && state.customBuiltTrips[tripId]) {
      baseTrip = state.customBuiltTrips[tripId];
    } else if (MOCK_TRIPS[tripId]) {
      baseTrip = MOCK_TRIPS[tripId];
    } else {
      // Attempt to build trip on-the-fly from tripId / destination
      const candidate = buildTripForDestination({
        destination: tripId,
        budget: state.budget,
        travelers: state.travelers,
        durationDays: state.durationDays,
        interests: state.interests,
        travelStyle: state.travelStyle,
      });
      if (candidate && !candidate.notFound) {
        baseTrip = candidate;
      }
    }

    // Unknown id returns null
    if (!baseTrip) {
      return null;
    }

    const tripOpts = state.appliedOptimizations[baseTrip.id] || {
      transport: false,
      accommodation: false,
      activities: false,
    };

    const targetBudget = Number(state.budget) > 0 ? Number(state.budget) : 100000;
    const initialCost = baseTrip.initialCost || baseTrip.estimatedCost || 0;

    // Calculate total savings from applied options (exact component figures, no scaling)
    let totalSavings = 0;
    const baseBreakdown = baseTrip.breakdown || {
      transport: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
    };
    let adjustedBreakdown = { ...baseBreakdown };

    (baseTrip.optimizationOptions || []).forEach((opt) => {
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
      days: baseTrip.days || [],
      isSaved: (state.savedTripIds || []).includes(baseTrip.id),
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
    customBuiltTrips: state.customBuiltTrips,
    registerBuiltTrip,
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
