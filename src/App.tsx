/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { TransitMap } from './components/TransitMap';
import { ArrivalsPanel } from './components/ArrivalsPanel';
import { ValueProposition } from './components/ValueProposition';
import { FeaturesGrid } from './components/FeaturesGrid';
import { PwaBanner } from './components/PwaBanner';
import { PopularBusServices } from './components/PopularBusServices';
import { GuidesSection } from './components/GuidesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { RouteModal } from './components/RouteModal';
import { GuideModal } from './components/GuideModal';
import { AlertsModal } from './components/AlertsModal';
import { InstallModal } from './components/InstallModal';
import { BookmarksModal } from './components/BookmarksModal';
import { TalkToUs } from './components/TalkToUs';

import {
  INITIAL_BUS_STOPS,
  POPULAR_BUS_SERVICES,
  TRANSIT_ALERTS,
  GUIDE_ARTICLES,
  FAQ_ITEMS,
  resolveSingaporeCoords,
} from './data/transitData';
import { BusStop, BusServiceDetail, GuideArticle, PlannedRoute } from './types';

export default function App() {
  const [stops] = useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [selectedStop, setSelectedStop] = useState<BusStop>(INITIAL_BUS_STOPS[0]);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smartcommute_bookmarks');
      return saved ? JSON.parse(saved) : ['bayfront-03511'];
    } catch {
      return ['bayfront-03511'];
    }
  });

  // Modal States
  const [selectedBusService, setSelectedBusService] = useState<BusServiceDetail | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Commute Planner calculation state
  const [plannedRouteResult, setPlannedRouteResult] = useState<PlannedRoute | null>(null);

  // Active Navigation Tab ('home' | 'talk-to-us')
  const [activeTab, setActiveTab] = useState<'home' | 'talk-to-us'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#talk-to-us') {
      return 'talk-to-us';
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#talk-to-us') {
        setActiveTab('talk-to-us');
      } else if (window.location.hash === '' || window.location.hash === '#home') {
        setActiveTab('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: 'home' | 'talk-to-us') => {
    setActiveTab(tab);
    try {
      if (tab === 'talk-to-us') {
        window.location.hash = '#talk-to-us';
      } else {
        if (window.location.hash === '#talk-to-us') {
          if (typeof window.history?.pushState === 'function') {
            window.history.pushState('', document.title, window.location.pathname + window.location.search);
          } else {
            window.location.hash = '';
          }
        }
      }
    } catch {
      // Ignore pushState restrictions in restricted iframes
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('smartcommute_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  const handleToggleBookmark = (stopId: string) => {
    setBookmarks((prev) =>
      prev.includes(stopId) ? prev.filter((id) => id !== stopId) : [...prev, stopId]
    );
  };

  const handleLocateNearest = () => {
    // Select the closest stop (Bayfront)
    setSelectedStop(INITIAL_BUS_STOPS[0]);
    document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanCommute = (origin: string, destination: string, preference: string) => {
    // Sanitize and extract readable labels from user input
    const rawOrigin = origin.replace(/^📍\s*(Current Location:?\s*)?/i, '').trim();
    const cleanOrigin = rawOrigin || 'Current Location';
    const cleanDest = destination.trim() || 'Destination';

    const originShort = cleanOrigin.split(',')[0].trim();
    const destShort = cleanDest.split(',')[0].trim();

    // Resolve geographic coordinates for both Origin and Destination across Singapore
    const originLocation = resolveSingaporeCoords(cleanOrigin, { x: 490, y: 435 });
    const destLocation = resolveSingaporeCoords(cleanDest, { x: 830, y: 370 });

    // Match keyed-in addresses with any known Singapore transit hubs
    const findMatchingStop = (query: string) => {
      const q = query.toLowerCase();
      return INITIAL_BUS_STOPS.find(
        (s) =>
          q.includes(s.code) ||
          q.includes(s.name.toLowerCase()) ||
          q.includes(s.road.toLowerCase()) ||
          s.name.toLowerCase().includes(q) ||
          s.road.toLowerCase().includes(q)
      );
    };

    const originStop = findMatchingStop(cleanOrigin);
    const destStop = findMatchingStop(cleanDest);

    // Update telemetry: switch selected stop to commuter's departure stop immediately
    if (originStop) {
      setSelectedStop(originStop);
    } else {
      // Create a dynamic departure stop representing commuter's current address
      const dynamicOriginStop: BusStop = {
        id: `origin-${originLocation.stopCode || '09022'}`,
        code: originLocation.stopCode || '09022',
        name: `${originShort} (Departure)`,
        road: cleanOrigin.length > 30 ? cleanOrigin.slice(0, 30) + '...' : cleanOrigin,
        badgeText: 'Current Address',
        coordinates: { x: originLocation.x, y: originLocation.y },
        services: [
          {
            service: '65',
            badgeBg: 'bg-brand-600',
            destination: `To ${destShort}`,
            deckType: 'Double Decker',
            wheelchair: true,
            estMinutes: 2,
            nextTimes: ['9m', '18m'],
            crowding: 'Seats Available',
            status: 'Predicted (LTA)',
          },
          {
            service: '36',
            badgeBg: 'bg-sgTransit-dt',
            destination: 'Trunk Express',
            deckType: 'Double Decker',
            wheelchair: true,
            estMinutes: 5,
            nextTimes: ['14m', '26m'],
            crowding: 'Standing Available',
            status: 'Recalculated',
          },
          {
            service: '14',
            badgeBg: 'bg-emerald-700',
            destination: 'Connecting Line',
            deckType: 'Single Deck',
            wheelchair: true,
            estMinutes: 11,
            nextTimes: ['24m'],
            crowding: 'Seats Available',
            status: 'On Schedule',
          },
        ],
      };
      setSelectedStop(dynamicOriginStop);
    }

    const originBoarding = originStop
      ? `${originStop.name} (Stop ${originStop.code})`
      : `${originShort} (Nearest stop ${originLocation.stopCode || '09022'})`;

    const destAlighting = destStop
      ? `${destStop.name} (Stop ${destStop.code})`
      : `${destShort}`;

    const busService = originStop?.services[0]?.service || '65';

    let steps: string[] = [];
    let duration = '32 mins';

    if (preference === 'Direct Bus Only') {
      steps = [
        `Walk 3 mins from ${originShort} to boarding stop at ${originBoarding}`,
        `Board direct Bus ${busService} towards ${destAlighting}`,
        `Alight directly at ${destAlighting} without train transfers`,
      ];
      duration = '42 mins';
    } else if (preference === 'Fewer Transfers') {
      steps = [
        `Depart ${originShort}: Walk 2 mins to ${originBoarding}`,
        `Board cross-corridor transit trunk towards ${destShort}`,
        `Direct arrival at ${destAlighting} with 0-1 seamless transfer`,
      ];
      duration = '36 mins';
    } else {
      // Fastest (MRT + Bus)
      steps = [
        `Depart ${originShort}: Board feeder bus or walk to ${originBoarding}`,
        `Take rapid transit trunk connection directly towards ${destShort}`,
        `Arrive at ${destAlighting} with minimal wait time`,
      ];
      duration = '27 mins';
    }

    setPlannedRouteResult({
      title: `${originShort} ➔ ${destShort}`,
      duration,
      steps,
      originName: originShort,
      destName: destShort,
      originCoords: { x: originLocation.x, y: originLocation.y },
      destCoords: { x: destLocation.x, y: destLocation.y },
    });
  };

  const handleOpenBusService = (serviceNumber: string) => {
    const cleanNum = serviceNumber.replace(/[^0-9a-zA-Z]/g, '');
    const found = POPULAR_BUS_SERVICES.find((s) => s.service.includes(cleanNum));
    if (found) {
      setSelectedBusService(found);
    } else {
      // Fallback detail
      setSelectedBusService({
        service: `Bus ${serviceNumber}`,
        origin: 'Central Singapore Hub',
        destination: 'Suburban Interchange',
        operatingHours: {
          weekdays: '05:30 - 23:45',
          saturdays: '05:30 - 23:45',
          sundays: '05:45 - 23:45',
        },
        frequency: '8 - 14 mins',
        stopsCount: 52,
        popularStops: [
          'Central Interchange',
          selectedStop.name,
          'Orchard Boulevard',
          'City Hall Stn',
          'Heartland Bus Terminal',
        ],
      });
    }
  };

  const handleViewStopFromRoute = (stopName: string) => {
    const matched = stops.find(
      (s) => s.name.toLowerCase().includes(stopName.toLowerCase()) || stopName.includes(s.name)
    );
    if (matched) {
      setSelectedStop(matched);
      document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-night-950 text-slate-200 antialiased flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Main Header with Tab Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      <main className="flex-grow">
        {activeTab === 'talk-to-us' ? (
          <TalkToUs onBackToHome={() => handleSelectTab('home')} />
        ) : (
          <>
            {/* Hero Section with Modes */}
            <HeroSearch
              busStops={stops}
              onSelectStop={(stop) => setSelectedStop(stop)}
              onLocateNearest={handleLocateNearest}
              onPlanCommute={handlePlanCommute}
              plannedRouteResult={plannedRouteResult}
            />

            {/* Live Map and Arrivals Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="transit-map">
              <div className="bg-night-900 border border-night-700/80 rounded-2xl overflow-hidden shadow-2xl">
                {/* Map Top Utility Header (Matching Screenshot style) */}
                <div className="px-4 py-3 bg-night-950/70 border-b border-night-700/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-medium text-slate-200">
                      Tap <strong className="text-white">Locate Nearest Stop</strong> or click any marker on the map to view live arrival times.
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sgTransit-dt" /> Downtown Line
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sgTransit-ew" /> East West
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sgTransit-ns" /> North South
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sgTransit-te" /> TEL
                    </span>
                  </div>
                </div>

                {/* Grid Container for Map & Live Arrivals */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    <TransitMap
                      stops={stops}
                      selectedStop={selectedStop}
                      onSelectStop={(stop) => setSelectedStop(stop)}
                      plannedRoute={plannedRouteResult}
                      showPlannedRoute={!!plannedRouteResult}
                    />
                  </div>
                  <ArrivalsPanel
                    selectedStop={selectedStop}
                    onSelectBusService={handleOpenBusService}
                    isBookmarked={bookmarks.includes(selectedStop.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </div>
              </div>
            </section>

            {/* Value Proposition Section */}
            <ValueProposition />

            {/* Features Grid Section */}
            <FeaturesGrid
              onLocateNearest={handleLocateNearest}
              onOpenRouteLookup={() => handleOpenBusService('36')}
              onOpenBookmarks={() => setIsBookmarksOpen(true)}
              onOpenAlerts={() => setIsAlertsOpen(true)}
            />

            {/* PWA Install Banner */}
            <PwaBanner onOpenInstall={() => setIsInstallOpen(true)} />

            {/* Popular Bus Services */}
            <PopularBusServices
              services={POPULAR_BUS_SERVICES}
              onSelectService={handleOpenBusService}
            />

            {/* Guides for Singapore Commuters */}
            <GuidesSection
              guides={GUIDE_ARTICLES}
              onSelectGuide={(guide) => setSelectedGuide(guide)}
            />

            {/* Frequently Asked Questions */}
            <FaqSection faqs={FAQ_ITEMS} />
          </>
        )}
      </main>

      {/* Main Footer */}
      <Footer
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onSelectGuide={() => setSelectedGuide(GUIDE_ARTICLES[0])}
        onScrollToTop={handleScrollToTop}
        onSelectTalkToUs={() => handleSelectTab('talk-to-us')}
      />

      {/* Interactive Modals */}
      <RouteModal
        service={selectedBusService}
        onClose={() => setSelectedBusService(null)}
        onViewStop={handleViewStopFromRoute}
      />

      <GuideModal
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
      />

      <AlertsModal
        alerts={TRANSIT_ALERTS}
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        allStops={stops}
        onSelectStop={(stop) => setSelectedStop(stop)}
        onRemoveBookmark={handleToggleBookmark}
      />
    </div>
  );
}
