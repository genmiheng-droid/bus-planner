import React from 'react';
import { BusServiceDetail } from '../types';

interface PopularBusServicesProps {
  services: BusServiceDetail[];
  onSelectService: (serviceName: string) => void;
}

export const PopularBusServices: React.FC<PopularBusServicesProps> = ({
  services,
  onSelectService,
}) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="popular-bus">
      <div className="border-t border-night-800 pt-16">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          Popular bus services
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Jump straight to the full route, stop list and operating hours for some of Singapore&apos;s
          most-searched services.
        </p>

        {/* Quick Links Pill Badges */}
        <div className="flex flex-wrap gap-2.5">
          {services.map((item) => (
            <button
              key={item.service}
              type="button"
              onClick={() => onSelectService(item.service.replace('Bus ', ''))}
              className="px-4 py-2 bg-night-900 hover:bg-brand-600 text-slate-200 hover:text-white rounded-lg border border-night-700 text-sm font-semibold transition shadow-sm cursor-pointer"
            >
              {item.service}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
