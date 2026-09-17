import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TransitAlert } from '../types';

interface AlertsModalProps {
  alerts: TransitAlert[];
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ alerts, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-night-900 border border-night-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-night-800 flex items-center justify-between bg-night-950/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-bold text-white">
              Singapore Transit Alerts &amp; Advisories
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
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-400">
            Real-time feed synchronised with Land Transport Authority (LTA) incident logs, bus route
            diversions, and train headway telemetry.
          </p>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${
                  alert.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-night-950 border-night-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    {alert.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : alert.type === 'mrt' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Info className="w-4 h-4 text-brand-400" />
                    )}
                    <span className={alert.severity === 'warning' ? 'text-amber-400' : 'text-slate-200'}>
                      {alert.lineOrService}
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-500">{alert.time}</span>
                </div>

                <h4 className="text-sm font-semibold text-white mb-1">{alert.headline}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-night-800 bg-night-950 flex items-center justify-between text-xs text-slate-500">
          <span>Source: LTA DataMall Service Alerts</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
