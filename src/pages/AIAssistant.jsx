import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AI_FAQ_RESPONSES,
  formatLKR,
} from '../data/mockData';
import { usePlan } from '../context/PlanContext';
import { chatWithGemini, isGeminiConfigured } from '../services/geminiService';
import ellaImg from '../assets/images/ella-bridge.png';
import kandyImg from '../assets/images/kandy-lake.png';
import galleImg from '../assets/images/galle-coast.png';

const tripImageMap = {
  'ella-adventure': ellaImg,
  'kandy-cultural-escape': kandyImg,
  'galle-coast': galleImg,
};

export default function AIAssistant() {
  const {
    budget: userBudget,
    activeTripId,
    getTripCalculations,
    setActiveTripId,
  } = usePlan();

  const [selectedTripKey, setSelectedTripKey] = useState(activeTripId || 'ella-adventure');
  const activeTrip = getTripCalculations(selectedTripKey);

  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Ayubowan! I'm your TripFit LK AI travel assistant. I have loaded your current route for ${activeTrip.title} with a budget of ${formatLKR(activeTrip.targetBudget)}. I can help you adjust transit legs, compare train vs. private cab costs, or bring your trip safely within your spending limit.`,
      time: 'Just now',
      type: 'greeting',
    },
    {
      id: 2,
      sender: 'user',
      text: `How can I optimize my ${activeTrip.title} to fit my ${formatLKR(activeTrip.targetBudget)} budget?`,
      time: 'Just now',
    },
    {
      id: 3,
      sender: 'ai',
      time: 'Just now',
      type: 'optimization-breakdown',
    },
  ]);

  const chatEndRef = useRef(null);

  const quickPrompts = [
    'How can I reduce the cost?',
    'Can I use the train instead?',
    'Can I find cheaper accommodation?',
    'Can I reduce this trip to 3 days?',
  ];

  const handleTripChange = (key) => {
    setSelectedTripKey(key);
    setActiveTripId(key);
    const newTrip = getTripCalculations(key);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'ai',
        text: `Switched active context to ${newTrip.title}. Target budget is ${formatLKR(newTrip.targetBudget)} and current estimated cost is ${formatLKR(newTrip.estimatedCost)} (${newTrip.status.statusText}). How would you like to refine this trip?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isAiTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsAiTyping(true);

    try {
      if (isGeminiConfigured()) {
        const geminiReply = await chatWithGemini(updatedMessages, {
          budget: activeTrip.targetBudget,
          tripTitle: activeTrip.title,
          destination: activeTrip.destination,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: geminiReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // High-fidelity local fallback with Sri Lankan travel tariffs
        setTimeout(() => {
          let responseText = AI_FAQ_RESPONSES.default;
          const lower = text.toLowerCase();
          if (lower.includes('cost') || lower.includes('reduce') || lower.includes('budget') || lower.includes('cheaper')) {
            responseText = `For your ${activeTrip.title} (target budget: ${formatLKR(activeTrip.targetBudget)}): ${AI_FAQ_RESPONSES.cost}`;
          } else if (lower.includes('train') || lower.includes('rail') || lower.includes('transit') || lower.includes('transport')) {
            responseText = `On the ${activeTrip.destination} route: ${AI_FAQ_RESPONSES.train}`;
          } else if (lower.includes('accommodation') || lower.includes('hotel') || lower.includes('stay') || lower.includes('homestay')) {
            responseText = `For stays in ${activeTrip.destination}: ${AI_FAQ_RESPONSES.accommodation}`;
          } else if (lower.includes('day') || lower.includes('duration') || lower.includes('shorten') || lower.includes('3 days')) {
            responseText = AI_FAQ_RESPONSES.days;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: responseText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 380);
      }
    } catch (err) {
      console.warn('Chat assistant run notice:', err);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Ayubowan! Session reset for ${activeTrip.title} (Budget: ${formatLKR(activeTrip.targetBudget)}). How can I assist you with your route, transit, or budget optimization?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const cardImage = tripImageMap[selectedTripKey] || ellaImg;

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-4rem)]">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-margin pt-space-lg pb-space-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Travel AI Assistant
            </span>
            <span className="text-outline-variant text-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-secondary tracking-wider font-mono">
              Budget-First Travel AI
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs pt-space-xs">
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Ask TripFit LK AI
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Get help with your trip, budget, transport, accommodation, and activities.
            </p>
          </div>
        </div>
      </section>

      {/* Two-Column Desktop Workspace */}
      <section className="max-w-7xl mx-auto w-full px-margin-mobile md:px-margin py-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column / Active Trip Context Panel */}
          <aside className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Main Context Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md relative overflow-hidden border border-outline-variant/30">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
              {/* Card Header */}
              <div className="flex items-start justify-between gap-space-xs pt-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                    Current Itinerary
                  </span>
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">
                    {activeTrip.title}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      calendar_today
                    </span>
                    {activeTrip.durationDays} Days • {activeTrip.travelers} Travelers
                  </p>
                </div>
                <select
                  value={selectedTripKey}
                  onChange={(e) => handleTripChange(e.target.value)}
                  className="text-primary font-label-md text-label-md px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors outline-none cursor-pointer border border-outline-variant/30 font-semibold"
                >
                  <option value="kandy-cultural-escape">Kandy Cultural</option>
                  <option value="ella-adventure">Ella Adventure</option>
                  <option value="galle-coast">Galle Coast</option>
                </select>
              </div>

              {/* Target budget & current estimated cost summary */}
              <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-space-xs border border-outline-variant/20">
                <div className="flex justify-between items-baseline">
                  <span className="font-label-md text-label-md text-secondary">Target Budget</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {formatLKR(activeTrip.targetBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="font-label-md text-label-md text-secondary">Current Estimated Cost</span>
                  <span
                    className={`font-headline-sm text-headline-sm font-bold ${
                      activeTrip.status.fits ? 'text-primary' : 'text-amber-800'
                    }`}
                  >
                    {formatLKR(activeTrip.estimatedCost)}
                  </span>
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-label-sm text-label-sm font-semibold ${activeTrip.status.statusBadgeClass}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {activeTrip.status.fits ? 'verified' : 'warning'}
                  </span>
                  <span>
                    {activeTrip.status.fits
                      ? `Within budget by ${formatLKR(activeTrip.status.difference)}`
                      : `${formatLKR(activeTrip.status.difference)} over target budget`}
                  </span>
                </div>
              </div>

              {/* Cost Breakdown Rows */}
              {activeTrip.breakdown && (
                <div className="flex flex-col gap-2 text-body-sm">
                  <div className="flex justify-between items-center pb-1 border-b border-outline-variant/20">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Category Breakdown
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">
                      Estimated
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                      <span className="text-on-surface font-medium">Transport</span>
                    </div>
                    <span className="font-mono text-on-surface font-semibold">
                      {formatLKR(activeTrip.breakdown.transport)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-on-surface font-medium">Accommodation</span>
                    </div>
                    <span className="font-mono text-on-surface font-semibold">
                      {formatLKR(activeTrip.breakdown.accommodation)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                      <span className="text-on-surface font-medium">Food &amp; Dining</span>
                    </div>
                    <span className="font-mono text-on-surface font-semibold">
                      {formatLKR(activeTrip.breakdown.food)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-on-surface font-medium">Activities</span>
                    </div>
                    <span className="font-mono text-on-surface font-semibold">
                      {formatLKR(activeTrip.breakdown.activities)}
                    </span>
                  </div>
                </div>
              )}

              {/* Geographic Image Card */}
              <div className="rounded-lg overflow-hidden relative h-28 bg-surface-container flex flex-col justify-end p-2.5 border border-outline-variant/30">
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={activeTrip.title}
                  src={cardImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                <div className="relative z-10 flex items-center justify-between text-on-primary">
                  <span className="font-label-md text-label-md font-semibold">
                    {activeTrip.destination}
                  </span>
                  <Link
                    to={`/trip/${activeTrip.id}`}
                    className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-lowest/30 hover:bg-surface-container-lowest/50 backdrop-blur-sm text-white transition-colors"
                  >
                    View Plan →
                  </Link>
                </div>
              </div>

              {/* Direct Actions in context sidebar */}
              <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
                <Link
                  to={`/trip/${activeTrip.id}/optimize`}
                  className="flex-1 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Optimize Budget</span>
                </Link>
                <Link
                  to={`/trip/${activeTrip.id}`}
                  className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>Itinerary</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Column / AI Chat Workspace */}
          <main className="lg:col-span-8 flex flex-col gap-space-md">
            {/* Chat Container Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col min-h-[640px] overflow-hidden border border-outline-variant/30">
              {/* Header */}
              <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between gap-space-sm border-b border-outline-variant/20">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                        TripFit LK Assistant
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {isGeminiConfigured() ? 'Gemini 1.5 Flash Live' : 'Online'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      Active: <span className="font-medium text-on-surface">{activeTrip.title}</span> (Target: {formatLKR(activeTrip.targetBudget)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs shrink-0">
                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                    title="Reset Session Context"
                  >
                    <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Chat Conversation Stream */}
              <div className="flex-1 p-space-md flex flex-col gap-space-md overflow-y-auto max-h-[600px] bg-surface-bright">
                {messages.map((msg) => {
                  if (msg.sender === 'user') {
                    return (
                      <div
                        key={msg.id}
                        className="flex items-start justify-end gap-space-sm self-end max-w-xl"
                      >
                        <div className="flex flex-col items-end gap-1">
                          <div className="bg-primary-container text-on-primary rounded-xl rounded-tr-sm p-space-md shadow-sm">
                            <p className="font-body-md text-body-md leading-relaxed">
                              {msg.text}
                            </p>
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary pr-2">
                            {msg.time}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 mt-1">
                          <span className="material-symbols-outlined text-[18px]">person</span>
                        </div>
                      </div>
                    );
                  }

                  // Rich heuristic breakdown
                  if (msg.type === 'optimization-breakdown') {
                    return (
                      <div key={msg.id} className="flex items-start gap-space-sm max-w-3xl">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                        </div>
                        <div className="flex flex-col gap-space-xs w-full">
                          <div className="bg-surface-container-lowest rounded-xl rounded-tl-sm p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
                            <div className="font-body-md text-body-md text-on-surface space-y-2">
                              <p>
                                For <strong className="text-primary">{activeTrip.title}</strong>, your estimated trip cost is{' '}
                                <span className="font-bold text-amber-800">{formatLKR(activeTrip.estimatedCost)}</span> against your{' '}
                                <span className="font-bold text-primary">{formatLKR(activeTrip.targetBudget)}</span> target budget.
                                {activeTrip.estimatedCost > activeTrip.targetBudget
                                  ? ` To save the required ${formatLKR(activeTrip.estimatedCost - activeTrip.targetBudget)}, here are three high-yield adjustments:`
                                  : ` This plan currently fits inside your budget, but you can save even more with these three adjustments:`}
                              </p>
                            </div>

                            {/* 3 Structured Optimization Levers */}
                            <div className="grid grid-cols-1 gap-space-sm">
                              {/* Lever 1 */}
                              <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:bg-surface-container transition-colors border border-outline-variant/10">
                                <div className="flex items-start gap-space-xs min-w-0">
                                  <div className="w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">
                                      train
                                    </span>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-label-lg text-label-lg text-primary font-bold">
                                        Lever 1: Scenic Rail Substitution
                                      </span>
                                      <span className="font-label-sm text-[11px] px-2 py-0.2 rounded-full bg-primary-container text-on-primary">
                                        High Efficiency
                                      </span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                      Replace highway taxi legs with Sri Lanka Railways scenic 2nd Class coaches + local tuk-tuks for last mile.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex sm:flex-col items-baseline sm:items-end justify-between shrink-0 pl-9 sm:pl-0">
                                  <span className="font-label-sm text-label-sm text-secondary">
                                    Est. Saving
                                  </span>
                                  <span className="font-headline-sm text-headline-sm text-primary font-bold font-mono">
                                    ~{formatLKR(activeTrip.optimizationOptions?.[0]?.savings || Math.round(5000 * ((activeTrip.targetBudget || 100000) / 100000)))}
                                  </span>
                                </div>
                              </div>

                              {/* Lever 2 */}
                              <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:bg-surface-container transition-colors border border-outline-variant/10">
                                <div className="flex items-start gap-space-xs min-w-0">
                                  <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">
                                      hotel
                                    </span>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-label-lg text-label-lg text-primary font-bold">
                                        Lever 2: Verified Family Homestay
                                      </span>
                                      <span className="font-label-sm text-[11px] px-2 py-0.2 rounded-full bg-tertiary-container text-on-tertiary">
                                        Recommended
                                      </span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                      Switch from resort lodging to top-rated family-run homestays with scenic views and home breakfast included.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex sm:flex-col items-baseline sm:items-end justify-between shrink-0 pl-9 sm:pl-0">
                                  <span className="font-label-sm text-label-sm text-secondary">
                                    Est. Saving
                                  </span>
                                  <span className="font-headline-sm text-headline-sm text-primary font-bold font-mono">
                                    ~{formatLKR(activeTrip.optimizationOptions?.[1]?.savings || Math.round(7000 * ((activeTrip.targetBudget || 100000) / 100000)))}
                                  </span>
                                </div>
                              </div>

                              {/* Lever 3 */}
                              <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:bg-surface-container transition-colors border border-outline-variant/10">
                                <div className="flex items-start gap-space-xs min-w-0">
                                  <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">
                                      hiking
                                    </span>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-label-lg text-label-lg text-primary font-bold">
                                        Lever 3: Self-Guided Trail Access
                                      </span>
                                      <span className="font-label-sm text-[11px] px-2 py-0.2 rounded-full bg-surface-container-high text-on-surface-variant">
                                        Zero Cost
                                      </span>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                      Substitute expensive agency tours with open community nature trails and local street food stalls.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex sm:flex-col items-baseline sm:items-end justify-between shrink-0 pl-9 sm:pl-0">
                                  <span className="font-label-sm text-label-sm text-secondary">
                                    Est. Saving
                                  </span>
                                  <span className="font-headline-sm text-headline-sm text-primary font-bold font-mono">
                                    ~{formatLKR(activeTrip.optimizationOptions?.[2]?.savings || Math.round(3000 * ((activeTrip.targetBudget || 100000) / 100000)))}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Action Triggers inside AI card */}
                            <div className="flex flex-wrap items-center gap-space-xs pt-1">
                              <Link
                                to={`/trip/${activeTrip.id}/optimize`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary transition-colors shadow-sm active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[18px]">bolt</span>
                                <span>Optimize This Trip</span>
                              </Link>
                              <Link
                                to={`/trip/${activeTrip.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-primary font-label-lg text-label-lg font-semibold hover:bg-surface-container-high transition-colors shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[18px]">tune</span>
                                <span>View Itinerary</span>
                              </Link>
                            </div>
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary pl-2">
                            {msg.time} • TripFit LK Assistant
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Default text AI message
                  return (
                    <div key={msg.id} className="flex items-start gap-space-sm max-w-2xl">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">spark</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="bg-surface-container-lowest rounded-xl rounded-tl-sm p-space-md shadow-sm text-on-surface border border-outline-variant/30">
                          <p className="font-body-md text-body-md leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                        <span className="font-label-sm text-label-sm text-secondary pl-2">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isAiTyping && (
                  <div className="flex items-start gap-space-sm max-w-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl rounded-tl-sm p-3 shadow-sm text-on-surface border border-outline-variant/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-primary-container animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-on-surface-variant font-label-sm ml-2">
                        {isGeminiConfigured() ? 'Google Gemini AI is analyzing...' : 'TripFit LK Assistant is thinking...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Chips Bar */}
              <div className="px-space-md py-space-xs bg-surface-container-low/60 border-t border-outline-variant/20 flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left px-3 py-1 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-all border border-outline-variant/30 shadow-xs cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="p-space-md bg-surface-container-lowest border-t border-outline-variant/30 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about train routes, homestays, or daily cost curves..."
                  className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl py-3 px-4 text-on-surface placeholder:text-secondary font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="px-5 py-3 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>

            {/* AI Domain Coverage Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1">
                  payments
                </span>
                <h4 className="font-label-md text-label-md font-bold text-on-surface">
                  Budget Planning
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-0.5">
                  Allocates funds across stay, train, and activities without overrun.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1">
                  train
                </span>
                <h4 className="font-label-md text-label-md font-bold text-on-surface">
                  Transport Logistics
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-0.5">
                  Main Line rail timetables, 2nd class coaches, and bus transfers.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1">
                  bed
                </span>
                <h4 className="font-label-md text-label-md font-bold text-on-surface">
                  Local Stays
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-0.5">
                  Family-run guesthouses with verified ratings and home breakfast.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] mb-1">
                  tune
                </span>
                <h4 className="font-label-md text-label-md font-bold text-on-surface">
                  Itinerary Solver
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-0.5">
                  Instant trade-offs to bring any over-budget plan within limit.
                </p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
