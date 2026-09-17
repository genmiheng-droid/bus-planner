import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GuideArticle } from '../types';

interface GuidesSectionProps {
  guides: GuideArticle[];
  onSelectGuide: (guide: GuideArticle) => void;
}

export const GuidesSection: React.FC<GuidesSectionProps> = ({ guides, onSelectGuide }) => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="guides">
      <div className="border-t border-night-800 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Guides for Singapore commuters
            </h2>
            <p className="text-slate-400 text-sm mt-1">Live arrivals answer &quot;when.&quot; These answer everything else.</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectGuide(guides[0])}
            className="text-sm font-semibold text-brand-400 hover:text-brand-300 hidden sm:inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Browse all guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <article
              key={guide.id}
              onClick={() => onSelectGuide(guide)}
              className="p-6 rounded-2xl bg-night-900 border border-night-700/80 hover:border-brand-500/50 transition group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className={`text-xs font-semibold ${guide.categoryColor} uppercase tracking-wider`}>
                  {guide.category}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition mt-1.5 mb-3">
                  {guide.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{guide.excerpt}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-night-800 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {guide.readTime} • {guide.tag}
                </span>
                <span className="text-brand-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                  Read guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
