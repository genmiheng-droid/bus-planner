import React from 'react';

interface FooterProps {
  onOpenInstall: () => void;
  onOpenAlerts: () => void;
  onSelectGuide: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenInstall,
  onOpenAlerts,
  onSelectGuide,
  onScrollToTop,
}) => {
  return (
    <footer
      className="bg-night-950 border-t border-night-800/80 pt-16 pb-12 text-slate-400 text-sm"
      data-purpose="site-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Description Col */}
          <div className="md:col-span-2 space-y-4">
            <button
              type="button"
              onClick={onScrollToTop}
              className="flex items-center gap-2 text-white font-bold text-xl text-left cursor-pointer"
            >
              <span>🚌</span>
              <span>SmartCommute</span>
            </button>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Free real-time bus arrival times and route information for Singapore. No app download,
              no sign-up required.
            </p>
            <div className="pt-1 text-xs text-slate-500">
              SmartCommute is an independent transit companion. Arrival times are live estimates.
            </div>
          </div>

          {/* Col 1: Plan your trip */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Plan your trip
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={onScrollToTop}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Nearest bus stop
                </button>
              </li>
              <li>
                <a href="#popular-bus" className="hover:text-white transition">
                  Bus route finder
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAlerts}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Service alerts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenInstall}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Install the app
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Guides */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Guides
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#guides" className="hover:text-white transition">
                  All commuting guides
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onSelectGuide}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Bus &amp; MRT fares explained
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onSelectGuide}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  EZ-Link vs SimplyGo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onSelectGuide}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Night bus (Owl) routes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: About */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              About
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition">
                  About SmartCommute
                </a>
              </li>
              <li>
                <a href="mailto:feedback@smartcommute.sg" className="hover:text-white transition">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition">
                  Terms of use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Attribution Disclaimer from Document */}
        <div className="border-t border-night-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Contains information from LTA DataMall and data.gov.sg, accessed 17 September 2026, made available under the terms of the Singapore Open Data Licence version 1.0.
          </p>
          <p>© 2026 SmartCommute. Built for Singapore commuters.</p>
        </div>
      </div>
    </footer>
  );
};
