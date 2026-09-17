import React from 'react';
import { X, Star, Trash2, MapPin } from 'lucide-react';
import { BusStop } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: string[];
  allStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onRemoveBookmark: (stopId: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  allStops,
  onSelectStop,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  const bookmarkedStops = allStops.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-night-800 flex items-center justify-between bg-night-950/70">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            <h3 className="text-base font-bold text-white">Your Bookmarked Stops</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          {bookmarkedStops.length > 0 ? (
            bookmarkedStops.map((stop) => (
              <div
                key={stop.id}
                className="p-3.5 rounded-xl bg-night-950 border border-night-800 hover:border-brand-500/50 transition flex items-center justify-between group"
              >
                <div
                  onClick={() => {
                    onSelectStop(stop);
                    onClose();
                    document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="cursor-pointer flex-grow"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition">
                    {stop.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Stop {stop.code} • {stop.road}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {stop.services.map((b) => (
                      <span
                        key={b.service}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                          b.badgeBg || 'bg-brand-600'
                        }`}
                      >
                        {b.service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStop(stop);
                      onClose();
                      document.getElementById('transit-map')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded-lg bg-night-900 hover:bg-night-800 text-brand-400 transition cursor-pointer"
                    title="View arrivals"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(stop.id)}
                    className="p-2 rounded-lg bg-night-900 hover:bg-night-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Star className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">No bookmarked stops yet.</p>
              <p className="text-xs text-slate-500">
                Tap the star icon on any bus arrival card to save your daily commute stops for instant
                access.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-night-800 bg-night-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-night-800 hover:bg-night-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
