import React, { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenInstall: () => void;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInstall, onOpenAlerts }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-night-900/90 backdrop-blur-md border-b border-night-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          aria-label="SmartCommute Home"
          className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight transition hover:opacity-90"
        >
          <span className="text-2xl drop-shadow">🚌</span>
          <span className="font-extrabold text-white text-lg sm:text-xl">SmartCommute</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#" className="text-white hover:text-brand-400 transition-colors py-1">
            Home
          </a>
          <a href="#popular-bus" className="hover:text-brand-400 transition-colors py-1">
            Bus Routes
          </a>
          <button
            onClick={onOpenAlerts}
            className="hover:text-brand-400 transition-colors py-1 text-slate-300 flex items-center gap-1.5"
          >
            <span>Updates</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <a href="#transit-map" className="hover:text-brand-400 transition-colors py-1">
            MRT Map
          </a>
          <a href="#guides" className="hover:text-brand-400 transition-colors py-1">
            Blog
          </a>
        </nav>

        {/* Header Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenInstall}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-600/30 text-brand-300 border border-brand-500/40 hover:bg-brand-600/50 hover:text-white transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            Install App
          </button>

          <button
            id="mobile-menu-btn"
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-night-800 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-night-700/60 bg-night-900 px-4 pt-2 pb-4 space-y-2 text-sm">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-white hover:bg-night-800"
          >
            Home
          </a>
          <a
            href="#popular-bus"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-night-800"
          >
            Bus Routes
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAlerts();
            }}
            className="w-full text-left px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-night-800 flex items-center justify-between"
          >
            <span>Service Updates &amp; Alerts</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <a
            href="#transit-map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-night-800"
          >
            MRT Map
          </a>
          <a
            href="#guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-300 hover:bg-night-800"
          >
            Blog
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenInstall();
            }}
            className="w-full text-left px-3 py-2 rounded-md font-medium text-brand-400 hover:bg-night-800 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Install App on Phone
          </button>
        </div>
      )}
    </header>
  );
};
