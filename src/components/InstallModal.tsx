import React from 'react';
import { X, Smartphone, Monitor, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-night-800 flex items-center justify-between bg-night-950/70">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">
              Install SmartCommute to Home Screen
            </h3>
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
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          <p className="text-xs text-slate-400">
            SmartCommute runs as a Progressive Web App (PWA). No app store download, no tracking,
            and instant access with zero home screen clutter.
          </p>

          {/* iOS Safari */}
          <div className="p-4 rounded-xl bg-night-950 border border-night-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>iPhone &amp; iPad (Safari)</span>
            </div>
            <ol className="text-xs space-y-1.5 text-slate-400 list-decimal list-inside">
              <li>
                Tap the <Share className="w-3.5 h-3.5 inline text-brand-400 mx-1" />{' '}
                <strong className="text-slate-200">Share</strong> button at the bottom of Safari.
              </li>
              <li>Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline text-brand-400 mx-1" /> <strong className="text-slate-200">Add to Home Screen</strong>.</li>
              <li>Tap <strong className="text-slate-200">Add</strong> at the top right corner.</li>
            </ol>
          </div>

          {/* Android Chrome */}
          <div className="p-4 rounded-xl bg-night-950 border border-night-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Android (Chrome / Samsung Internet)</span>
            </div>
            <ol className="text-xs space-y-1.5 text-slate-400 list-decimal list-inside">
              <li>
                Tap the <MoreVertical className="w-3.5 h-3.5 inline text-emerald-400 mx-1" />{' '}
                <strong className="text-slate-200">Three Dots</strong> menu at the top right.
              </li>
              <li>Select <strong className="text-slate-200">Install app</strong> or <strong className="text-slate-200">Add to Home Screen</strong>.</li>
              <li>Confirm the prompt to install the icon.</li>
            </ol>
          </div>

          {/* Desktop */}
          <div className="p-4 rounded-xl bg-night-950 border border-night-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Monitor className="w-4 h-4" />
              <span>Desktop (Chrome, Edge, Brave)</span>
            </div>
            <p className="text-xs text-slate-400">
              Click the <Download className="w-3.5 h-3.5 inline text-purple-400 mx-1" /> install icon in
              the browser address bar to launch SmartCommute as a standalone window.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-night-800 bg-night-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
