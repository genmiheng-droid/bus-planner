import React from 'react';
import { Download } from 'lucide-react';

interface PwaBannerProps {
  onOpenInstall: () => void;
}

export const PwaBanner: React.FC<PwaBannerProps> = ({ onOpenInstall }) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="pwa-install">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-night-900 via-night-850 to-brand-950/40 border border-night-700/80 p-8 sm:p-10 shadow-xl">
        <div className="max-w-2xl relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-4">
            Zero App Store Friction
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Keep it on your home screen
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            SmartCommute can be added to your phone&apos;s home screen and opened like an app — full
            screen, its own icon, straight to the arrivals search. No app store download, no account,
            and it still opens the pages you have already visited when your signal drops.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenInstall}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-semibold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Install SmartCommute
            </button>
            <button
              type="button"
              onClick={onOpenInstall}
              className="text-sm font-medium text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              How to install it on iPhone, Android or desktop
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
