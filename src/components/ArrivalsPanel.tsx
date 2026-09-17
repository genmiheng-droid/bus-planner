import React, { useState, useEffect } from 'react';
import { RotateCw, Star, ArrowUpRight } from 'lucide-react';
import { BusStop, BusArrival } from '../types';

interface ArrivalsPanelProps {
  selectedStop: BusStop;
  onSelectBusService: (serviceNumber: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (stopId: string) => void;
}

export const ArrivalsPanel: React.FC<ArrivalsPanelProps> = ({
  selectedStop,
  onSelectBusService,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [arrivals, setArrivals] = useState<BusArrival[]>(selectedStop.services);

  // Sync arrivals when stop changes
  useEffect(() => {
    setArrivals(selectedStop.services);
    setLastUpdated('Just now');
  }, [selectedStop]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate micro-variations in arrival timings
      setArrivals((prev) =>
        prev.map((bus) => {
          const delta = Math.random() > 0.6 ? 1 : Math.random() > 0.3 ? 0 : -1;
          const newMin = Math.max(1, bus.estMinutes + delta);
          return {
            ...bus,
            estMinutes: newMin,
          };
        })
      );
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 450);
  };

  return (
    <div
      className="lg:col-span-4 bg-night-900 border-t lg:border-t-0 lg:border-l border-night-700/70 p-5 flex flex-col justify-between"
      data-purpose="live-arrival-telemetry"
    >
      <div>
        {/* Stop Header */}
        <div className="flex items-center justify-between pb-3 border-b border-night-800">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {selectedStop.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Stop {selectedStop.code} • {selectedStop.road}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark stop'}
              onClick={() => onToggleBookmark(selectedStop.id)}
              className={`p-1.5 rounded border transition cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-night-800 text-slate-400 hover:text-white border-night-700'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Save stop'}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold bg-night-800 px-2.5 py-1 rounded border border-night-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Real-time Arrivals List */}
        <div
          id="arrivals-container"
          className={`mt-4 space-y-3 transition-opacity duration-200 ${
            isRefreshing ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {arrivals.map((bus) => {
            const isCritical = bus.estMinutes <= 1;
            const isModerate = bus.estMinutes <= 5 && bus.estMinutes > 1;

            return (
              <div
                key={bus.service}
                onClick={() => onSelectBusService(bus.service)}
                className="p-3 bg-night-950/80 rounded-xl border border-night-700/80 hover:border-brand-500/60 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-md font-bold text-white text-sm ${
                        bus.badgeBg || 'bg-brand-600'
                      }`}
                    >
                      {bus.service}
                    </span>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-brand-400 transition">
                          {bus.destination}
                        </p>
                        <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-brand-400 transition" />
                      </div>
                      <p
                        className={`text-[11px] font-medium ${
                          bus.crowding === 'Seats Available'
                            ? 'text-emerald-400'
                            : bus.crowding === 'Standing Available'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {bus.deckType} {bus.wheelchair ? '• Wheelchair' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-base font-extrabold font-mono ${
                        isCritical
                          ? 'text-emerald-400 animate-pulse'
                          : isModerate
                          ? 'text-amber-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {bus.estMinutes === 0 ? 'Arr' : `${bus.estMinutes} min${bus.estMinutes > 1 ? 's' : ''}`}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Next:{' '}
                      {bus.nextTimes.map((t, idx) => (
                        <span key={idx} className="text-slate-300 mr-1">
                          {t}
                          {idx < bus.nextTimes.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Crowding Bar Indicator */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-night-800">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        bus.crowding === 'Seats Available'
                          ? 'bg-emerald-500'
                          : bus.crowding === 'Standing Available'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    {bus.crowding}
                  </span>
                  <span className="font-mono text-slate-500">{bus.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice Footer */}
      <div className="mt-5 p-3 rounded-lg bg-night-950 border border-night-800 text-[11px] text-slate-400 leading-relaxed">
        <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500">
          <span>Telemetry updated: {lastUpdated}</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live Feed
          </span>
        </div>
        <p>
          <span className="text-slate-200 font-medium">⚡ Continuously Recalculated:</span> Times are derived from GPS
          telemetry and refresh dynamically with traffic lights and stop dwell times.
        </p>
      </div>
    </div>
  );
};
