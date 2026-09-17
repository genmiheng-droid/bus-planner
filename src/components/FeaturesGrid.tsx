import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeaturesGridProps {
  onLocateNearest: () => void;
  onOpenRouteLookup: () => void;
  onOpenBookmarks: () => void;
  onOpenAlerts: () => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  onLocateNearest,
  onOpenRouteLookup,
  onOpenBookmarks,
  onOpenAlerts,
}) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="features">
      <div className="border-t border-night-800 pt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center mb-12">
          What you can do here
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div
            onClick={onLocateNearest}
            className="p-5 rounded-xl bg-night-900/60 border border-night-700/70 hover:bg-night-900 transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="text-2xl mb-3">📍</div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition mb-2">
                Find your nearest stops
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One tap returns the five closest bus stops to your location, ranked by walking
                distance. Location access is optional — search works just as well.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-night-800 text-xs font-semibold text-brand-400 flex items-center justify-between">
              <span>Distance ranked</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={onOpenRouteLookup}
            className="p-5 rounded-xl bg-night-900/60 border border-night-700/70 hover:bg-night-900 transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="text-2xl mb-3">🚌</div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition mb-2">
                Look up any bus route
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter a service number to see every stop in sequence, in both directions, with first and
                last bus timings for weekdays, Saturdays and Sundays.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-night-800 text-xs font-semibold text-brand-400 flex items-center justify-between">
              <span>Full itineraries</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={onOpenBookmarks}
            className="p-5 rounded-xl bg-night-900/60 border border-night-700/70 hover:bg-night-900 transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="text-2xl mb-3">⭐️</div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition mb-2">
                Bookmark daily stops
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Saved in your own browser, so your regular stops are one tap away with no account and no
                login required.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-night-800 text-xs font-semibold text-brand-400 flex items-center justify-between">
              <span>Instant access</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={onOpenAlerts}
            className="p-5 rounded-xl bg-night-900/60 border border-night-700/70 hover:bg-night-900 transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="text-2xl mb-3">⚠️</div>
              <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition mb-2">
                Check service alerts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live MRT disruption and bus diversion notices — worth a glance before you leave rather
                than after you are already on the platform.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-night-800 text-xs font-semibold text-brand-400 flex items-center justify-between">
              <span>LTA alerts live</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
