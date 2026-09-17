import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCw, Star, ArrowUpRight, AlertTriangle, Clock, RefreshCw, Radio, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BusStop, BusArrival } from '../types';

interface ArrivalsPanelProps {
  selectedStop: BusStop;
  onSelectBusService: (serviceNumber: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (stopId: string) => void;
}

type PanelState = 'loading' | 'ok' | 'empty' | 'refused' | 'busy' | 'unreachable' | 'my key not set';

export const ArrivalsPanel: React.FC<ArrivalsPanelProps> = ({
  selectedStop,
  onSelectBusService,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [panelState, setPanelState] = useState<PanelState>('loading');
  const [lastUpdated, setLastUpdated] = useState<string>('Checking...');
  const [arrivals, setArrivals] = useState<BusArrival[]>([]);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [simulationMode, setSimulationMode] = useState<string>('live');
  const [showTestControls, setShowTestControls] = useState<boolean>(false);
  const [lastResponseStatus, setLastResponseStatus] = useState<number | null>(null);

  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setRetryCountdown(null);
  };

  const fetchArrivals = useCallback(async (stopCode: string, simulate: string = 'live') => {
    clearTimers();
    setPanelState('loading');

    let url = `/api/bus?BusStopCode=${encodeURIComponent(stopCode)}`;
    if (simulate && simulate !== 'live') {
      url += `&simulate=${encodeURIComponent(simulate)}`;
    }

    try {
      const res = await fetch(url);
      setLastResponseStatus(Number(res.status));

      const data = await res.json().catch(() => null);

      if (!data) {
        setPanelState('refused');
        return;
      }

      const receivedState: PanelState = data.state || 'refused';
      setPanelState(receivedState);

      if (receivedState === 'ok') {
        const rawServices = Array.isArray(data.services) ? data.services : [];
        const parsed: BusArrival[] = rawServices.map((svc: any) => {
          const rawMinutes = Array.isArray(svc.minutes) ? svc.minutes : [];
          const safeMinutes = rawMinutes
            .map((m: any) => Number(m))
            .filter((m: number) => Number.isFinite(m));

          const firstMin = safeMinutes.length > 0 ? safeMinutes[0] : Number(svc.estMinutes);
          const safeEstMinutes = Number.isFinite(firstMin) ? Math.max(0, firstMin) : 0;

          const nextTimes = safeMinutes.slice(1).map((m: number) => `${m} mins`);

          return {
            service: String(svc.service || svc.ServiceNo || ''),
            destination: String(svc.destination || stopCode),
            estMinutes: safeEstMinutes,
            minutes: safeMinutes,
            nextTimes: nextTimes.length > 0 ? nextTimes : (Array.isArray(svc.nextTimes) ? svc.nextTimes : []),
            crowding: svc.crowding || 'Seats Available',
            deckType: svc.deckType || 'Single Deck',
            wheelchair: Boolean(svc.wheelchair),
            status: svc.status || 'On Time',
            operator: svc.operator ? String(svc.operator) : undefined,
          };
        });

        setArrivals(parsed);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } else if (receivedState === 'empty') {
        setArrivals([]);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } else if (receivedState === 'busy') {
        // "The bus service is busy. We will try again in 10 seconds."
        setRetryCountdown(10);
        let secondsLeft = 10;
        countdownIntervalRef.current = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft > 0) {
            setRetryCountdown(secondsLeft);
          } else {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            setRetryCountdown(null);
          }
        }, 1000);

        retryTimerRef.current = setTimeout(() => {
          fetchArrivals(stopCode, simulate);
        }, 10000);
      }
      // For refused, unreachable, my key not set: state is set and previous arrivals remain dimmed or empty
    } catch {
      setPanelState('unreachable');
      setLastResponseStatus(504);
    }
  }, []);

  useEffect(() => {
    fetchArrivals(selectedStop.code, simulationMode);
    return () => {
      clearTimers();
    };
  }, [selectedStop.code, simulationMode, fetchArrivals]);

  const handleManualRefresh = () => {
    fetchArrivals(selectedStop.code, simulationMode);
  };

  const handleSetSimulation = (mode: string) => {
    setSimulationMode(mode);
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
              <span
                className={`w-2 h-2 rounded-full ${
                  panelState === 'ok'
                    ? 'bg-emerald-400 animate-pulse'
                    : panelState === 'loading'
                    ? 'bg-sky-400 animate-spin'
                    : panelState === 'busy'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-rose-400'
                }`}
              />
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
              onClick={handleManualRefresh}
              disabled={panelState === 'loading'}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold bg-night-800 px-2.5 py-1 rounded border border-night-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3 h-3 ${panelState === 'loading' ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Usability Test States Bar (Collapsible for usability tester convenience) */}
        <div className="mt-3 p-2 bg-night-950/90 rounded-lg border border-night-800 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
              <Radio className="w-3 h-3 text-brand-400" />
              <span>Usability Test States:</span>
              <span className="font-mono text-slate-400 text-[10px] ml-1">
                {lastResponseStatus !== null ? `HTTP ${lastResponseStatus}` : ''}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowTestControls(!showTestControls)}
              className="text-[10px] text-brand-400 hover:underline cursor-pointer"
            >
              {showTestControls ? 'Hide Controls' : 'Show Simulator'}
            </button>
          </div>

          {showTestControls && (
            <div className="mt-2 pt-2 border-t border-night-800 flex flex-wrap gap-1.5">
              {[
                { id: 'live', label: 'Live LTA' },
                { id: 'loading', label: 'Loading (6s)' },
                { id: 'empty', label: 'Empty (200)' },
                { id: 'refused', label: 'Refused (502)' },
                { id: 'busy', label: 'Busy (503)' },
                { id: 'unreachable', label: 'Unreachable (504)' },
                { id: 'key_not_set', label: 'Key Not Set (503)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleSetSimulation(btn.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border transition cursor-pointer ${
                    simulationMode === btn.id
                      ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                      : 'bg-night-900 text-slate-400 hover:text-slate-200 border-night-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* State Announcement Sentences */}
        {panelState === 'loading' && (
          <div
            id="state-loading-banner"
            className="mt-3 p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-sky-200 text-xs flex items-center gap-2.5"
          >
            <RefreshCw className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
            <p className="font-medium">Checking bus times from LTA, usually under a second.</p>
          </div>
        )}

        {panelState === 'empty' && (
          <div
            id="state-empty-banner"
            className="mt-4 p-6 rounded-xl bg-night-950 border border-night-800 text-center"
          >
            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-semibold text-slate-300">
              LTA answered, but no buses are listed for this stop right now.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Check operating hours or choose another nearby stop along this corridor.
            </p>
          </div>
        )}

        {panelState === 'refused' && (
          <div
            id="state-refused-banner"
            className="mt-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2.5"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">
                We could not get bus times, so nothing on this panel is current. Please tell us if this stays.
              </p>
              <p className="text-[11px] text-rose-300/80 mt-1">
                The upstream provider refused the request (HTTP 502).
              </p>
            </div>
          </div>
        )}

        {panelState === 'busy' && (
          <div
            id="state-busy-banner"
            className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                The bus service is busy. We will try again in 10 seconds.
              </p>
              {retryCountdown !== null && (
                <p className="text-[11px] text-amber-300/80 mt-1 font-mono">
                  Retrying in {retryCountdown}s... (HTTP 503 Retry-After)
                </p>
              )}
            </div>
          </div>
        )}

        {panelState === 'unreachable' && (
          <div
            id="state-unreachable-banner"
            className="mt-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/60 text-amber-200 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                We could not reach LTA, so nothing on this panel has updated.
              </p>
              <p className="text-[11px] text-amber-300/80 mt-1">
                Upstream connection timed out or could not be reached (HTTP 504).
              </p>
            </div>
          </div>
        )}

        {panelState === 'my key not set' && (
          <div
            id="state-key-not-set-banner"
            className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                LTA_ACCOUNT_KEY is missing or blank in environment variables.
              </p>
              <p className="text-[11px] text-amber-300/80 mt-1">
                Provide an LTA DataMall AccountKey in your environment settings (HTTP 503).
              </p>
            </div>
          </div>
        )}

        {/* Real-time Arrivals List */}
        {arrivals.length > 0 && panelState !== 'empty' && (
          <div
            id="arrivals-container"
            className={`mt-4 space-y-3 transition-opacity duration-200 ${
              panelState === 'loading'
                ? 'opacity-60'
                : panelState === 'refused' || panelState === 'unreachable'
                ? 'opacity-50 grayscale'
                : 'opacity-100'
            }`}
          >
            {arrivals.map((bus) => {
              const estMins = Number(bus.estMinutes);
              const safeMins = Number.isFinite(estMins) ? estMins : 0;
              const isCritical = safeMins <= 1;
              const isModerate = safeMins <= 5 && safeMins > 1;

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
                        {safeMins === 0 ? 'Arr' : `${safeMins} min${safeMins > 1 ? 's' : ''}`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Next:{' '}
                        {bus.nextTimes.length > 0 ? (
                          bus.nextTimes.map((t, idx) => (
                            <span key={idx} className="text-slate-300 mr-1">
                              {t}
                              {idx < bus.nextTimes.length - 1 ? ',' : ''}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500">No scheduled follow-up</span>
                        )}
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
        )}
      </div>

      {/* Notice Footer */}
      <div className="mt-5 p-3 rounded-lg bg-night-950 border border-night-800 text-[11px] text-slate-400 leading-relaxed">
        <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500">
          <span>Telemetry updated: {lastUpdated}</span>
          <span className="text-emerald-400 flex items-center gap-1">
            {panelState === 'ok' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Feed
              </>
            ) : panelState === 'loading' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" /> Fetching
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> State: {panelState}
              </>
            )}
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
