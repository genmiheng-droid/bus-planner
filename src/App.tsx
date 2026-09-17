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

import {
  INITIAL_BUS_STOPS,
  POPULAR_BUS_SERVICES,
  TRANSIT_ALERTS,
  GUIDE_ARTICLES,
  FAQ_ITEMS,
} from './data/transitData';
import { BusStop, BusServiceDetail, GuideArticle } from './types';

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
  const [plannedRouteResult, setPlannedRouteResult] = useState<{
    title: string;
    duration: string;
    steps: string[];
  } | null>(null);

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

  const handlePlanCommute = (_origin: string, destination: string, preference: string) => {
    // Generate realistic Singapore route steps
    let steps = [
      'Board MRT Downtown Line from Bayfront Stn (DT16) towards Expo',
      'Alight at Promenade Stn (DT15), transfer to Bus 36 at Stop 02161',
      'Take Bus 36 express via ECP highway directly to Changi Airport PTB 1/2/3',
    ];

    if (preference === 'Direct Bus Only') {
      steps = [
        'Walk 2 mins to Stop 03511 (Bayfront Stn Exit B)',
        'Board direct Bus 36 towards Tomlinson Rd (Loop via East Coast)',
        'Arrive at destination without train transfers',
      ];
    } else if (preference === 'Fewer Transfers') {
      steps = [
        'Board East West Line towards Pasir Ris',
        'Direct connection to Changi Airport branch line at Tanah Merah',
      ];
    }

    setPlannedRouteResult({
      title: `Optimal Route to ${destination.split(',')[0]}`,
      duration: '38 mins',
      steps,
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
      {/* Main Header */}
      <Header
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      <main className="flex-grow">
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
      </main>

      {/* Main Footer */}
      <Footer
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onSelectGuide={() => setSelectedGuide(GUIDE_ARTICLES[0])}
        onScrollToTop={handleScrollToTop}
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
