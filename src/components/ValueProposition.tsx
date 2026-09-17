import React from 'react';

export const ValueProposition: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
          Real-time bus arrival times for every stop in Singapore
        </h2>
        <p className="text-slate-400 text-base max-w-3xl mx-auto leading-relaxed">
          SmartCommute shows you when your bus is actually coming. Enter a stop name, a road, or the
          five-digit code printed on the bus stop pole, and you get the next three arrivals for every
          service calling there — along with how full each approaching bus is, so you can decide
          whether to squeeze onto this one or wait ninety seconds for the next.
        </p>
      </div>

      {/* Feature Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-night-900 border border-night-700/80 shadow-sm hover:border-brand-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-lg mb-4">
            📡
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Powered by LTA DataMall Live Telemetry
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            The data comes from LTA DataMall, the Land Transport Authority&apos;s official open data
            platform, and is derived from live bus telemetry rather than a printed timetable. That is
            why the numbers shift as you watch them: they are predictions being continuously
            recalculated, not scheduled departure times.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-night-900 border border-night-700/80 shadow-sm hover:border-brand-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
            🔄
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Island-wide Auto-Synchronisation</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Coverage extends to all of Singapore&apos;s roughly 5,000 bus stops and every scheduled bus
            service. Stop records are refreshed twice a month and full route data is resynchronised
            monthly, so new stops and route changes appear without manual delay.
          </p>
        </div>
      </div>
    </section>
  );
};
