import React from 'react';
import { X, Clock, MapPin } from 'lucide-react';
import { BusServiceDetail } from '../types';

interface RouteModalProps {
  service: BusServiceDetail | null;
  onClose: () => void;
  onViewStop: (stopName: string) => void;
}

export const RouteModal: React.FC<RouteModalProps> = ({ service, onClose, onViewStop }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-night-800 flex items-center justify-between bg-night-950/70">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-brand-600 font-extrabold text-white text-base">
              {service.service}
            </span>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {service.origin} ➔ {service.destination}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {service.stopsCount} stops • Headways {service.frequency}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Operating Hours Card */}
          <div className="p-4 rounded-xl bg-night-950 border border-night-800">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-2.5">
              <Clock className="w-4 h-4" />
              <span>First &amp; Last Bus Timings</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 rounded bg-night-900 border border-night-800">
                <span className="text-slate-500 block text-[10px]">Weekdays</span>
                <span className="font-mono text-slate-200 font-semibold">{service.operatingHours.weekdays}</span>
              </div>
              <div className="p-2 rounded bg-night-900 border border-night-800">
                <span className="text-slate-500 block text-[10px]">Saturdays</span>
                <span className="font-mono text-slate-200 font-semibold">{service.operatingHours.saturdays}</span>
              </div>
              <div className="p-2 rounded bg-night-900 border border-night-800">
                <span className="text-slate-500 block text-[10px]">Sundays</span>
                <span className="font-mono text-slate-200 font-semibold">{service.operatingHours.sundays}</span>
              </div>
            </div>
          </div>

          {/* Major Key Stops */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Route Sequence &amp; Interchanges
            </h4>
            <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-600/40">
              {service.popularStops.map((stop, index) => (
                <div key={index} className="relative flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="absolute -left-6 w-4 h-4 rounded-full bg-night-950 border-2 border-brand-500 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    </span>
                    <span className="text-slate-200 font-medium">{stop}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onViewStop(stop);
                      onClose();
                    }}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    Locate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-night-800 bg-night-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-night-800 hover:bg-night-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};
