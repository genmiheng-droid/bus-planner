import React, { useEffect, useState } from 'react';
import { MessageSquare, RotateCw, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: { page: { url?: string; identifier?: string; title?: string } }) => void;
      }) => void;
    };
  }
}

interface TalkToUsProps {
  onBackToHome: () => void;
}

export const TalkToUs: React.FC<TalkToUsProps> = ({ onBackToHome }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [loadedAt, setLoadedAt] = useState<string>('');

  const initDisqus = () => {
    setIsReloading(true);
    // Real fixed canonical configuration values
    const DISQUS_PAGE_URL = `${window.location.origin}/talk-to-us`;
    const DISQUS_PAGE_IDENTIFIER = 'smartcommute-talk-to-us';
    const DISQUS_PAGE_TITLE = 'Talk to Us - SmartCommute Community';

    if (window.DISQUS) {
      // In Single-Page Applications, reloads properly when switching tabs
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = DISQUS_PAGE_URL;
          this.page.identifier = DISQUS_PAGE_IDENTIFIER;
          this.page.title = DISQUS_PAGE_TITLE;
        },
      });
      setTimeout(() => setIsReloading(false), 500);
      setLoadedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      // Initial Disqus configuration with real fixed values
      window.disqus_config = function () {
        (this as any).page.url = DISQUS_PAGE_URL;
        (this as any).page.identifier = DISQUS_PAGE_IDENTIFIER;
        (this as any).page.title = DISQUS_PAGE_TITLE;
      };

      const existingScript = document.getElementById('disqus-embed-script');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = 'disqus-embed-script';
        s.src = 'https://bus-app-1.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.onload = () => {
          setIsReloading(false);
          setLoadedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        s.onerror = () => {
          setIsReloading(false);
        };
        (d.head || d.body).appendChild(s);
      } else {
        setTimeout(() => setIsReloading(false), 800);
        setLoadedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
  };

  useEffect(() => {
    initDisqus();
    // Scroll smoothly to top when tab is opened
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" data-purpose="talk-to-us-view">
      {/* Back button breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition py-1.5 px-3 rounded-lg bg-night-900 border border-night-800 hover:border-night-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Live Commute Map</span>
        </button>

        <button
          type="button"
          onClick={initDisqus}
          disabled={isReloading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 py-1.5 px-3 rounded-lg bg-night-900 border border-night-800 hover:border-night-700 transition cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
          <span>Reload Thread</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-night-900 via-night-900 to-night-850 rounded-2xl border border-night-700/80 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Talk to Us
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
                Have feedback on real-time arrivals, questions about bus services, or suggestions for new Singapore routes? Share your thoughts below with our commuter community.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-night-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Moderated community guidelines for Singapore commuters</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Community thread powered by Disqus • {loadedAt ? `Active (${loadedAt})` : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      {/* Disqus Comments Container */}
      <div className="bg-night-900/90 rounded-2xl border border-night-800 p-6 sm:p-8 shadow-2xl min-h-[460px] relative">
        {/* Loading overlay indicator if reloading */}
        {isReloading && (
          <div className="absolute inset-0 bg-night-900/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-night-950 border border-night-700 text-xs font-medium text-slate-200 shadow-lg">
              <RotateCw className="w-4 h-4 text-brand-400 animate-spin" />
              <span>Loading discussion thread...</span>
            </div>
          </div>
        )}

        {/* Required Disqus Anchor Container */}
        <div id="disqus_thread" className="disqus-container text-slate-200"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-brand-400 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};
