import React, { useState } from 'react';
import { Search, Compass, Navigation, MapPin, ArrowRight, Loader2, Check } from 'lucide-react';
import { BusStop } from '../types';

interface HeroSearchProps {
  busStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onLocateNearest: () => void;
  onPlanCommute: (origin: string, destination: string, preference: string) => void;
  plannedRouteResult: {
    title: string;
    duration: string;
    steps: string[];
  } | null;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  busStops,
  onSelectStop,
  onLocateNearest,
  onPlanCommute,
  plannedRouteResult,
}) => {
  const [activeTab, setActiveTab] = useState<'quick-stop' | 'smart-commute'>('quick-stop');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locateStatus, setLocateStatus] = useState<string | null>(null);

  // Commute Planner State
  const [origin, setOrigin] = useState('10 Bayfront Ave, Marina Bay Sands (018956)');
  const [destination, setDestination] = useState('Jewel Changi Airport, 78 Airport Blvd');
  const [preference, setPreference] = useState('Fastest (MRT + Bus)');
  const [departTime, setDepartTime] = useState('Depart Now');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Filtered stops for search suggestions
  const searchResults = searchTerm.trim()
    ? busStops.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.code.includes(searchTerm.trim()) ||
          s.road.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      onSelectStop(searchResults[0]);
      setSearchTerm('');
      document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
    } else if (searchTerm.trim()) {
      // Find nearest matching stop or select first stop
      onSelectStop(busStops[0]);
      document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocateClick = () => {
    setIsLocating(true);
    setLocateStatus('Locating 5 closest stops...');

    // Simulate geolocation or query GPS
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setIsLocating(false);
            setLocateStatus('✓ Pinned: Bayfront Stn (03511) - 45m away');
            onLocateNearest();
            document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        },
        () => {
          // Fallback simulation
          setTimeout(() => {
            setIsLocating(false);
            setLocateStatus('✓ Pinned: Bayfront Stn (03511) - 45m away');
            onLocateNearest();
            document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setLocateStatus('✓ Pinned: Bayfront Stn (03511) - 45m away');
        onLocateNearest();
        document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }
  };

  const handleUseGpsOrigin = () => {
    setOrigin('Locating via GPS...');
    setTimeout(() => {
      setOrigin('📍 Current Location: Marina Bay Sands (03511)');
    }, 500);
  };

  const handleCalculateCommute = () => {
    setIsCalculatingRoute(true);
    setTimeout(() => {
      setIsCalculatingRoute(false);
      onPlanCommute(origin, destination, preference);
      document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
    }, 850);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden" data-purpose="hero-search-area">
      {/* Ambient Glow and Backdrop Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-brand-600/20 via-sky-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-44 left-1/3 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Luminous Pin Icon */}
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-14 h-14 rounded-full bg-cyan-500/20 animate-glow-ring" />
            <div className="w-12 h-12 rounded-full bg-night-850 border border-cyan-500/40 shadow-inner flex items-center justify-center text-cyan-400">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Title & Subtitle Matching Screenshot */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
          Find Nearest Bus Stop <span className="text-brand-400">&amp; Route Planner</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal mb-8">
          Discover the closest bus stops to your location, or calculate intelligent point-to-point Singapore transit routes.
        </p>

        {/* Commuter Hub Box Container */}
        <div className="bg-night-900/90 border border-night-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-left transition duration-200">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-night-700/70 pb-4 mb-5">
            <button
              type="button"
              onClick={() => setActiveTab('quick-stop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'quick-stop'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-night-800'
              }`}
            >
              <span>🚏</span>
              <span>Find Bus Stop</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('smart-commute')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'smart-commute'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-night-800'
              }`}
            >
              <span>🧭</span>
              <span>Plan Commute (A to B)</span>
              <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">
                New
              </span>
            </button>
          </div>

          {/* PANEL 1: Standard Quick Bus Stop Search (From Screenshot) */}
          {activeTab === 'quick-stop' && (
            <div className="space-y-4">
              <form onSubmit={handleSearchSubmit}>
                <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2" htmlFor="stop-search-input">
                  Search Bus Stop by Name
                </label>
                <div className="flex flex-col sm:flex-row gap-3 relative">
                  <div className="relative flex-grow">
                    <input
                      id="stop-search-input"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., Marina Bay, Bedok, 03211, Orchard Blvd..."
                      className="w-full h-12 bg-night-950/80 border border-night-700 rounded-lg px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                    {/* Autocomplete dropdown if typing */}
                    {searchTerm.trim().length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-night-900 border border-night-700 rounded-lg shadow-2xl z-30 max-h-60 overflow-y-auto">
                        {searchResults.length > 0 ? (
                          searchResults.map((stop) => (
                            <button
                              key={stop.id}
                              type="button"
                              onClick={() => {
                                onSelectStop(stop);
                                setSearchTerm('');
                                document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-night-800 flex items-center justify-between text-xs border-b border-night-800 last:border-0"
                            >
                              <div>
                                <span className="font-bold text-white">{stop.name}</span>
                                <span className="text-slate-400 ml-2 font-mono">({stop.code})</span>
                                <p className="text-[11px] text-slate-500">{stop.road}</p>
                              </div>
                              <span className="text-brand-400 text-[11px] font-semibold">
                                {stop.services.length} services
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-xs text-slate-400">
                            No stop found matching &quot;{searchTerm}&quot;. Try &quot;Marina Bay&quot;, &quot;03511&quot; or &quot;Orchard&quot;.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    id="btn-search-stop"
                    type="submit"
                    className="h-12 px-7 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition shadow-md whitespace-nowrap cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Search by stop name, road, or 5-digit stop number</p>
              </form>

              {/* Big Locate Nearest Stop Action Button (Matches Screenshot) */}
              <button
                id="btn-locate-nearest"
                type="button"
                onClick={handleLocateClick}
                disabled={isLocating}
                className="w-full h-13 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold text-base flex items-center justify-center gap-2.5 transition shadow-lg shadow-brand-600/20 cursor-pointer disabled:opacity-75"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Locating 5 closest stops...</span>
                  </>
                ) : locateStatus ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" />
                    <span>{locateStatus}</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-5 h-5 -rotate-45" />
                    <span>Locate Nearest Stop</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* PANEL 2: Address-to-Address Commute Planner */}
          {activeTab === 'smart-commute' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Address Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider" htmlFor="input-origin">
                      Current Address / Origin
                    </label>
                    <button
                      type="button"
                      id="btn-use-curr-loc"
                      onClick={handleUseGpsOrigin}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 transition cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      Use GPS
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                    </div>
                    <input
                      id="input-origin"
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Enter starting address, MRT or postal code..."
                      className="w-full h-12 pl-9 bg-night-950/80 border border-night-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* Destination Address Input Field */}
                <div>
                  <label className="block text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5" htmlFor="input-destination">
                    Destination Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
                    </div>
                    <input
                      id="input-destination"
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination, landmark or 5-digit bus stop..."
                      className="w-full h-12 pl-9 bg-night-950/80 border border-night-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Transit Preferences & Timing Filter Chips */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-medium">Mode:</span>
                  {['Fastest (MRT + Bus)', 'Direct Bus Only', 'Fewer Transfers'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreference(mode)}
                      className={`preference-chip px-2.5 py-1 rounded font-medium border transition cursor-pointer ${
                        preference === mode
                          ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                          : 'bg-night-800 text-slate-400 hover:text-white border-night-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Depart:</span>
                  <select
                    value={departTime}
                    onChange={(e) => setDepartTime(e.target.value)}
                    className="bg-night-950 border border-night-700 rounded px-2 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer"
                  >
                    <option>Depart Now</option>
                    <option>Arrive By</option>
                    <option>First Bus Tomorrow</option>
                  </select>
                </div>
              </div>

              {/* Calculate Commute Action Button */}
              <button
                id="btn-plan-journey"
                type="button"
                onClick={handleCalculateCommute}
                disabled={isCalculatingRoute}
                className="w-full h-13 py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold text-base flex items-center justify-center gap-2.5 transition shadow-lg shadow-brand-600/20 cursor-pointer disabled:opacity-75"
              >
                {isCalculatingRoute ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating Singapore Transit Route...</span>
                  </>
                ) : plannedRouteResult ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>{plannedRouteResult.title} ({plannedRouteResult.duration})</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5" />
                    <span>Calculate Optimal Commute Route</span>
                  </>
                )}
              </button>

              {/* Planned Route Preview Summary Card */}
              {plannedRouteResult && (
                <div className="mt-3 p-3.5 rounded-xl bg-night-950 border border-brand-500/40 text-xs text-slate-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Optimal Recommended Itinerary
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{plannedRouteResult.duration}</span>
                  </div>
                  <div className="space-y-1.5 text-slate-400">
                    {plannedRouteResult.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
